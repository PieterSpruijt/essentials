const { MessageEmbed } = require("discord.js");

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
    var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    var string_length = lenght;
    var password = '';
    for (var i = 0; i < string_length; i++) {
      var rnum = Math.floor(Math.random() * chars.length);
      password += chars.substring(rnum, rnum + 1);
    }
    let embed = new MessageEmbed()
      .setColor(userinfo.color)
      .setTitle(`Password generator`)
      .addField(`Password:`, '```' + password + '```')
    await interaction.eidtReply({ embeds: [embed] });
  },
};
