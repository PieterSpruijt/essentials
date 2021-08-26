const { MessageEmbed } = require("discord.js");
const model = require("../../models/invites");
const model2 = require("../../models/joinrole");
const model3 = require("../../models/invitemessages");
const logchannel = require("../../models/logchannel");

module.exports = async (bot, member) => {
  const invites = bot.invites
  try {
    var joinroles = await model2.find({ gid: member.guild.id });
    joinroles.forEach(async (r) => {
      let role = member.guild.roles.cache.get(r.Role);
      if (!role) {
        role = member.guild.roles.cache.get(r.Role);
      }
      if (role) {
        member.roles.add(role);
      }
    })

    member.guild.fetchInvites().then(async (guildInvites) => {
      // This is the *existing* invites for the guild.
      const ei = invites[member.guild.id];
      guildInvites.find(i => ei.get(i.code).uses < i.uses);
      if (!guildInvites.find(i => ei.get(i.code).uses < i.uses)) {

      }
      // Update the cached invites for the guild.
      invites[member.guild.id] = guildInvites;
      // Look through the invites, find the one for which the uses went up.
      const invite = guildInvites.find(i => ei.get(i.code).uses < i.uses);
      var temp = await model3.findOne({ gid: member.guild.id });
      let channel = member.guild.channels.cache.get(temp.Channel);
      if (!invite) {
            if (temp) {
              if (temp.embed) {
                let embed = new MessageEmbed()
                .setColor(`#e91e63`)
                .setDescription(`I can't trace how **${member.user.tag}** joined!`);
                channel.send(embed).catch(e => {})
              } else {
                channel.send(`I can't trace how **${member.user.tag}** joined!`).catch(e => {});
              }
            }
            var embed = new MessageEmbed()
        .setTitle(`Member joined!`)
        .addFields(
          { name: `Username:`, value: member.user.tag },
          { name: `Inviter:`, value: `not found` },
          { name: `Created at:`, value: member.user.createdAt },
        )
        .setTimestamp()
        .setColor("BLUE")
      var storedSettings = await logchannel.findOne({ gid: member.guild.id });
      if (!storedSettings) return;
      if (!member.guild.channels.cache.get(storedSettings.logchannel)) return;
      member.guild.channels.cache.get(storedSettings.logchannel).send(embed)

        return;
      }
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
      if (user) {
        model.findOne(
          { gid: member.guild.id, userid: user.inviter },
          async (err, data) => {
            if (err) throw err;
            data.left = data.left - 1;
            data.total = data.total - 1;
            data.save();
          }
        );
      }
      if (!user) {
        const newSettings1 = new model({
          gid: member.guild.id,
          userid: member.user.id,
          invites: 0,
          inviter: `None`,
          total: 0,
          left: 0
        });
        await newSettings1.save().catch(() => { });
        user = await model.findOne({ gid: member.guild.id, userid: member.user.id });
      }
      model.findOne(
        { gid: member.guild.id, userid: member.user.id },
        async (err, data) => {
          if (err) throw err;
          data.inviter = invite.inviter.id;
          data.save();
        }
      );
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
              channel.send(embed).catch(e => {})
            } else {
              channel.send(message).catch(e => {});
            }
        }
      }
      var embed = new MessageEmbed()
        .setTitle(`Member joined!`)
        .addFields(
          { name: `Username:`, value: member.user.tag },
          { name: `Inviter:`, value: `${bot.users.cache.get(invite.inviter.id).tag} (${inviter.invites + 1} invites)` },
          { name: `Created at:`, value: member.user.createdAt },
        )
        .setTimestamp()
        .setColor("BLUE")
      var storedSettings = await logchannel.findOne({ gid: member.guild.id });
      if (!storedSettings) return;
      if (!member.guild.channels.cache.get(storedSettings.logchannel)) return;
      member.guild.channels.cache.get(storedSettings.logchannel).send(embed)
    });
  } catch (e) {}
};
