const { MessageEmbed } = require("discord.js");
const model = require("../../models/invites");
const logchannel = require("../../models/logchannel");

module.exports = async (bot, member) => {
  console.log(`left`)
  try {
    /*
    bot.guilds.cache.get(member.guild.id).invites.fetch().then(guildInvites => {
      bot.invites[member.guild.id] = Array.prototype(guildInvites);
    }).catch(() => {});
    */
    var user = await model.findOne({ gid: member.guild.id, userid: member.user.id });
    if (user) {
      var inviter = await model.findOne({ gid: member.guild.id, userid: user.inviter });
      if (inviter) {
        model.findOne(
          { gid: member.guild.id, userid: user.inviter },
          async (err, data) => {
            if (err) throw err;
            data.invites = data.invites - 1;
            data.left = data.left + 1;
            data.save();
          }
        );
        inviter = await model.findOne({ gid: member.guild.id, userid: user.inviter });
      }
      var embed = new MessageEmbed()
        .setTitle(`Member leaved!`)
        .addFields(
          { name: `Username:`, value: member.user.tag },
          { name: `Inviter:`, value: `${bot.users.cache.get(user.inviter).tag} (${inviter.invites - 1} invites)` },
          { name: `Created at:`, value: `<t:${(member.user.createdAt.getTime() / 1000).toFixed(0)}> (<t:${(member.user.createdAt.getTime() / 1000).toFixed(0)}:R>)` },
        )
        .setTimestamp()
        .setColor("BLUE")

    } else {
      embed = new MessageEmbed()
        .setTitle(`Member leaved!`)
        .addFields(
          { name: `Username:`, value: member.user.tag },
          { name: `Inviter:`, value: `Not found` },
          { name: `Created at:`, value: `<t:${(member.user.createdAt.getTime() / 1000).toFixed(0)}> (<t:${(member.user.createdAt.getTime() / 1000).toFixed(0)}:R>)` },
        )
        .setTimestamp()
        .setColor("BLUE")
    }
    var storedSettings = await logchannel.findOne({ gid: member.guild.id });
    if (!member.guild.channels.cache.get(storedSettings.logchannel)) return;
    member.guild.channels.cache.get(storedSettings.logchannel).send({ embeds: [embed] })

  } catch (e) {
    //error
    console.log(e)
  }
};
