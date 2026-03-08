import { Events, Message, EmbedBuilder, TextChannel } from 'discord.js';
import { prisma } from '@clout/database';

// Simple in-memory spam tracking
const userMessages = new Map<string, { count: number, lastMessage: number }>();
const SPAM_THRESHOLD = 5;
const SPAM_INTERVAL = 5000; // 5 seconds

export const name = Events.MessageCreate;
export const execute = async (message: Message) => {
    if (message.author.bot || !message.guild) return;

    const settings = (await prisma.serverSettings.findUnique({
        where: { serverId: message.guildId! },
    })) as any;

    if (!settings) return;

    let shouldDelete = false;
    let reason = '';

    // 1. Anti-Invite
    if (settings.antiInvitesEnabled) {
        const inviteRegex = /(discord\.(gg|io|me|li)|discordapp\.com\/invite)\/.+/i;
        if (inviteRegex.test(message.content)) {
            shouldDelete = true;
            reason = 'Anti-Invite: Posting Discord invites is not allowed.';
        }
    }

    // 2. Anti-Link
    if (!shouldDelete && settings.antiLinkEnabled) {
        const linkRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/i;
        if (linkRegex.test(message.content)) {
            // Check if user has permissions to post links (e.g. Manage Messages)
            if (!message.member?.permissions.has('ManageMessages')) {
                shouldDelete = true;
                reason = 'Anti-Link: Posting links is not allowed.';
            }
        }
    }

    // 3. Anti-Spam
    if (!shouldDelete && settings.antiSpamEnabled) {
        const now = Date.now();
        const userData = userMessages.get(message.author.id) || { count: 0, lastMessage: now };

        if (now - userData.lastMessage < SPAM_INTERVAL) {
            userData.count++;
        } else {
            userData.count = 1;
        }
        userData.lastMessage = now;
        userMessages.set(message.author.id, userData);

        if (userData.count > SPAM_THRESHOLD) {
            shouldDelete = true;
            reason = 'Anti-Spam: Sending messages too quickly.';
        }
    }

    if (shouldDelete) {
        try {
            await message.delete();

            // Warn user in DM or channel (if possible)
            const embed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('Moderation Action')
                .setDescription(`Your message in **${message.guild.name}** was removed.`)
                .addFields({ name: 'Reason', value: reason })
                .setTimestamp();

            try {
                await message.author.send({ embeds: [embed] });
            } catch (e) {
                // DM failed, send to channel and delete after 5s
                const msg = await (message.channel as any).send(`${message.author}, ${reason}`);
                setTimeout(() => msg.delete().catch(() => { }), 5000);
            }

            // Log to Mod Log channel
            if (settings.modLogChannelId) {
                const logChannel = message.guild.channels.cache.get(settings.modLogChannelId) as any;
                if (logChannel) {
                    const logEmbed = new EmbedBuilder()
                        .setColor('#FFA500')
                        .setTitle('Auto-Mod: Message Removed')
                        .addFields(
                            { name: 'User', value: `${message.author.tag} (${message.author.id})`, inline: true },
                            { name: 'Channel', value: `${message.channel}`, inline: true },
                            { name: 'Reason', value: reason },
                            { name: 'Original Message', value: message.content.substring(0, 1024) }
                        )
                        .setTimestamp();
                    await logChannel.send({ embeds: [logEmbed] });
                }
            }
        } catch (error) {
            console.error('Error in auto-mod:', error);
        }
    }
};
