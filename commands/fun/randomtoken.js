const { MessageEmbed } = require('discord.js');
const axios = require('axios');

module.exports = {
  name: "randomtoken",
  description: "Get a random bot token",
  category: "fun",
  usage: "`randomtoken`",
  run: async (bot, message, args, userinfo) => {
    let url = `https://some-random-api.ml/bottoken`;
    axios
      .get(url)
      .then(async (embed) => {
        let { data } = embed;
        let embed2 = new MessageEmbed()
          .setTitle(`Random bot token`)
          .addField(`Token:`, '```' +  data.token + '```')
          .setColor(userinfo.color);
        message.channel.send({embeds: [embed2]});
      })
  },
};
