const Discord = require("discord.js");

module.exports = {
    name: "serverinfo",
    category: "utility",
    description: "Get serverinfo!",
    run: async (bot, interaction, userinfo) => {
        const verifyFlags = {
            "NONE": `Unrestricted`,
            "LOW": `Must have verified email on account`,
            "MEDIUM": `Must be registered on Discord for longer than 5 minutes`,
            "HIGH": `Must be a member of the server for longer than 10 minutes`,
            "HIGHEST": `Must have a verified phone number`
        }
        console.log(interaction.guild)
        const embed = new Discord.MessageEmbed()
            .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
            .setColor(userinfo.color)
            .setTitle(`${interaction.guild.name} server information`)
            .addFields(
                {
                    name: "Server name: ",
                    value: `${interaction.guild.name}`,
                    inline: true,
                },
                {
                    name: "Server id: ",
                    value: `${interaction.guild.id}`,
                    inline: true,
                },
                {
                    name: "Owner: ",
                    value: `<@!${interaction.guild.ownerId}>`,
                    inline: true
                },
                {
                    name: `Server Images`, value: `
                    ${interaction.guild.icon && interaction.guild.banner && interaction.guild.splash ? `No images` : ``}
                    ${interaction.guild.icon ? `[Server Icon](https://cdn.discordapp.com/icons/${interaction.guild.id}/${interaction.guild.icon}.png?size=4096)` : ``}
                    ${interaction.guild.banner ? `[Server Banner](https://cdn.discordapp.com/banners/${interaction.guild.id}/${interaction.guild.banner}.png?size=4096)` : ``}
                    ${interaction.guild.splash ? `[Invite Background](https://cdn.discordapp.com/splashes/${interaction.guild.id}/${interaction.guild.spash}.png?size=4096)` : ``}
                    `, inline: true
                },
                {
                    name: "Verify level: ",
                    value: `${verifyFlags[interaction.guild.verificationLevel]}`,
                    inline: true
                },
                {
                    name: "Boost tier: ",
                    value: `${interaction.guild.premiumTier ? `Tier ${interaction.guild.premiumTier}` : 'None'}`,
                    inline: true
                },
                {
                    name: "Created on: ",
                    value: `<t:${(interaction.channel.guild.createdAt.getTime() / 1000).toFixed(0)}> (<t:${(interaction.channel.guild.createdAt.getTime() / 1000).toFixed(0)}:R>)\n`,
                    inline: false
                },

                {
                    name: "Members: ",
                    value: `${interaction.guild.memberCount}/${interaction.guild.maximumMembers}`,
                    inline: true
                },
                {
                    name: "Bots: ",
                    value: `${interaction.guild.members.cache.filter(member => !member.user.bot).size}`,
                    inline: true
                },
                {
                    name: "Text Channels: ",
                    value: `${interaction.guild.channels.cache.filter(channel => channel.type === 'text').size}`,
                    inline: true
                },
                {
                    name: "Voice Channels: ",
                    value: `${interaction.guild.channels.cache.filter(channel => channel.type === 'voice').size}`,
                    inline: true
                },
                {
                    name: "Roles: ",
                    value: `${interaction.guild.roles.cache.size}`,
                    inline: true
                },
                {
                    name: "Emoji count: ",
                    value: `${interaction.guild.emojis.cache.size  || `None`}`,
                    inline: true
                },
                {
                    name: "Boost count: ",
                    value: `${interaction.guild.premiumSubscriptionCount || 0}`,
                    inline: true
                })
        await interaction.editReply({ embeds: [embed] });
    },
};
