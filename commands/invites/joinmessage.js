const model = require("../../models/invitemessages");
const Discord = require("discord.js");
const defaultmessage = `**{user.tag}** joined the server, invited by **{inviter.tag}** ({inviter.invites} invites)`;

module.exports = {
  name: "joinmessage",
  description: "Join messages!",
  category: "invites",
  usage: "`joinmessage [edit/embed/channel/test/delete]`",
  run: async (bot, message, args, userinfo) => {
    if (!message.member.permissions.has(bot.perms.ADMINISTRATOR)) return bot.error(`You Dont have Permission to do that! You must be Administrator!`, message.channel);
    if (args[0] === `channel`) {
      let channel = message.guild.channels.cache.get(args[1]) || message.mentions.channels.first();
      if (!channel) return bot.error(`I can't find that channel!`);
      var joinmessage = await model.findOne({gid: message.guild.id});
      if (!joinmessage) {
        const newData = new model({
          gid: message.guild.id,
          Message: defaultmessage,
          Channel: channel.id
      });
      newData.save();
      } else {
        model.findOne(
          { gid: message.guild.id },
          async (err, data) => {
            if (err) throw err;
              data.Channel = channel.id
              data.save();
          }
        );
      }
      let embed = new Discord.MessageEmbed()
      .setColor(userinfo.color)
      .setDescription(`<#${channel.id}> is now the new joinmessage channel!`);
      message.channel.send({embeds: [embed]});



    } else if (args[0] === `edit`) {
      if (!args[1]) return message.channel.send("**Options:**\n> `{user.tag}`, `{user.discriminator}`, `{user.invites}`, `{user.username}`, `{inviter.tag}`, `{inviter.username}`, `{inviter.invites}`, `{inviter.discriminator}`\n\nDefault: `" + defaultmessage + "`")
      args.shift()
      let text = args.join(" ");
      var joinmessage = await model.findOne({gid: message.guild.id});
      if (!joinmessage) {
        return bot.error(`You haven't set a channel!`, message.channel)
      } else {
        model.findOne(
          { gid: message.guild.id },
          async (err, data) => {
            if (err) throw err;
              data.Message = text
              data.save();
          }
        );
      }
      let embed = new Discord.MessageEmbed()
      .setColor(userinfo.color)
      .setDescription(`joinmessage set!`);
      message.channel.send({embeds: [embed]});


    } else if (args[0] === `embed`) {
      var joinmessage = await model.findOne({gid: message.guild.id});
      if (!joinmessage) {
        return bot.error(`You haven't set a channel!`, message.channel)
      }
      if (joinmessage.embed) {
        model.findOne(
          { gid: message.guild.id },
          async (err, data) => {
            if (err) throw err;
              data.embed = false
              data.save();
          }
        );
        message.channel.send({embeds: [{color: userinfo.color, description: `Set embed to false!`}]});
      } else {
        model.findOne(
          { gid: message.guild.id },
          async (err, data) => {
            if (err) throw err;
              data.embed = true
              data.save();
          }
        );
        message.channel.send({embeds: [{color: userinfo.color, description: `Set embed to true!`}]});
      }


      
    } else if (args[0] === `delete`) {
      var joinmessage = await model.findOne({gid: message.guild.id});
      if (!joinmessage) return bot.error(`Nothing to disable`, message.channel);
      var deleted = model.deleteMany({gid: message.guild.id});
      message.channel.send({embeds: [{color: userinfo.color, description: `Disabled join messages!`}]});
      
    } else if (args[0] === `test`) {
      var joinmessage = await model.findOne({gid: message.guild.id});
      var message1 = joinmessage.Message;
            message1 = message1.replace(`{user.tag}`, message.author.tag)
            message1 = message1.replace(`{user.invites}`, 5)
            message1 = message1.replace(`{user.username}`, message.author.username)
            message1 = message1.replace(`{user.discriminator}`, message.author.discriminator)
            let _ = bot.users.cache.get(`628205772509151240`) || `628205772509151240`;
            if (bot.users.cache.get(`628205772509151240`)) _ = bot.users.cache.get(`628205772509151240`).tag
            message1 = message1.replace(`{inviter.tag}`, _)
            let _2 = bot.users.cache.get(`628205772509151240`) || `628205772509151240`;
            if (bot.users.cache.get(`628205772509151240`)) _2 = bot.users.cache.get(`628205772509151240`).username
            message1 = message1.replace(`{inviter.username}`, _2)
            message1 = message1.replace(`{inviter.invites}`, 6)
            let _3 = bot.users.cache.get(`628205772509151240`) || undefined;
            if (bot.users.cache.get(`628205772509151240`)) _ = bot.users.cache.get(`628205772509151240`).discriminator
            message1 = message1.replace(`{inviter.discriminator}`, _3)
            if (joinmessage.embed) {
              let embed = new Discord.MessageEmbed()
              .setColor(`#e91e63`)
              .setDescription(message1)
              message.guild.channels.cache.get(joinmessage.Channel).send({embeds: [embed]}).catch(e => {bot.error(`Something went wrong with testing!`, message.channel)}).then(async () => {
                message.channel.send(`Tested!`);
              })
            } else {
              message.guild.channels.cache.get(joinmessage.Channel).send(message1).catch(e => {bot.error(`Something went wrong with testing!`, message.channel)}).then(async () => {
                message.channel.send(`Tested!`);
              })
            }
          
      
    } else {
      return bot.error(`You did not specify a option: edit/embed/channel/test/set`, message.channel);
    }
  },
};
