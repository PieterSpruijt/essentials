const { MessageEmbed } = require('discord.js');
const logchannel = require("../../models/logchannel");

module.exports = {
  name: "logchannel",
  description: "Set the logchannel of the guild!",
  category: "config",
  usage: "`logchannel <mention/channelid>`",
  run: async (bot, message, args, userinfo) => {
     support = userinfo.developer
    if (support || message.member.permissions.has(bot.perms.ADMINISTRATOR)) {
      const Channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]);
      if (!Channel) return bot.error(`I can't find that channel`, message.channel);
    //if (!Channel) return message.channel.send(`no channel`)
    var storedSettings = await logchannel.findOne({ gid: message.guild.id });
    if (!storedSettings) {
      // If there are no settings stored for this guild, we create them and try to retrive them again.
      const newSettings = new logchannel({
        gid: message.guild.id,
        logchannel: `None`,
        levels: true,
        economy: false,
      });
      await newSettings.save().catch(()=>{});
      storedSettings = await logchannel.findOne({ gid: message.guild.id });
    }
      if (args[0] == null)
      return message.channel.send(
        `The logchannel for ${message.guild.name} is <#${storedSettings.logchannel}>`
      );
      logchannel.findOne(
        { gid: message.guild.id },
        async (err, data) => {
          if (err) throw err;
            data.gid = message.guild.id,
            data.logchannel = Channel.id
            data.save();
        }
      );
    message.channel.send(`${bot.info.emojis.normal.check} | Set the logchannel to <#${Channel.id}>!`);
    }
    let Embed2 = new MessageEmbed()
        .setDescription(`${bot.info.emojis.normal.cross} | You Dont have Permission to do that! You must be Administrator!`)
        .setColor(userinfo.color);
    if (!support && !message.member.permissions.has(bot.perms.ADMINISTRATOR)) {
      message.channel.send({embeds: [Embed2]})
    }
    
  },
};
