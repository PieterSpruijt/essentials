const { MessageEmbed } = require('discord.js');
const GuildSettings = require("../../models/settings");
const lang = require('../../lang.json');
const { setLanguage } = require('../../language');

module.exports = {
  name: "setlanguage",
  description: "Set thebot language of the guild!",
  category: "config",
  usage: "`setlanguage [language]`",
  aliases: ['setlang'],
  run: async (bot, message, args, userinfo) => {
    var storedSettings = await GuildSettings.findOne({ gid: message.guild.id });
    if (message.member.permissions.has(bot.perms.ADMINISTRATOR)) {
      if (!args[0]) return bot.error(bot.x(message.guild, "YOU_DID_NOT_SPECIFY_A_LANGUAGE") + `!`, message.channel);
      if (!lang.languages.includes(args[0].toLowerCase())) return bot.error(`${bot.x(message.guild, "THAT_IS_NOT_A_SUPPORTED_LANGUAGE")}!`, message.channel);
      GuildSettings.findOne(
        { gid: message.guild.id },
        async (err, data) => {
          if (err) throw err;
          data.language = args[0].toLowerCase()
          data.save();
        }
      );
      setLanguage(message.guild, args[0].toLowerCase())
      message.channel.send(`${bot.info.emojis.normal.check} | Set the bot language to \`${args[0].toLowerCase()}\`!`);
    }
    let Embed2 = new MessageEmbed()
      .setDescription(`${bot.info.emojis.normal.cross} | You Dont have Permission to do that! You must be Administrator!`)
      .setColor(userinfo.color);
    if (!message.member.permissions.has(bot.perms.ADMINISTRATOR)) {
      message.channel.send(Embed2)
    }


  },
};
