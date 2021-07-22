const Discord = require("discord.js")
let rewards = require("../../models/lvlreward");

module.exports = {
    name: "addreward",
    description: "Add a leveling reward",
    category: "leveling",
    usage: "addrward",
    run: async (bot, message, args, userinfo) => {
        if (!message.member.permissions.has(bot.perms.ADMINISTRATOR)) return bot.error(`You Dont have Permission to do that! You must be Administrator!`, message.channel);
        let number = (await rewards.find({ gid: message.guild.id })).length;
        if (number >= 20) return message.channel.send({ embeds: [{ color: userinfo.color, title: `Ooh, Ooh`, description: `You have reached the limit of reactionroles! Delete some with \`delreward\`` }] })
        let embed = new Discord.MessageEmbed()
            .setColor(userinfo.color)
            .setTitle(`Create level reward`)
            .setDescription(`Progress:`)
            .addFields(
                { name: `Role:`, value: `${bot.info.emojis.animated.loading} | Loading` },
                { name: `Level:`, value: `${bot.info.emojis.animated.loading} | Loading` },
            );
        const embedmessage = await message.channel.send({embeds: [embed]});
        const m = await message.channel.send(`What is the role of the reward?`);
        try {
            let e = await message.channel.awaitMessages(
                (u2) => u2.author.id === message.author.id,
                { time: 30000, max: 1, errors: ["time"] }
            );
            if (e.first().mentions.roles.first() || message.guild.roles.cache.get(e.first().content) || message.guild.roles.cache.find(r => r.name === e.first().content)) {
                const role = e.first().mentions.roles.first() || message.guild.roles.cache.get(e.first().content) || message.guild.roles.cache.find(r => r.name === e.first().content);
                if (message.guild.me.roles.highest.rawPosition <= role.rawPosition) return bot.error(`I don't have the perms to give someone that role!`);
                let embed = new Discord.MessageEmbed()
                    .setColor(userinfo.color)
                    .setTitle(`Create level reward`)
                    .setDescription(`Progress:`)
                    .addFields(
                        { name: `Role:`, value: `${bot.info.emojis.normal.check} | <@&${role.id}>` },
                        { name: `Level:`, value: `${bot.info.emojis.animated.loading} | Loading` },
                    );
                embedmessage.edit({embeds: [embed]});
                m.edit(`What is the needed level to get the role?`);
                e.first().delete().catch(e => { });
                try {
                    let e = await message.channel.awaitMessages(
                        (u2) => u2.author.id === message.author.id,
                        { time: 30000, max: 1, errors: ["time"] }
                    );
                    if (parseInt(e.first().content)) {
                        const number = parseInt(e.first().content);
                        let _ = await rewards.findOne({ gid: message.guild.id, role: role.id, level: number });
                        if (_) return bot.error(`This reward already exists!`, message.channel)
                        const newData = new rewards({
                            gid: message.guild.id,
                            role: role.id,
                            level: number,
                        });
                        newData.save();
                        m.edit(`Reward successfully created`)
                        e.first().delete()
                        let embed = new Discord.MessageEmbed()
                            .setColor(userinfo.color)
                            .setTitle(`Created level reward`)
                            .addFields(
                                { name: `Role:`, value: `${bot.info.emojis.normal.check} | <@&${role.id}>` },
                                { name: `Level:`, value: `${bot.info.emojis.normal.check} | ${number}` },
                            );

                        embedmessage.edit({embeds: [embed]})

                    } else {
                        return bot.error(`That's not a valid number`, message.channel);
                    }

                } catch (e) {
                    return bot.error(`You did not answer`, message.channel);
                }




            } else {
                return bot.error(`I can't find that role!`, message.channel);
            }
        } catch (e) {
            return bot.error(`You did not answer`, message.channel);
        }


    },
};
