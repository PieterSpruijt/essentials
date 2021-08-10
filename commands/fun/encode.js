const { MessageEmbed } = require('discord.js');
const axios = require('axios');

module.exports = {
  name: "encode",
  description: "Encode text",
  private: false,
  commandOptions: [
    {
      type: 3,
      name: `text`,
      description: `The text`,
      required: true
    }
  ],
  run: async (bot, interaction, userinfo) => {
    let url = `https://some-random-api.ml/binary?text=${encodeURIComponent(
      interaction.data.options[0].value
    )}`;
    axios
      .get(url)
      .then(async (embed) => {
        let { data } = embed;
        let embed2 = new MessageEmbed()
          .setTitle(`Encode machine`)
          .addField(`Binary:`, '```' + data.binary + '```')
          .setColor(userinfo.color);
        await interaction.editReply({ embeds: [embed2] });
      })
  },
};
