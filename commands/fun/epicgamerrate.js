const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "epicgamerrate",
  description: "Get how epicgame a user is.",
  private: false,
  commandOptions: [
    {
      type: 6,
      name: `user`,
      description: `The user`,
      required: true
    }
  ],
  run: async (bot, interaction, userinfo) => {
    let user = interaction.data.options[0].user
    let procent = Math.floor(Math.random() * 101);
    let Embed = new MessageEmbed()
      .setTitle(`epic gamer rate machine`)
      .setDescription(`${user.username} is ${procent}% epic gamer 😎`)
      .setColor(userinfo.color);
    await interaction.editReply({ embeds: [Embed] })
  },
};
