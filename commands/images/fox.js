const { MessageEmbed } = require('discord.js');
const axios = require('axios');

module.exports = {
  name: "fox",
  description: "Get fox",
  category: "images",
  usage: "`fox`",
  run: async (bot, message, args, userinfo) => {
    let url = `https://some-random-api.ml/img/fox`;
    axios
      .get(url)
      .then(async (embed) => {
        let { data } = embed;
        let embed2 = new MessageEmbed()
          .setTitle(`Random fox`)
          .setImage(data.link)
          .setColor(userinfo.color);
        message.channel.send(embed2);
      })
  },
};
