const { MessageEmbed } = require('discord.js');
const axios = require('axios');

module.exports = {
  name: "color-info",
  description: "Get color",
  category: "info",
  usage: "`color-info [hex]`",
  run: async (bot, message, args, userinfo) => {
    if (!args[0]) return bot.error(`You did not specify a hex!`, message.channel);
    let url = `https://some-random-api.ml/canvas/colorviewer?hex=${encodeURIComponent(args[0])}`;
    let url2 = `http://www.thecolorapi.com/id/?hex=${encodeURIComponent(args[0])}`;
    axios
      .get(url2)
      .then(async (embed) => {
        let { data } = embed;
        let _ = new MessageEmbed()
          .setTitle(`${args[0]}'s profile`)
          .addFields(
            { name: `Hex:`, value: args[0] },
            { name: `Name:`, value: data.name.value },
            { name: `Rgb:`, value: data.rgb.r + `, ` + data.rgb.g + `, ` + data.rgb.b }
          )
          .setImage(url)
          .setColor(args[0]);
        message.channel.send(_);

      });
  },
};
