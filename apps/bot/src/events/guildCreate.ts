import { Events, Guild } from 'discord.js';
import { prisma } from '@clout/database';

export const name = Events.GuildCreate;
export const once = false;

export async function execute(guild: Guild) {
  try {
    const existing = await prisma.server.findUnique({
      where: { discordId: guild.id },
    });
    if (existing) return;

    const server = await prisma.server.create({
      data: {
        discordId: guild.id,
        name: guild.name,
        icon: guild.iconURL(),
        ownerId: guild.ownerId,
      },
    });

    const ownerId = guild.ownerId;
    if (!ownerId) return;

    const owner = await guild.client.users.fetch(ownerId).catch(() => null);
    const avatarUrl = owner?.avatar
      ? `https://cdn.discordapp.com/avatars/${ownerId}/${owner.avatar}.png`
      : null;
    const user = await prisma.user.upsert({
      where: { discordId: ownerId },
      update: owner ? { username: owner.username, avatar: avatarUrl } : {},
      create: {
        discordId: ownerId,
        username: owner?.username ?? 'Unknown',
        avatar: avatarUrl,
        goodDeeds: 0,
        badDeeds: 0,
        balance: 0,
      },
    });

    await prisma.serverMember.upsert({
      where: {
        serverId_userId: { serverId: server.id, userId: user.id },
      },
      update: {},
      create: {
        serverId: server.id,
        userId: user.id,
      },
    });
  } catch (error) {
    console.error('Error handling guildCreate:', error);
  }
}
