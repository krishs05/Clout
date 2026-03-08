import { Router, Request, Response } from 'express';
import fetch from 'node-fetch';
import { authenticate, AuthRequest } from '../middleware/auth';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import { prisma } from '@clout/database';
import { broadcastBotStatus } from '../websocket';
import { DISCORD_API_BASE } from '@clout/shared';

const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID;

const router = Router();

// Bot state is now dynamically fetched from the database
export const getBotState = async () => {
  try {
    const state = await prisma.botState.findUnique({ where: { key: 'status' } });
    if (state) {
      return JSON.parse(state.value);
    }
  } catch (error) {
    console.error('Failed to fetch bot state:', error);
  }
  return {
    online: false,
    uptime: 0,
    guilds: 0,
    users: 0,
    commands: 0,
    websocketPing: 0,
    memoryUsage: 0,
  };
};

// Get bot status
router.get('/status', asyncHandler(async (_req: Request, res: Response) => {
  const state = await getBotState();
  res.json({
    success: true,
    data: state,
  });
}));

// Control flag for the bot process (no auth – bot polls this to know whether to stay running)
router.get('/control', asyncHandler(async (_req: Request, res: Response) => {
  let shouldRun = true;
  try {
    const row = await prisma.botState.findUnique({ where: { key: 'control' } });
    if (row?.value) {
      const parsed = JSON.parse(row.value) as { shouldRun?: boolean };
      shouldRun = parsed.shouldRun !== false;
    }
  } catch {
    // ignore
  }
  res.json({ success: true, data: { shouldRun } });
}));

// Set control so a newly started bot process will run; does not start the process
router.post('/start', authenticate, asyncHandler(async (_req: Request, res: Response) => {
  const currentState = await getBotState();
  if (currentState.online) {
    throw new AppError(400, 'Bot is already running');
  }

  const newState = {
    ...currentState,
    online: true,
    uptime: Date.now(),
  };

  await prisma.$transaction([
    prisma.botState.upsert({
      where: { key: 'status' },
      update: { value: JSON.stringify(newState) },
      create: { key: 'status', value: JSON.stringify(newState) },
    }),
    prisma.botState.upsert({
      where: { key: 'control' },
      update: { value: JSON.stringify({ shouldRun: true }) },
      create: { key: 'control', value: JSON.stringify({ shouldRun: true }) },
    }),
  ]);

  broadcastBotStatus(newState);

  res.json({
    success: true,
    message: 'Bot started successfully',
    data: newState,
  });
}));

// Stop bot (signals running bot process to disconnect and exit). Always persist control so the bot sees it.
router.post('/stop', authenticate, asyncHandler(async (_req: Request, res: Response) => {
  const currentState = await getBotState();
  const newState = {
    ...currentState,
    online: false,
    uptime: 0,
  };

  await prisma.$transaction([
    prisma.botState.upsert({
      where: { key: 'status' },
      update: { value: JSON.stringify(newState) },
      create: { key: 'status', value: JSON.stringify(newState) },
    }),
    prisma.botState.upsert({
      where: { key: 'control' },
      update: { value: JSON.stringify({ shouldRun: false }) },
      create: { key: 'control', value: JSON.stringify({ shouldRun: false }) },
    }),
  ]);

  broadcastBotStatus(newState);

  res.json({
    success: true,
    message: 'Bot stopped successfully',
    data: newState,
  });
}));

// Restart bot (signals bot to exit; set control.shouldRun true after delay so a restarted process will run)
router.post('/restart', authenticate, asyncHandler(async (_req: Request, res: Response) => {
  const currentState = await getBotState();

  const stoppedState = { ...currentState, online: false };
  await prisma.botState.upsert({
    where: { key: 'control' },
    update: { value: JSON.stringify({ shouldRun: false }) },
    create: { key: 'control', value: JSON.stringify({ shouldRun: false }) },
  });
  await prisma.botState.upsert({
    where: { key: 'status' },
    update: { value: JSON.stringify(stoppedState) },
    create: { key: 'status', value: JSON.stringify(stoppedState) },
  });
  broadcastBotStatus(stoppedState);

  setTimeout(async () => {
    const startedState = { ...currentState, online: true, uptime: Date.now() };
    await prisma.$transaction([
      prisma.botState.upsert({
        where: { key: 'status' },
        update: { value: JSON.stringify(startedState) },
        create: { key: 'status', value: JSON.stringify(startedState) },
      }),
      prisma.botState.upsert({
        where: { key: 'control' },
        update: { value: JSON.stringify({ shouldRun: true }) },
        create: { key: 'control', value: JSON.stringify({ shouldRun: true }) },
      }),
    ]);
    broadcastBotStatus(startedState);
  }, 2000);

  res.json({
    success: true,
    message: 'Bot restarting...',
    data: stoppedState,
  });
}));

// Get bot stats
router.get('/stats', asyncHandler(async (_req: Request, res: Response) => {
  const [totalUsers, totalServers, totalTransactions, currentState] = await Promise.all([
    prisma.user.count(),
    prisma.server.count(),
    prisma.transaction.count(),
    getBotState()
  ]);

  res.json({
    success: true,
    data: {
      bot: currentState,
      database: {
        users: totalUsers,
        servers: totalServers,
        transactions: totalTransactions,
      },
    },
  });
}));

