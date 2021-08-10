const Discord = require('discord.js');
const afkmodel = require('../../models/afk');
const guildmodel = require('../../models/settings');
const xpdb = require('../../models/xpdb');
const xpTimeout = new Set();
const Timeout = new Set();

module.exports = async function (bot, message) {
    if (message.author.bot) return;
    if (message.channel.type == `DM`) {
        let embed2 = new Discord.MessageEmbed()
            .setColor(`#e91e63`)
            .setDescription(`Message send to Developers!`);
        message.reply({ embeds: [embed2] });

        let logs = new Discord.WebhookClient({ id: bot.config.webhooks["dm-logs"][0], token: bot.config.webhooks["dm-logs"][1] });
        let embed = new Discord.MessageEmbed()
            .setTitle(`New DM to ${bot.user.tag}`)
            .setColor(`#e91e63`)
            .addField(`Author:`, message.author.tag)
            .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
            .addField(`Message:`, message.content)
            .addField(`Attatchment:`, message.attachments || `None`);
        logs.send({ embeds: [embed] });
        return;
    }



    //no DM
    message.channel.messages.fetch();

    let isafk = await afkmodel.findOne({ gid: message.guild.id, userid: message.author.id });
    if (isafk) {
        await afkmodel.deleteOne({ gid: message.guild.id, userid: message.author.id });
        message.channel.send(`<@${message.author.id}>, Welcome back! I removed you afk.`).then(async (m) => {
            setTimeout(() => {
                m.delete().catch(() => { });
            }, 5000);
        })
        if (message.member.displayName.startsWith(`[AFK] `)) {
            let name = message.member.displayName.replace(`[AFK] `, ``);
            message.member.setNickname(name).catch(() => { });
        }
    }
    message.mentions.users.forEach(async (u) => {
        if (
            !message.content.includes('@here') &&
            !message.content.includes('@everyone')
        ) {
            let isafk = await afkmodel.findOne({ gid: message.guild.id, userid: u.id });
            if (isafk) {
                message.channel.send({ embeds: [{ description: `**${u.tag}** is afk: ${isafk.message}`, color: `RED` }] });
            }
        }
    })


    //Getting guild data
    var storedSettings = await guildmodel.findOne({ gid: message.guild.id });
    if (!storedSettings) {
        const newSettings = new guildmodel({
            gid: message.guild.id,
            levels: true,
            economy: false,
        });
        await newSettings.save().catch(() => { });
        storedSettings = await guildmodel.findOne({ gid: message.guild.id });
    }

    //Leveling system
    if (storedSettings.levels) {
        let randomxp = Math.floor(Math.random() * 15) + 10;
        var xp = await xpdb.findOne({ id: `${message.guild.id}_${message.author.id}` });
        if (!xp) {
            // If there are no settings stored for this guild, we create them and try to retrive them again.
            const newUser = new xpdb({
                id: `${message.guild.id}_${message.author.id}`,
                level: 0,
                xp: 0 + randomxp,
                reqXP: 100,
            });
            await newUser.save().catch(() => { });
            xpTimeout.add(`${message.guild.id}_${message.author.id}`);
            xp = await xpdb.findOne({ id: `${message.guild.id}_${message.author.id}` });
            setTimeout(() => {
                Timeout.delete(`${message.guild.id}_${message.author.id}`);
            }, 60000);
        } else {
            if (!xpTimeout.has(`${message.guild.id}_${message.author.id}`)) {
                xp = await xpdb.findOne({ id: `${message.guild.id}_${message.author.id}` });
                xpdb.findOne(
                    { id: `${message.guild.id}_${message.author.id}` },
                    async (err, data) => {
                        if (err) throw err;
                        data.xp = xp.xp + randomxp
                        data.save();
                    }
                );
                xpTimeout.add(`${message.guild.id}_${message.author.id}`);
                setTimeout(() => {
                    xpTimeout.delete(`${message.guild.id}_${message.author.id}`);
                }, 60000);
            }
            if (xp.xp >= xp.reqXP) {
                xpdb.findOne(
                    { id: `${message.guild.id}_${message.author.id}` },
                    async (err, data) => {
                        if (err) throw err;
                        data.xp = 0,
                            data.reqXP = xp.reqXP + 100,
                            data.level = xp.level + 1
                        data.save();
                    }
                ).then(async () => {
                    message.channel.send(`**GG** <@${message.author.id}>, you are now level **${xp.level + 1}**`).catch(() => { })
                    const rewards = require("../../models/lvlreward");
                    var rewardlist = await rewards.find({ gid: message.guild.id, level: xp.level + 1 });
                    if (rewardlist) {
                        rewardlist.forEach(r => {
                            let role = message.guild.roles.cache.get(r.role);
                            if (role) {
                                message.member.roles.add(role).catch(() => { });
                            }

                        })
                    }
                }
                )
            }
        }
    }

}