import { Events, GuildMember, EmbedBuilder, TextChannel } from 'discord.js';
import { prisma } from '@clout/database';

export const name = Events.GuildMemberAdd;
export const once = false;

export async function execute(member: GuildMember) {
    try {
        const server = await prisma.server.findUnique({
            where: { discordId: member.guild.id },
            include: {
                settings: true,
                embedConfig: {
                    include: { fields: true }
                }
            },
        });

        if (!server || !(server.settings as any)?.welcomeChannelId) {
            return;
        }

        const channel = member.guild.channels.cache.get((server.settings as any).welcomeChannelId) as any;

        if (!channel || !channel.isTextBased()) {
            return;
        }

        const welcomeMessage = (server.settings as any).welcomeMessage || 'Welcome {user} to {server}!';

        // Replace variables
        const formattedMessage = welcomeMessage
            .replace(/{user}/g, `<@${member.id}>`)
            .replace(/{server}/g, member.guild.name)
            .replace(/{memberCount}/g, member.guild.memberCount.toString());

        const embedColor = server.embedConfig?.color || '#5865F2';

        const embed = new EmbedBuilder()
            .setColor(embedColor as any)
            .setDescription(formattedMessage)
            .setAuthor({
                name: member.user.tag,
                iconURL: member.user.displayAvatarURL()
            })
            .setTimestamp();

        await channel.send({ embeds: [embed] });

        // Also add member to db
        const user = await prisma.user.upsert({
            where: { discordId: member.id },
            update: {
                username: member.user.username,
                avatar: member.user.avatar
            },
            create: {
                discordId: member.id,
                username: member.user.username,
                avatar: member.user.avatar,
                goodDeeds: 0,
                badDeeds: 0,
                balance: 0
            }
        });

        await prisma.serverMember.upsert({
            where: {
                serverId_userId: {
                    serverId: server.id,
                    userId: user.id
                }
            },
            update: {},
            create: {
                serverId: server.id,
                userId: user.id
            }
        });

    } catch (error) {
        console.error('Error handling guildMemberAdd:', error);
    }
}
