import { Events, GuildMember, EmbedBuilder, TextChannel } from 'discord.js';
import { prisma } from '@clout/database';

export const name = Events.GuildMemberRemove;
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

        if (!server || !(server.settings as any)?.leaveChannelId) {
            return;
        }

        const channel = member.guild.channels.cache.get((server.settings as any).leaveChannelId) as any;

        if (!channel || !channel.isTextBased()) {
            return;
        }

        const leaveMessage = (server.settings as any).leaveMessage || '{user} has left {server}.';

        // Replace variables
        const formattedMessage = leaveMessage
            .replace(/{user}/g, `**${member.user.tag}**`)
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

        // Also remove member relation in db if needed, but not strictly necessary as Cascade handles most things
        // or just leave it for analytics

    } catch (error) {
        console.error('Error handling guildMemberRemove:', error);
    }
}
