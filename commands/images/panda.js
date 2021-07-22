const { MessageEmbed } = require('discord.js');
const axios = require('axios');

module.exports = {
  name: "panda",
  description: "Get panda",
  category: "images",
  usage: "`panda`",
  run: async (bot, message, args, userinfo) => {
    let url = `https://some-random-api.ml/img/panda`;
    axios
      .get(url)
      .then(async (embed) => {
        let { data } = embed;
        let embed2 = new MessageEmbed()
          .setTitle(`Random panda`)
          .setImage(data.link)
          .setColor(userinfo.color);
        message.channel.send(embed2);
      })
  },
};
