const { MessageEmbed } = require("discord.js");
const isgd = require('isgd');

module.exports = {
  name: "url",
  description: "make shortened urls",
  category: "utility",
  usage: "`url [site] <text>`",
  timeout: 600000,
  run: async (bot, message, args, userinfo) => {
      if (!args[1]) {
        isgd.shorten(args[0], function(res) {
          let Embed3 = new MessageEmbed()
          .setDescription(res)
          .setColor(userinfo.color);
          message.channel.send({embeds: [Embed3]})
        });
      }
      if (args[1]) {
        isgd.custom(args[0], args[1], function(res) {
          let Embed3 = new MessageEmbed()
          .setDescription(res)
          .setColor(userinfo.color);
          message.channel.send({embeds: [Embed3]})
      });
      }
    
  },
};

