const { MessageEmbed } = require('discord.js');
const axios = require('axios');

module.exports = {
  name: "dog",
  description: "Get dog",
  category: "images",
  usage: "`dog`",
  run: async (bot, message, args, userinfo) => {
    let url = `https://dog.ceo/api/breeds/image/random`;
    axios
      .get(url)
      .then(async (embed) => {
        let { data } = embed;
        let embed2 = new MessageEmbed()
          .setTitle(`Random dog`)
          .setImage(data.message)
          .setColor(userinfo.color);
        message.channel.send({embeds: [embed2]});
      })
  },
};
