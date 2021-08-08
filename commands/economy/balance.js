const Discord = require('discord.js');
const money = require('../../models/economy');

module.exports = {
  run: async (bot, interaction, userinfo) => {
    const GuildSettings = require("../../models/settings");
    var storedSettings = await GuildSettings.findOne({ gid: interaction.guild.id });
    if (!storedSettings.economy) return bot.error(`Economy is disabled in this guild!`, bot, interaction);
    let User = interaction.data.options[0] ? interaction.data.options[0].user : interaction.member.user;
    var userData = await money.findOne({ gid: interaction.guild.id, userid: User.id});
    if (!userData) {
       return bot.error(`This user has no 🍣!`, bot, interaction)      
    }
    let embed = new Discord.MessageEmbed()
    .setColor(userinfo.color)
    .setTitle(`${User.tag}'s balance`)  
    .addFields(
      {name: `Hand`, value: `🍣 ` + userData.hand },
      {name: `Bank`, value: `:bank: ` + userData.bank }
    );
   await interaction.editReply({embeds: [embed]})

    
  },
};
