const { MessageEmbed } = require('discord.js');
const GuildSettings = require("../../models/settings");

module.exports = {
  name: "prefix",
  description: "Set the prefix of the guild!",
  category: "config",
  usage: "`prefix <new prefix>`",
  run: async (bot, message, args, userinfo) => {
    var storedSettings = await GuildSettings.findOne({ gid: message.guild.id });
    if (!storedSettings) {
      // If there are no settings stored for this guild, we create them and try to retrive them again.
      const newSettings = new GuildSettings({
        gid: message.guild.id,
        prefix: bot.config.prefix,
        levels: true,
        economy: false,
      });
      await newSettings.save().catch(()=>{});
      storedSettings = await GuildSettings.findOne({ gid: message.guild.id });
    }
    let support = userinfo.developer
    if (support || message.member.permissions.has(bot.perms.ADMINISTRATOR)) {
      if (!args[0])
      return message.channel.send(
        `The prefix for ${message.guild.name} is \`${storedSettings.prefix}\``
      );
      GuildSettings.findOne(
        { gid: message.guild.id },
        async (err, data) => {
          if (err) throw err;
            data.prefix = args[0]
            data.save();
        }
      );
    message.channel.send(`${bot.info.emojis.normal.check} | Set the prefix to \`${args[0]}\`!`);
    }
    let Embed2 = new MessageEmbed()
        .setDescription(`${bot.info.emojis.normal.cross} | You Dont have Permission to do that! You must be Administrator!`)
        .setColor(userinfo.color);
    if (!support && !message.member.permissions.has("ADMINISTRATOR")) {
      message.channel.send({embeds: [Embed2]})
    }
    
    
  },
};
