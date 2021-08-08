const Discord = require('discord.js');
const money = require('../../models/economy');

module.exports = {
  run: async (bot, interaction, userinfo) => {
    const GuildSettings = require("../../models/settings");
    var storedSettings = await GuildSettings.findOne({ gid: interaction.guild.id });
    if (!storedSettings.economy) return bot.error(`Economy is disabled in this guild!`, bot, interaction);
    var userData = await money.findOne({gid: interaction.guild.id, userid: interaction.member.user.id});
    if (!userData || userData.bank === 0) return bot.error(`You don't have any 🍣 to withdraw`, bot, interaction);
    if (parseInt(interaction.data.options[0].value) === userData.bank) {
      money.findOne(
        { gid: interaction.guild.id, userid: interaction.member.user.id},
          async (err, data) => {
            if (err) throw err;
              data.hand = data.hand + userData.bank,
              data.bank = 0;
              data.save();
          }
        );
         return await interaction.editReply(`You withdrawed 🍣 **${userData.bank}**!`);   
    }
    if (!(interaction.data.options[0].value > 0)) return bot.error(`You did not specify a correct amount of 🍣!`, bot, interaction);
    if (userData.bank <= parseInt(interaction.data.options[0].value)) return bot.error(`You don't have so many 🍣 on the bank!`, bot, interaction);
    money.findOne(
      { gid: interaction.guild.id, userid: interaction.member.user.id},
        async (err, data) => {
          if (err) throw err;
            data.hand = data.hand + interaction.data.options[0].value;
            data.bank = data.bank - interaction.data.options[0].value;
            data.save();
        }
      );
      await interaction.editReply(`You withdrawed 🍣 **${interaction.data.options[0].value}**!`);    
  },
};
