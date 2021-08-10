const { MessageEmbed } = require("discord.js");
module.exports = {
  name: "8ball",
  description: "There is a big chance I insult you!",
  private: false,
  commandOptions: [
    {
      type: 3,
      name: `question`,
      description: `The question to ask`,
      required: true
    }
  ],
  run: async (bot, interaction, userinfo) => {
    const text = interaction.data.options[0].value
    let responses = [
      "Yes",
      "No",
      "Absolute",
      "Absolute not",
      "Definetely",
      "Absoloutely",
      "Not in a million years",
    ];
    let response =
      responses[Math.floor(Math.random() * responses.length - 1)];
    let Embed = new MessageEmbed()
      .setTitle(`8Ball!`)
      .setDescription(`Your question: ${text}\nMy reply: ${response}`)
      .setColor(userinfo.color);
    await interaction.editReply({ embeds: [Embed] });


  },
};
