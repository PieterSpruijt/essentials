const { MessageEmbed } = require("discord.js");
const model = require("../../models/invites");
const model2 = require("../../models/joinrole");
const model3 = require("../../models/invitemessages");
const logchannel = require("../../models/logchannel");

module.exports = async (bot, member) => {
  if (member.partial) await member.fetch();
  if (member.guild.id != `859137745812586506`) return;
  try {

    //add joinroles
    var joinroles = await model2.find({ gid: member.guild.id });
    joinroles.forEach(async (r) => {
      let role = member.guild.roles.cache.get(r.Role);
      if (!role) {
        role = member.guild.roles.cache.get(r.Role);
      }
      if (role) {
        member.roles.add(role).catch(() => { });
      }
    })

    //fetch used invite

    member.guild.invites.fetch().then(async (guildInvites) => {
      const data = bot.invites.filter(c => guildInvites.find(i => i.uses > c.uses));
      const invitedata = data.find(i => guildInvites.find(x => x.code === i.code));
      const invite = invitedata ? await member.guild.invites.fetch(invitedata.code) : false;
      var temp = await model3.findOne({ gid: member.guild.id });
      let channel = temp ? member.guild.channels.cache.get(temp.Channel) : false;
      if (!invite || !invite.inviter || !invite.inviter.id) {
        if (temp) {
          if (temp.embed) {
            let embed = new MessageEmbed()
              .setColor(`#e91e63`)
              .setDescription(`I can't trace how **${member.user.tag}** joined!`);
            channel.send({ embeds: [embed] }).catch(() => { })
          } else {
            channel.send(`I can't trace how **${member.user.tag}** joined!`).catch(() => { });
          }
        }
        let embed = new MessageEmbed()
          .setTitle(`Member joined!`)
          .addFields(
            { name: `Username:`, value: member.user.tag },
            { name: `Inviter:`, value: `not found` },
            { name: `Created at:`, value: `<t:${(member.user.createdAt.getTime() / 1000).toFixed(0)}> (<t:${(member.user.createdAt.getTime() / 1000).toFixed(0)}:R>)` },
          )
          .setTimestamp()
          .setColor("BLUE")
        let storedSettings = await logchannel.findOne({ gid: member.guild.id });
        if (!storedSettings) return;
        if (!member.guild.channels.cache.get(storedSettings.logchannel)) return;
        member.guild.channels.cache.get(storedSettings.logchannel).send({ embeds: [embed] })
      } else {




        // This is just to simplify the message being sent below (inviter doesn't have a tag property)
        var inviter = await model.findOne({ gid: member.guild.id, userid: invite.inviter.id });
        if (!inviter) {
          const newSettings = new model({
            gid: member.guild.id,
            userid: invite.inviter.id,
            invites: 0,
            inviter: `None`,
            total: 0,
            left: 0
          });
          await newSettings.save().catch(() => { });
        }
        model.findOne(
          { gid: member.guild.id, userid: invite.inviter.id },
          async (err, data) => {
            if (err) throw err;
            data.invites = data.invites + 1;
            data.total = data.total + 1;
            data.save();
          }
        );
        inviter = await model.findOne({ gid: member.guild.id, userid: invite.inviter.id });
        var user = await model.findOne({ gid: member.guild.id, userid: member.user.id });
        let hasInviter = false;
        if (user) hasInviter = user.inviter != `None` ? true : false;
        if (hasInviter) {
          model.findOne(
            { gid: member.guild.id, userid: user.inviter },
            async (err, data) => {
              if (err) throw err;
              if (data.left > 0) data.left = data.left - 1;
              if (data.total > 0) data.total = data.total - 1;
              data.save();
            }
          );
        } else {
          const newSettings1 = new model({
            gid: member.guild.id,
            userid: member.user.id,
            invites: 0,
            inviter: invite.inviter.id,
            total: 0,
            left: 0
          });
          await newSettings1.save().catch(() => { });
          user = await model.findOne({ gid: member.guild.id, userid: member.user.id });
        }
        var joinmessage = await model3.findOne({ gid: member.guild.id });
        if (joinmessage) {
          let channel = member.guild.channels.cache.get(joinmessage.Channel);
          if (channel) {
            /*
            {user.tag}
            {user.invites}
            {user.username}
            {user.discriminator}
            {inviter.tag}
            {inviter.username}
            {inviter.invites}
            {inviter.discriminator}
            */
            var message = joinmessage.Message;
            message = message.replace(`{user.tag}`, member.user.tag)
            let _minvites = user.invites || 0;
            message = message.replace(`{user.invites}`, _minvites)
            message.replace(`{user.username}`, member.user.username)
            message = message.replace(`{user.discriminator}`, member.user.discriminator)
            let _ = bot.users.cache.get(inviter.userid) || inviter.userid;
            if (bot.users.cache.get(inviter.userid)) _ = bot.users.cache.get(inviter.userid).tag
            message = message.replace(`{inviter.tag}`, _)
            let _2 = bot.users.cache.get(inviter.userid) || inviter.userid;
            if (bot.users.cache.get(inviter.userid)) _2 = bot.users.cache.get(inviter.userid).username
            message = message.replace(`{inviter.username}`, _2)
            let _invites = inviter.invites + 1 || `undefined`;
            message = message.replace(`{inviter.invites}`, _invites)
            let _3 = bot.users.cache.get(inviter.userid) || `undefined`;
            if (bot.users.cache.get(inviter.userid)) _ = bot.users.cache.get(inviter.userid).discriminator
            message = message.replace(`{inviter.discriminator}`, _3)
            if (joinmessage.embed) {
              let embed = new MessageEmbed()
                .setColor(`#e91e63`)
                .setDescription(message)
              channel.send({ embeds: [embed] }).catch(() => { })
            } else {
              channel.send(message).catch(() => { });
            }
          }
        }
        let embed = new MessageEmbed()
          .setTitle(`Member joined!`)
          .addFields(
            { name: `Username:`, value: member.user.tag },
            { name: `Inviter:`, value: `${bot.users.cache.get(invite.inviter.id).tag} (${inviter.invites + 1} invites)` },
            { name: `Created at:`, value: `<t:${(member.user.createdAt.getTime() / 1000).toFixed(0)}> (<t:${(member.user.createdAt.getTime() / 1000).toFixed(0)}:R>)` },
          )
          .setTimestamp()
          .setColor("BLUE")
        let storedSettings = await logchannel.findOne({ gid: member.guild.id });
        if (!storedSettings) return;
        if (!member.guild.channels.cache.get(storedSettings.logchannel)) return;
        member.guild.channels.cache.get(storedSettings.logchannel).send({ embeds: [embed] });




      }
    }).catch(() => {});
  } catch (e) {
    //error
  }
};
