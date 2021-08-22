const { MessageEmbed } = require("discord.js");
var generator = require('generate-password');

module.exports = {
  name: "pwdgen",
  description: "Generate a secure password!",
  private: true,
  commandOptions: [
    {
      type: 10,
      name: `lenght`,
      description: `Lenght of the password`,
      required: false
    }
  ],
  run: async (bot, interaction, userinfo) => {
    if (interaction.data.options[0]) {
      if (interaction.data.options[0].value > 51) return bot.error(`max lenght is 50!`, bot, interaction);
    }
    let lenght = interaction.data.options[0] ? interaction.data.options[0].value : 15;
    var password = generator.generate({
      length: lenght,
      numbers: true
    });
    let embed = new MessageEmbed()
      .setColor(userinfo.color)
      .setTitle(`Password generator`)
      .addField(`Password:`, '```' + password + '```')
    await interaction.eidtReply({ embeds: [embed] });
  },
};
