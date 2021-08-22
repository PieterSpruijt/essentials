const { MessageEmbed } = require('discord.js');
const axios = require('axios');

module.exports = {
  name: "decode",
  description: "Decode text",
  private: false,
  commandOptions: [
    {
      type: 3,
      name: `binary`,
      description: `The binary text`,
      required: true
    }
  ],
  run: async (bot, interaction, userinfo) => {
    let url = `https://some-random-api.ml/binary?decode=${encodeURIComponent(
      interaction.data.options[0].value
    )}`;
    axios
      .get(url)
      .then(async (embed) => {
        let { data } = embed;
        let embed2 = new MessageEmbed()
          .setTitle(`Decode machine`)
          .addField(`Text:`, '```' + data.text + '```')
          .setColor(userinfo.color);
        await interaction.editReply({ embeds: [embed2] });
      })
  },
};
