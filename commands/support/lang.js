const language = require('../../language');
const lang = require('../../lang.json');
const Discord = require('discord.js');
const fs = require('fs');
const { newLanguage } = require('../../language');

module.exports = {
  name: "lang",
  description: "Special developer command!",
  category: "support",
  usage: "`lang [language] [textID] | [translation]`",
  run: async (bot, message, args, userinfo) => {
    if (!userinfo.developer) return bot.error(`You can't do this!`, message.channel);
    if (!lang.languages.includes(args[0].toLowerCase())) return bot.error(bot.x(mesage.guild, "THAT_IS_NOT_A_SUPPORTED_LANGUAGE") + `!`, message.channel);
    let setLang = args[0].toLowerCase();
    var seperator = ` | `;
    let textID;
    let data = args;
    data.shift()
    data = data.join(" ")
    textID = data.split(seperator)[0].toUpperCase().split(` `).join("_")
    let translation = data.split(seperator)[1]
    let embed = new Discord.MessageEmbed()
      .setTitle(`New translation`)
      .addFields(
        { name: `Language:`, value: setLang },
        { name: `TextID:`, value: textID },
        { name: `Translation:`, value: translation }
      );
    message.reply({embeds: [embed]});
    newLanguage(setLang, textID, translation);
  },
};
