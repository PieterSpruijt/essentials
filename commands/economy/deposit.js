const Discord = require("discord.js");
const money = require('../../models/economy');
module.exports = {
  run: async (bot, interaction, userinfo) => {
    const GuildSettings = require("../../models/settings");
    var storedSettings = await GuildSettings.findOne({ gid: interaction.guild.id });
    if (!storedSettings.economy) return bot.error(`Economy is disabled in this guild!`, bot, interaction);
    var userData = await money.findOne({gid: interaction.guild.id, userid: interaction.member.user.id});
    if (!userData || userData.hand === 0) return bot.error(`You don't have any 🍣 to deposit`, message.channel);
    if (interaction.data.options[0].value === userData.hand ) {
      money.findOne(
        { gid: interaction.guild.id, userid: interaction.member.user.id},
          async (err, data) => {
            if (err) throw err;
              data.hand = 0,
              data.bank = data.bank + userData.hand;
              data.save();
          }
        );
         return await interaction.editReply(`You deposit 🍣 **${userData.hand}** on the bank!`);
    }
    if (!(interaction.data.options[0].value > 0)) return bot.error(`You did not specify a correct amount of 🍣!`, bot, interaction);
    if (userData.hand <=  interaction.data.options[0].value) return bot.error(`You don't have so many 🍣 in your hand!`, bot, interaction);
    money.findOne(
      { gid: interaction.guild.id, userid: interaction.member.user.id},
        async (err, data) => {
          if (err) throw err;
            data.hand = data.hand - interaction.data.options[0].value;
            data.bank = data.bank + interaction.data.options[0].value;
            data.save();
        }
      );
       return await interaction.editReply(`You deposit 🍣 **${interaction.data.options[0].value}** on the bank!`);
    

  },
};