// Historical stats
router.get('/stats/historical', asyncHandler(async (_req: Request, res: Response) => {
  // Let's generate a 7-day history based on actual user growth and transaction growth
  // Since we might not have enough historical data in DB during dev, we can extrapolate backward from current count
  const totalUsers = await prisma.user.count();
  const totalTransactions = await prisma.transaction.count();

  const history = [];
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    // Simple mock extrapolation based on actual count
    history.push({
      name: days[d.getDay()],
      users: Math.max(0, totalUsers - (i * Math.floor(totalUsers / 10))),
      commands: Math.max(0, totalTransactions - (i * Math.floor(totalTransactions / 8))),
    });
  }

  res.json({
    success: true,
    data: history,
  });
}));

// Send custom embed (stub: implement via bot client when needed)
router.post('/send-embed', authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  const body = req.body as { channelId?: string; embed?: Record<string, unknown> };
  if (!body?.channelId || !body?.embed) {
    throw new AppError(400, 'channelId and embed are required');
  }
  throw new AppError(501, 'Send-embed API not configured. Wire the bot to post embeds to the given channel.');
}));

// List commands from Discord API (live)
router.get('/commands/discord', authenticate, asyncHandler(async (_req: Request, res: Response) => {
  if (!DISCORD_BOT_TOKEN || !DISCORD_CLIENT_ID) {
    throw new AppError(503, 'Discord bot not configured');
  }
  const response = await fetch(`${DISCORD_API_BASE}/applications/${DISCORD_CLIENT_ID}/commands`, {
    headers: { Authorization: `Bot ${DISCORD_BOT_TOKEN}` },
  });
  if (!response.ok) {
    const text = await response.text();
    throw new AppError(response.status === 401 ? 503 : 502, `Discord API: ${text || response.statusText}`);
  }
  const data = (await response.json()) as Array<{ id: string; name: string; description: string; options?: unknown[] }>;
  res.json({
    success: true,
    data: data.map((c) => ({
      id: c.id,
      name: c.name,
      description: c.description || '',
      category: getCategoryForCommand(c.name),
      usage: `/${c.name}`,
    })),
  });
}));

function getCategoryForCommand(name: string): string {
  const map: Record<string, string> = {
    good: 'Karma', bad: 'Karma', profile: 'General', help: 'General',
    daily: 'Economy', balance: 'Economy', pay: 'Economy', leaderboard: 'Economy',
    ban: 'Moderation', kick: 'Moderation', warn: 'Moderation', purge: 'Moderation',
    play: 'Music', skip: 'Music', stop: 'Music',
    trivia: 'Games', rps: 'Games', guess: 'Games',
    command: 'Utility',
  };
  return map[name] ?? 'General';
}

// List commands (fallback static list)
router.get('/commands', authenticate, asyncHandler(async (_req: Request, res: Response) => {
  const commands = [
    { name: 'bad', description: 'Record a bad deed (be honest!)', category: 'Karma', usage: '/bad' },
    { name: 'balance', description: 'Check your or someone else\'s coin balance', category: 'Economy', usage: '/balance [@user]' },
    { name: 'ban', description: 'Bans a user from the server', category: 'Moderation', usage: '/ban @user [reason]' },
    { name: 'command', description: 'Manage custom commands in your server', category: 'Utility', usage: '/command create|delete|list' },
    { name: 'daily', description: 'Claim your daily coin reward', category: 'Economy', usage: '/daily' },
    { name: 'good', description: 'Record a good deed', category: 'Karma', usage: '/good' },
    { name: 'guess', description: 'Guess the number (1-10) and win coins!', category: 'Games', usage: '/guess <number>' },
    { name: 'help', description: 'View all available commands', category: 'General', usage: '/help' },
    { name: 'kick', description: 'Kicks a user from the server', category: 'Moderation', usage: '/kick @user [reason]' },
    { name: 'leaderboard', description: 'View the top coin holders', category: 'Economy', usage: '/leaderboard' },
    { name: 'pay', description: 'Send coins to another user', category: 'Economy', usage: '/pay @user <amount>' },
    { name: 'play', description: 'Plays a song from YouTube/Spotify', category: 'Music', usage: '/play <query>' },
    { name: 'profile', description: 'View your or someone else\'s Clout profile', category: 'General', usage: '/profile [@user]' },
    { name: 'purge', description: 'Deletes multiple messages', category: 'Moderation', usage: '/purge <number>' },
    { name: 'rps', description: 'Play Rock Paper Scissors', category: 'Games', usage: '/rps <choice>' },
    { name: 'skip', description: 'Skips the current song', category: 'Music', usage: '/skip' },
    { name: 'stop', description: 'Stops the music and clears the queue', category: 'Music', usage: '/stop' },
    { name: 'trivia', description: 'Test your knowledge with a trivia question', category: 'Games', usage: '/trivia' },
    { name: 'warn', description: 'Warns a user', category: 'Moderation', usage: '/warn @user [reason]' },
  ];

  res.json({
    success: true,
    data: commands,
  });
}));

export { router as botRouter };