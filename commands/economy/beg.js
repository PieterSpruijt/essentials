const Discord = require('discord.js');
const money = require('../../models/economy');

module.exports = {
  timeout: 300000,
  run: async (bot, interaction, userinfo) => {
    const GuildSettings = require("../../models/settings");
    var storedSettings = await GuildSettings.findOne({ gid: interaction.guild.id });
    if (!storedSettings.economy) return bot.error(`Economy is disabled in this guild!`, bot, interaction);
    let User = interaction.member.user;
    var userData = await money.findOne({ gid: interaction.guild.id, userid: interaction.member.user.id});
    if (!userData) {
        // If there are no settings stored for this guild, we create them and try to retrive them again.
      const newSettings = new money({
        gid: interaction.guild.id,
        userid: interaction.member.user.id,
        bank: 0,
        hand: 0
      });
      await newSettings.save().catch(()=>{});
      userData = await money.findOne({ gid: interaction.guild.id, userid: User.id});
      
    }

        let amount = Math.floor(Math.random() * 20) + 1;
        let embed1 = new Discord.MessageEmbed()
        .setColor(userinfo.color)
        .setDescription(`${bot.config.emojis.normal.check} You begged and earned 🍣 **${amount}**!`);
        await interaction.editReply({embeds: [embed1]})

        money.findOne(
          { gid: interaction.guild.id, userid: User.id},
            async (err, data) => {
              if (err) throw err;
                data.hand = data.hand + amount;
                data.save();
            }
          );

    

    
  },
};
