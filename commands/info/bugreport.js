const Discord = require('discord.js');
const token = require('../../token.json');
const buglogs = new Discord.WebhookClient(token.webhooks["bug-reports"][0], token.webhooks["bug-reports"][1]);

module.exports = {
  name: "bugreport",
  description: "Report a bug",
  category: "info",
  usage: "`bugreport [bug]`",
  run: async (bot, message, args, userinfo) => {
    if (!args[0]) return bot.error(` You did not specify your report!`, message.channel);
    let report = args.join(" ");

    buglogs.send(
        new Discord.MessageEmbed()
          .setThumbnail(message.author.displayAvatarURL())
          .setTitle(`New bugreport from ${message.author.tag}!`)
          .setDescription(report)
          .setColor(userinfo.color)
      );
      message.channel.send(`${bot.info.emojis.normal.check} | Your bugreport has been send!`);
  },
};

