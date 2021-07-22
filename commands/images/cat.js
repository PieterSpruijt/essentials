const { MessageEmbed } = require('discord.js');
const axios = require('axios');

module.exports = {
  name: "cat",
  description: "Get cat",
  category: "images",
  usage: "`cat`",
  run: async (bot, message, args, userinfo) => {
    let url = `https://aws.random.cat/meow`;
    axios
      .get(url)
      .then(async (embed) => {
        let { data } = embed;
        let embed2 = new MessageEmbed()
          .setTitle(`Random cat`)
          .setImage(data.file)
          .setColor(userinfo.color);
        message.channel.send(embed2);
      })
  },
};
