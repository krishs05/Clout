import 'dotenv/config';
import { Client, GatewayIntentBits, Collection, Events } from 'discord.js';
import { prisma } from '@clout/database';
import path from 'path';
import fs from 'fs';
import { getControl } from './utils/control';

// Extend Client to include commands
export interface CloutClient extends Client {
  commands: Collection<string, any>;
  cooldowns: Collection<string, Collection<string, number>>;
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.DirectMessages,
  ],
}) as CloutClient;

client.commands = new Collection();
client.cooldowns = new Collection();

// Load commands
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts') || file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  if ('data' in command && 'execute' in command) {
    client.commands.set(command.data.name, command);
  }
}

// Load events
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.ts') || file.endsWith('.js'));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

// Error handling
client.on(Events.Error, (error) => {
  console.error('Discord client error:', error);
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled promise rejection:', error);
});

async function updateBotState() {
  if (!client.user) return;

  const control = await getControl();
  if (!control.shouldRun) {
    console.log('[Clout] Dashboard requested stop; disconnecting and exiting.');
    try {
      await prisma.botState.upsert({
        where: { key: 'status' },
        update: { value: JSON.stringify({ online: false, uptime: 0, guilds: 0, users: 0, commands: 0, websocketPing: 0, memoryUsage: 0 }) },
        create: { key: 'status', value: JSON.stringify({ online: false, uptime: 0, guilds: 0, users: 0, commands: 0, websocketPing: 0, memoryUsage: 0 }) },
      });
    } catch {
      // ignore
    }
    client.destroy();
    process.exit(0);
    return;
  }

  const state = {
    online: true,
    uptime: client.readyTimestamp || Date.now(),
    guilds: client.guilds.cache.size,
    users: client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0),
    commands: client.commands.size,
    websocketPing: client.ws.ping,
    memoryUsage: process.memoryUsage().heapUsed,
  };

  try {
    await prisma.botState.upsert({
      where: { key: 'status' },
      update: { value: JSON.stringify(state) },
      create: { key: 'status', value: JSON.stringify(state) },
    });
  } catch (error) {
    console.error('Failed to update bot state in database:', error);
  }
}

async function main() {
  try {
    await prisma.$connect();
    console.log('✅ Connected to database');

    await client.login(process.env.DISCORD_BOT_TOKEN);
    console.log('✅ Bot logged in');

    try {
      await prisma.botState.upsert({
        where: { key: 'control' },
        update: { value: JSON.stringify({ shouldRun: true }) },
        create: { key: 'control', value: JSON.stringify({ shouldRun: true }) },
      });
    } catch {
      // ignore
    }

    await updateBotState();
    setInterval(updateBotState, 15000);
    setInterval(async () => {
      const c = await getControl();
      if (!c.shouldRun) {
        console.log('Dashboard requested stop; disconnecting and exiting.');
        try {
          await prisma.botState.upsert({
            where: { key: 'status' },
            update: { value: JSON.stringify({ online: false, uptime: 0, guilds: 0, users: 0, commands: 0, websocketPing: 0, memoryUsage: 0 }) },
            create: { key: 'status', value: JSON.stringify({ online: false, uptime: 0, guilds: 0, users: 0, commands: 0, websocketPing: 0, memoryUsage: 0 }) },
          });
        } catch {
          // ignore
        }
        client.destroy();
        process.exit(0);
      }
    }, 1000);
  } catch (error) {
    console.error('Failed to start bot:', error);
    process.exit(1);
  }
}

// Ensure offline status on exit
const cleanup = async () => {
  try {
    await prisma.botState.upsert({
      where: { key: 'status' },
      update: { value: JSON.stringify({ online: false }) },
      create: { key: 'status', value: JSON.stringify({ online: false }) },
    });
  } catch (err) { }
  process.exit(0);
};
process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

main();

export { client };