const Discord = require("discord.js")
const rewards = require("../../models/joinrole");

module.exports = {
    name: "addjoinrole",
    description: "Add a join role",
    category: "invites",
    usage: "`addjoinrole [id/mention/name]`",
    run: async (bot, message, args, userinfo) => {
        if (!message.member.permissions.has(bot.perms.ADMINISTRATOR)) return bot.error(`You Dont have Permission to do that! You must be Administrator!`, message.channel);
        if (!args[0]) return bot.error(`You did not specify a role!`, message.channels);
        const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]) || message.guild.roles.cache.find(r => r.name === args.join(" "));
        if (!role) return bot.error(`I can't find that role!`, message.channel);
        if (message.guild.me.roles.highest.rawPosition <= role.rawPosition) return bot.error(`I don't have the perms to give someone that role!`, message.channel);

        let _ = await rewards.findOne({gid: message.guild.id, Role: role.id});
        if (_) return bot.error(`This join role already exist!`, message.channel);
        const newData = new rewards({
            gid: message.guild.id,
            Role: role.id
        });
        newData.save();
        let embed = new Discord.MessageEmbed()
        .setTitle(`Join role created`)
        .setColor(userinfo.color)
        .setDescription(`<@&${role.id}> will now be given at joining!`);
        message.channel.send({embeds: [embed]});

    },
};
