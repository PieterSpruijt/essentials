const { MessageEmbed } = require("discord.js");
const token = require("../../token.json");
var giphy = require('giphy-api')(token.giphy);

module.exports = {
  name: "gif",
  description: "Search a gif!",
  category: "fun",
  usage: "`gif [name]`",
  timeout: 5000,
  run: async (bot, message, args, userinfo) => {
    if(args[0] == null) return bot.error(`You did not specify your text!`, message.channel)
    giphy.random(args[0], function (err, res) {
      const textembed = new MessageEmbed()
                  .setTitle(`First Result for "${args[0]}" on GIPHY`)
                  .setColor(userinfo.color)
                  .setURL(res.data.url)
                  .setImage(`https://media1.giphy.com/media/${res.data.id}/giphy.gif`)
                  .setThumbnail(`https://i.imgur.com/Qf3OBCD.gif`);
      message.channel.send({embeds: [textembed]})
  });
  },
};
