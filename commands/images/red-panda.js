const { MessageEmbed } = require('discord.js');
const axios = require('axios');

module.exports = {
  name: "red-panda",
  description: "Get red-panda",
  category: "images",
  usage: "`red-panda`",
  run: async (bot, message, args, userinfo) => {
    let url = `https://some-random-api.ml/img/red_panda`;
    axios
      .get(url)
      .then(async (embed) => {
        let { data } = embed;
        let embed2 = new MessageEmbed()
          .setTitle(`Random red panda`)
          .setImage(data.link)
          .setColor(userinfo.color);
        message.channel.send({embeds: [embed2]});
      })
  },
};
