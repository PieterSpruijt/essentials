const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "ad",
  description: "Advertise your server",
  category: "fun",
  usage: "`ad [text]`",
  run: async (bot, message, args, userinfo) => {
    const test = args.join(" ")
    if (!test.length)
      return bot.error(`You did not specify your ad!`, message.channel)
    bot.channels.cache
      .get(bot.info.ids.adchannel)
      .send({embeds: [
        new MessageEmbed()
          .setThumbnail(message.author.displayAvatarURL())
          .setTitle(`New advertisement from ${message.author.tag}!`)
          .setDescription(test)
          .setColor(userinfo.color)
      ]}
      );
      message.channel.send(`${bot.info.emojis.normal.check} | Your ad has been send!`)
  },
};

