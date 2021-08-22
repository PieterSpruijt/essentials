const { MessageEmbed } = require("discord.js");
const isgd = require('isgd');

module.exports = {
  name: "url",
  description: "make shortened urls",
  private: false,
  commandOptions: [
    {
      type: 3,
      name: `url`,
      description: `The url`,
      required: true
    },
    {
      type: 3,
      name: `slug`,
      description: `The url slug`,
      required: false
    }
  ],
  timeout: 600000,
  run: async (bot, interaction, userinfo) => {
    const url = interaction.data.options[0].value;
    const text = interaction.data.options[1] ? interaction.data.options[1].value : false;
    if (!text) {
      isgd.shorten(url, async function (res) {
        let Embed3 = new MessageEmbed()
          .setDescription(res)
          .setColor(userinfo.color);
        await interaction.editReply({ embeds: [Embed3] });
      });
    }
    if (text) {
      isgd.custom(url, text, async function (res) {
        let Embed3 = new MessageEmbed()
          .setDescription(res)
          .setColor(userinfo.color);
        await interaction.editReply({ embeds: [Embed3] });
      });
    }

  },
};

