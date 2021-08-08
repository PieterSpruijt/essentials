const Discord = require('discord.js');
const money = require('../../models/economy');

module.exports = {
  run: async (bot, interaction, userinfo) => {
    const GuildSettings = require("../../models/settings");
    var storedSettings = await GuildSettings.findOne({ gid: interaction.guild.id });
    if (!storedSettings.economy) return bot.error(`Economy is disabled in this guild!`, bot, interaction);
    if (!interaction.member.permissions.has(bot.perms.ADMINISTRATOR)) return bot.error(`You doný have Admin perms!`, bot, interaction);

    let User = interaction.data.options[0].user;
    if (!User) return bot.error(`You did not specify an user to send 🍣 to!`, bot, interaction);
    if (User.bot) return bot.error(`You can't give bots 🍣!`, bot, interaction);
    if (!(interaction.data.options[1].value > 0)) return bot.error(`You did not specify a correct amount of 🍣!`, bot, interaction);
    var userData = await money.findOne({gid: interaction.guild.id, userid: User.id});
    if (!userData) {
      const newSettings = new money({ 
        gid: interaction.guild.id,
        userid: User.id,
        bank: 0,
        hand: interaction.data.options[1].value
      });
      await newSettings.save().catch(()=>{});
      await interaction.editReply(`Added **${interaction.data.options[1].value}** 🍣 to **${User.tag}**'s balance`);
    } else {
      money.findOne(
        { gid: interaction.guild.id, userid: User.id},
          async (err, data) => {
            if (err) throw err;
              data.hand = data.hand + interaction.data.options[1].value;
              data.save();
          }
        );
        await interaction.editReply(`Added **${interaction.data.options[1].value}** 🍣 to **${User.tag}**'s balance`);
    }
  },
};
