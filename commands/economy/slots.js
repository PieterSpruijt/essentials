const Discord = require('discord.js');
const money = require('../../models/economy');
var slotItems = ["🍇", "🎰", "🍌", "🍉", "🍋", "💸", "🍒"];

module.exports = {
  name: `slots`,
  description: `Play a game of slots!`,
  private: false,
  commandOptions: [
    {
      type: 10,
      name: `amount`,
      description: `Amount of coints to use`,
      required: true
    }
  ],
  timeout: 5000,
  run: async (bot, interaction, userinfo) => {
    const GuildSettings = require("../../models/settings");
    var storedSettings = await GuildSettings.findOne({ gid: interaction.guild.id });
    if (!storedSettings.economy) return bot.error(`Economy is disabled in this guild!`, bot, interaction);
    let wins = interaction.data.options[0].value;
    var userData = await money.findOne({ gid: interaction.guild.id, userid: interaction.member.user.id});
    if (!userData) return bot.error(`You don't have any money!`, bot, interaction);
    if (userData.hand === 0) return bot.error(`You don't have any money on hand!`, bot, interaction);
    if (interaction.data.options[0].value === userData.bank) {
      wins = userData.hand
    }
    if (!(interaction.data.options[0].value > 0)) return bot.error(`You did not specify a correct amount of 🍣!`, bot, interaction);
    if (wins >= userData.hand) return bot.error(`You don't have enough money`, bot, interaction);
    let win = false;
    let number = []
    for (let i = 0; i < 3; i++) { number[i] = Math.floor(Math.random() * slotItems.length); }

    if (number[0] == number[1] && number[1] == number[2]) { 
        wins *= 9
        win = true;
    } else if (number[0] == number[1] || number[0] == number[2] || number[1] == number[2]) { 
        wins *= 2
        win = true;
    }
    if (win) {
      let slotsEmbed1 = new Discord.MessageEmbed()
          .setDescription(`${slotItems[number[0]]} | ${slotItems[number[1]]} | ${slotItems[number[2]]}\n\nYou won \`${wins}\` credits.`)
          .setColor(userinfo.color)
      await interaction.editReply({embeds: [slotsEmbed1]})
      money.findOne(
        { gid: interaction.guild.id, userid: interaction.member.user.id},
          async (err, data) => {
            if (err) throw err;
              data.hand = data.hand + wins;
              data.save();
          }
        );
  } else {
      let slotsEmbed = new Discord.MessageEmbed()
          .setDescription(`${slotItems[number[0]]} | ${slotItems[number[1]]} | ${slotItems[number[2]]}\n\nYou lost \`${wins}\` credits.`)
          .setColor(userinfo.color)
      await interaction.editReply({embeds: [slotsEmbed]});
      money.findOne(
        { gid: interaction.guild.id, userid: interaction.member.user.id},
          async (err, data) => {
            if (err) throw err;
              data.hand = data.hand - wins,
              data.save();
          }
        );
  }
  },
};
