const { MessageEmbed } = require('discord.js');
const axios = require('axios');

module.exports = {
  name: "color-info",
  description: "Get color",
  private: false,
  commandOptions: [
    {
      type: 3,
      name: `color`,
      description: `The color`,
      required: true
    }
  ],
  run: async (bot, interaction) => {
    const color = interaction.data.options[0].value;
    let url = `https://some-random-api.ml/canvas/colorviewer?hex=${encodeURIComponent(color)}`;
    let url2 = `http://www.thecolorapi.com/id/?hex=${encodeURIComponent(color)}`;
    axios
      .get(url2)
      .catch(() => { return bot.error(`Something went wrong!`, bot, interaction) })
      .then(async (embed) => {
        if (!embed) return;
        let { data } = embed;
        let _ = new MessageEmbed()
          .setTitle(`${color}'s profile`)
          .addFields(
            { name: `Hex:`, value: color },
            { name: `Name:`, value: data.name.value },
            { name: `Rgb:`, value: data.rgb.r + `, ` + data.rgb.g + `, ` + data.rgb.b }
          )
          .setImage(url)
          .setColor(color);
        await interaction.editReply({ embeds: [_] });

      });
  },
};
