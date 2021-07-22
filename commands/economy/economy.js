const emoji = require('../../emojis.json');
const { MessageEmbed } = require('discord.js');
const GuildSettings = require("../../models/settings");

module.exports = {
  name: "economy",
  description: "Set economy on or off!",
  category: "economy",
  usage: "`economy [true/false]`",
  run: async (bot, message, args, userinfo) => {
    var storedSettings = await GuildSettings.findOne({ gid: message.guild.id });
    if (!storedSettings) {
      // If there are no settings stored for this guild, we create them and try to retrive them again.
      const newSettings = new GuildSettings({
        gid: message.guild.id,
        prefix: bot.config.prefix,
        levels: true,
        economy: false
      });
      await newSettings.save().catch(()=>{});
      storedSettings = await GuildSettings.findOne({ gid: message.guild.id });
    }
    if (userinfo.developer || message.member.permissions.has(bot.perms.ADMINISTRATOR)) {
      if (args != `true` && !`false`)
      return message.channel.send(
        `You did not specify true or false`
      );
      if (args[0] === `true`) {
        GuildSettings.findOne(
          { gid: message.guild.id },
          async (err, data) => {
            if (err) throw err;
              data.economy = true
              data.save();
          }
        );
      message.channel.send(`${emoji.normal.check} | Enabled Economy!`);
      }
      if (args[0] === `false`) {
        GuildSettings.findOne(
          { gid: message.guild.id },
          async (err, data) => {
            if (err) throw err;
              data.economy = false
              data.save();
          }
        );
      message.channel.send(`${emoji.normal.check} | Disabled Economy!`);
      }
    }
    let Embed2 = new MessageEmbed()
        .setDescription(`${emoji.normal.cross} | You Dont have Permission to do that! You must be Administrator!`)
        .setColor(userinfo.color);
    if (!userinfo.developer && !message.member.permissions.has(bot.perms.ADMINISTRATOR)) {
      message.channel.send({embeds: [Embed2]})
    }
    
    
  },
};
