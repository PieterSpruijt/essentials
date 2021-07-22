const { MessageEmbed } = require('discord.js');
const axios = require('axios');

module.exports = {
  name: "duck",
  description: "Get duck",
  category: "images",
  usage: "`duck`",
  run: async (bot, message, args, userinfo) => {
    let url = `https://random-d.uk/api/v2/random`;
    axios
      .get(url)
      .then(async (embed) => {
        let { data } = embed;
          let embed2 = new MessageEmbed()
          .setTitle(`Random duck`)
          .setImage(data.url)
          .setColor(userinfo.color);
        message.channel.send({embeds: [embed2]});
        
      })
  },
};
