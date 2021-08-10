const math = require('mathjs');
const Discord = require("discord.js");

module.exports = {
  name: "calculate",
  description: "Calculate something!",
  private: false,
  commandOptions: [
    {
      type: 3,
      name: `data`,
      description: `Data to calculate!`,
      required: true
    }
  ],
  run: async (bot, interaction, userinfo) => {
    let resp;

    try {
      resp = math.evaluate(interaction.data.options[0].value)
    } catch (e) {
      return bot.error('Please provide a **valid** question', bot, interaction);
    }

    const embed = new Discord.MessageEmbed()
      .setColor(userinfo.color)
      .setTitle('Calculator')
      .addField('Question', `\`\`\`css\n${interaction.data.options[0].value}\`\`\``)
      .addField('Answer', `\`\`\`css\n${resp}\`\`\``)

    await interaction.editReply({ embeds: [embed] });
  },
};
