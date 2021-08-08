const Discord = require('discord.js');
const money = require('../../models/economy');

module.exports = {
  timeout: 3600000,
  run: async (bot, interaction, userinfo) => {
    const GuildSettings = require("../../models/settings");
    var storedSettings = await GuildSettings.findOne({ gid: interaction.guild.id });
    if (!storedSettings.economy) return bot.error(`Economy is disabled in this guild!`, bot, interaction);
    const User = interaction.data.options[0].user;
    if (User === interaction.member.user) return bot.error(`You can't rob yourself!`, bot, interaction);
    if (User.bot) return bot.error(`You can't rob a bot!`, bot, interaction);
    var userData = await money.findOne({gid: interaction.guild.id, userid: interaction.member.user.id});
    var user2Data = await money.findOne({gid: interaction.guild.id, userid: User.id});
    if (!user2Data || user2Data.hand <= 200) {
      return bot.error(`This user hasn't got at least 🍣 200 on hand!`, bot, interaction);
    }
    var rating = Math.floor(Math.random() * 3) + 1;
    var amount = Math.floor(Math.random() * 200) + 1;
    if (rating != 1) return await interaction.editReply(`You got seen by police, try again in 2h!`);
    if (!userData) {
      const newSettings = new money({ 
        gid: interaction.guild.id,
        userid: interaction.member.user.id,
        bank: 0,
        hand: amount
      });
      await newSettings.save().catch(()=>{});
        money.findOne(
          { gid: interaction.guild.id, userid: User.id},
            async (err, data) => {
              if (err) throw err;
                data.hand = data.hand - amount;
                data.save();
            }
          );
        await interaction.editReply(`ou successfully robbed **${User.tag}** and stole 🍣 **${amount}**!`);
    } else {
      money.findOne(
        { gid: interaction.guild.id, userid: interaction.member.user.id},
          async (err, data) => {
            if (err) throw err;
              data.hand = data.hand + amount;
              data.save();
          }
        );
        money.findOne(
          { gid: interaction.guild.id, userid: User.id},
            async (err, data) => {
              if (err) throw err;
                data.hand = data.hand - amount;
                data.save();
            }
          );
          await interaction.editReply(`You successfully robbed **${User.tag}** and stole 🍣 **${amount}**!`);
    }


  },
};
