const Discord = require('discord.js');
const fetch = require("node-fetch");

module.exports = {
  name: "yttogether",
  description: "Start YouTube together",
  category: "fun",
  usage: "`yttogether [channelmention/id]`",
  run: async (bot, message, args, userinfo) => {
    const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]);
        if (!channel || channel.type !== "voice") return bot.error(`Invalid channel specified!`, message.channel);
        if (!channel.permissionsFor(message.guild.me).has(bot.perms.CREATE_INSTANT_INVITE)) return bot.error('I need `CREATE_INSTANT_INVITE` permission', message.channel);

        fetch(`https://discord.com/api/v8/channels/${channel.id}/invites`, {
            method: "POST",
            body: JSON.stringify({
                max_age: 86400,
                max_uses: 0,
                target_application_id: "755600276941176913", // youtube together
                target_type: 2,
                temporary: false,
                validate: null
            }),
            headers: {
                "Authorization": `Bot ${bot.token}`,
                "Content-Type": "application/json"
            }
        })
            .then(res => res.json())
            .then(invite => {
                if (invite.error || !invite.code) return message.channel.send("❌ | Could not start **YouTube Together**!");
                let embed = new Discord.MessageEmbed()
                .setDescription(`[Click here to start YouTube together in${channel.name}](https://discord.gg/${invite.code})`);
                message.channel.send({embeds: [embed]});
            })
            .catch(e => {
                bot.error(` Could not start **YouTube Together**!`, message.channel)
            })
  },
};