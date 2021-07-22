const Discord = require('discord.js');
const fetch = require("node-fetch");

const ACTIVITIES = {
    "poker": {
        id: "755827207812677713",
        name: "Poker Night"
    },
    "betrayal": {
        id: "773336526917861400",
        name: "Betrayal.io"
    },
    "youtube": {
        id: "755600276941176913",
        name: "YouTube Together"
    },
    "fishington": {
        id: "814288819477020702",
        name: "Fishington.io"
    }
};

module.exports = {
    name: "activity-start",
    description: "Start activity together",
    category: "fun",
    usage: "`activity-start [channelmention/id] [youtube/betrayal/poker/fishington]`",
    run: async (bot, message, args, userinfo) => {
        const channel = message.guild.channels.cache.get(args[0]);
        if (!channel || channel.type !== "voice") return bot.error(`Invalid channel specified!`, message.channel);
        if (!channel.permissionsFor(message.guild.me).has(bot.perms.CREATE_INSTANT_INVITE)) return bot.error('I need `CREATE_INSTANT_INVITE` permission', message.channel);
        const activity = ACTIVITIES[args[1] ? args[1].toLowerCase() : null];
        if (!activity) return bot.error(`You did not specify a correct game: fishington/youtube/betrayal/poker`, message.channel);

        fetch(`https://discord.com/api/v8/channels/${channel.id}/invites`, {
            method: "POST",
            body: JSON.stringify({
                max_age: 86400,
                max_uses: 0,
                target_application_id: activity.id,
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
                .setDescription(`[Click here to start ${activity.name} in ${channel.name}](https://discord.gg/${invite.code})`);
                message.channel.send({embeds: [embed]});
            })
            .catch(e => {
                bot.error(` Could not start **${activity.name}**!`, message.channel)
            })

    },
};