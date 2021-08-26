const Discord = require('discord.js');
const axios = require('axios').default;
const functions = require('../../functions');
const verifyFlags = {
    0: `Unrestricted`,
    1: `Must have verified email on account`,
    2: `Must be registered on Discord for longer than 5 minutes`,
    3: `Must be a member of the server for longer than 10 minutes`,
    4: `Must have a verified phone number`
}

module.exports = {
    name: "invite-info",
    description: "Get info about an invite!",
    private: false,
    commandOptions: [
        {
            type: 3,
            name: `invite`,
            description: `The invite to get information of`,
            required: true
        }
    ],
    run: async (bot, interaction) => {
        const invite = interaction.options._hoistedOptions[0].value;
        axios
            .get(`https://discord.com/api/v9/invites/${encodeURIComponent(invite)}`).catch(async () => {
                return await interaction.editReply(`I couldn't find the server`);
            })
            .then(async (raw) => {
                const { data } = raw;
                if (!data) return;
                const embed = new Discord.MessageEmbed()
                let guildTimestamp = (await functions.toUnix(data.guild.id)).timestamp;
                let channelTimestamp = (await functions.toUnix(data.channel.id)).timestamp;
                embed.addField(`Invite Information`, data.guild.description ? data.guild.description : `No server description`);
                embed.addFields(
                    { name: `Server ID`, value: data.guild.id, inline: true },
                    { name: `Server Created`, value: `<t:${guildTimestamp}:R>`, inline: true },
                    { name: `Channel ID`, value: data.channel.id, inline: true },
                    { name: `Channel Created`, value: `<t:${channelTimestamp}:R>`, inline: true },
                    { name: `Inviter`, value: `${data.inviter ? `<@${data.inviter.id}> (\`${data.inviter.username}#${data.inviter.discriminator}\`)` : `None`}`, inline: true },
                    //{ name: `Expires`, value: ``, inline: true },
                    {
                        name: `Server Images`, value: `
                        ${data.guild.icon && data.guild.banner && data.guild.splash ? `` : `No data`}
                        ${data.guild.icon ? `[Server Icon](https://cdn.discordapp.com/icons/${data.guild.id}/${data.guild.icon}.png?size=4096)` : ``}
                        ${data.guild.banner ? `[Server Banner](https://cdn.discordapp.com/banners/${data.guild.id}/${data.guild.banner}.png?size=4096)` : ``}
                        ${data.guild.splash ? `[Invite Background](https://cdn.discordapp.com/splashes/${data.guild.id}/${data.guild.spash}.png?size=4096)` : ``}
                        `, inline: true
                    },
                    //{ name: `Server Members`, value: ``, inline: true },
                    { name: `Server Verification Level`, value: verifyFlags[data.guild.verification_level], inline: true },
                );
                if (data.guild.icon) embed.setThumbnail(`https://cdn.discordapp.com/icons/${data.guild.id}/${data.guild.icon}.png?size=4096`)

                await interaction.editReply({ embeds: [embed] });
            });
    },
}