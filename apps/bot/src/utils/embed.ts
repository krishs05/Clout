import { EmbedBuilder } from 'discord.js';

export const BRAND_COLOR = '#818cf8';

export const createEmbed = (title?: string, description?: string) => {
    const embed = new EmbedBuilder()
        .setColor(BRAND_COLOR)
        .setTimestamp()
        .setFooter({
            text: 'Clout • Modern Community Management',
            iconURL: 'https://cdn.discordapp.com/emojis/112233445566778899.png' // Replace with actual bot icon if possible
        });

    if (title) embed.setTitle(title);
    if (description) embed.setDescription(description);

    return embed;
};

export const createErrorEmbed = (message: string) => {
    return new EmbedBuilder()
        .setColor('#ef4444')
        .setTitle('❌ Error')
        .setDescription(message)
        .setTimestamp();
};

export const createSuccessEmbed = (title: string, message: string) => {
    return new EmbedBuilder()
        .setColor('#10b981')
        .setTitle(`✅ ${title}`)
        .setDescription(message)
        .setTimestamp();
};
