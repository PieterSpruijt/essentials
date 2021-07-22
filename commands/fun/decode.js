const { MessageEmbed } = require('discord.js');
const axios = require('axios');

module.exports = {
  name: "decode",
  description: "Decode text",
  category: "fun",
  usage: "`decode`",
  run: async (bot, message, args, userinfo) => {
    if (!args[0]) return bot.error(`You did not specify text to decode`, message.channel);
    let url = `https://some-random-api.ml/binary?decode=${encodeURIComponent(
      args.join(" ")
      )}`;
    axios
      .get(url)
      .then(async (embed) => {
        let { data } = embed;
        let embed2 = new MessageEmbed()
          .setTitle(`Decode machine`)
          .addField(`Text:`, '```' +  data.text + '```')
          .setColor(userinfo.color);
        message.channel.send({embeds: [embed2]});
      })
  },
};
