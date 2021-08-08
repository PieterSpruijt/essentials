
const Discord = require('discord.js');
const money = require('../../models/economy');

module.exports = {
  run: async (bot, interaction, userinfo) => {
    const GuildSettings = require("../../models/settings");
    var storedSettings = await GuildSettings.findOne({ gid: interaction.guild.id });
    if (!storedSettings.economy) return bot.error(`Economy is disabled in this guild!`, bot, interaction);
    let User = interaction.data.options[0].user;
    if (User === interaction.member.user) return bot.error(`You can't give yourself 🍣!`, bot, interaction)
    if (User.bot) return bot.error(`You can't give bots 🍣!`, bot, interaction);
    if (!(interaction.data.options[1].value > 0)) return bot.error(`You did not specify a correct amount of 🍣!`, bot, interaction);
    var userData = await money.findOne({gid: interaction.guild.id, userid: interaction.member.user.id});
    if (!userData) return bot.error(`You don't have any 🍣!`, bot, interaction);
    if (userData.hand <= interaction.data.options[1].value) return bot.error(`You don't have enough 🍣 in your hand!`, bot, interaction);
    var user2Data = await money.findOne({gid: interaction.guild.id, userid: User.id});
    if (!user2Data) {
      const newSettings = new money({ 
        gid: interaction.guild.id,
        userid: User.id,
        bank: 0,
        hand: interaction.data.options[1].value
      });
      await newSettings.save().catch(()=>{});
        money.findOne(
          { gid: interaction.guild.id, userid: interaction.member.user.id},
            async (err, data) => {
              if (err) throw err;
                data.hand = data.hand - interaction.data.options[1].value;
                data.save();
            }
          );
        await interaction.editReply(`You successfully paid **${User.tag}** 🍣 **${interaction.data.options[1].value}**!`);

    } else {
      money.findOne(
        { gid: interaction.guild.id, userid: User.id},
          async (err, data) => {
            if (err) throw err;
              data.hand = data.hand + interaction.data.options[1].value;
              data.save();
          }
        );
        money.findOne(
          { gid: interaction.guild.id, userid: interaction.member.user.id},
            async (err, data) => {
              if (err) throw err;
                data.hand = data.hand - interaction.data.options[1].value;
                data.save();
            }
          );
        interaction.editReply(`You successfully paid **${User.tag}** 🍣 **${interaction.data.options[1].value}**!`);
    }
  },
};
