const Discord = require('discord.js');
const money = require('../../models/economy');
var slotItems = ["🍇", "🎰", "🍌", "🍉", "🍋", "💸", "🍒"];

module.exports = {
  name: "slots",
  description: "Play a slots game!",
  category: "economy",
  usage: "`slots [amount]`",
  timeout: 5000,
  run: async (bot, message, args, userinfo) => {
    if (!args[0]) return bot.error(`You did not specify an amount!`, message.channel);
    const GuildSettings = require("../../models/settings");
    var storedSettings = await GuildSettings.findOne({ gid: message.guild.id });
    if (!storedSettings.economy) return message.channel.send(`Economy is disabled in this guild!`);
    let wins = parseInt(args[0]);
    var userData = await money.findOne({ gid: message.guild.id, userid: message.author.id});
    if (!userData) return bot.error(`You don't have any money!`, message.channel);
    if (userData.hand === 0) return bot.error(`You don't have any money on hand!`, message.channel);
    if (parseInt(args[0]) === userData.bank || args[0] === `all` || args[0] === `max`) {
      wins = userData.hand
    }
    if (userData.hand <= parseInt(args[0])) {
      if (args[0] != `all` || args[0] != `max` || userData.hand != args[0]) return bot.error(`You don't have enough 🍣!`, message.channel);
    }
    let win = false;
    let number = []
    for (i = 0; i < 3; i++) { number[i] = Math.floor(Math.random() * slotItems.length); }

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
      message.channel.send({embeds: [slotsEmbed1]})
      money.findOne(
        { gid: message.guild.id, userid: message.author.id},
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
      message.channel.send({embeds: [slotsEmbed]});
      money.findOne(
        { gid: message.guild.id, userid: message.author.id},
          async (err, data) => {
            if (err) throw err;
              data.hand = data.hand - wins,
              data.save();
          }
        );
  }
  },
};
