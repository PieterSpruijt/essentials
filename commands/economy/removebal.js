const Discord = require('discord.js');
const money = require('../../models/economy');

module.exports = {
  run: async (bot, interaction, userinfo) => {
    const GuildSettings = require("../../models/settings");
    var storedSettings = await GuildSettings.findOne({ gid: interaction.guild.id });
    if (!storedSettings.economy) return bot.error(`Economy is disabled in this guild!`, bot, interaction);
    if (!interaction.member.permissions.has(bot.perms.ADMINISTRATOR)) return bot.error(`You doný have Admin perms!`, bot, interaction);

    let User = interaction.data.options[0].user;
    if (User.bot) return bot.error(`Bots can't have  🍣!`, bot, interaction);
    if (!(interaction.data.options[1].value > 0)) return bot.error(`You did not specify a correct amount of 🍣!`, bot, interaction);
    var userData = await money.findOne({gid: interaction.guild.id, userid: User.id});
    if (!userData) {
      bot.error(`This user has no balance!`, bot, interaction);
    } else {
      money.findOne(
        { gid: interaction.guild.id, userid: User.id},
          async (err, data) => {
            if (err) throw err;
              data.hand = data.hand - interaction.data.options[1].value
              data.save();
          }
        );
        await interaction.editReply(`Removed **${interaction.data.options[1].value}** 🍣 of **${User.tag}**'s balance`);
    }
  },
};
