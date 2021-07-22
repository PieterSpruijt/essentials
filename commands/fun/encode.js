const { MessageEmbed } = require('discord.js');
const axios = require('axios');

module.exports = {
  name: "encode",
  description: "Encode text",
  category: "fun",
  usage: "`encode`",
  run: async (bot, message, args, userinfo) => {
    if (!args[0]) return bot.error(`You did not specify text to encode`, message.channel);
    let url = `https://some-random-api.ml/binary?text=${encodeURIComponent(
      args.join(" ")
      )}`;
    axios
      .get(url)
      .then(async (embed) => {
        let { data } = embed;
        let embed2 = new MessageEmbed()
          .setTitle(`Encode machine`)
          .addField(`Binary:`, '```' +  data.binary + '```')
          .setColor(userinfo.color);
        message.channel.send({embeds: [embed2]});
      })
  },
};
