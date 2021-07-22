const Discord = require('discord.js');
const money = require('../../models/economy');

module.exports = {
  name: "balance",
  description: "Check your balance",
  category: "economy",
  usage: "`balance <userid/mention>`",
  aliases: ['bal'],
  run: async (bot, message, args, userinfo) => {
    const GuildSettings = require("../../models/settings");
    var storedSettings = await GuildSettings.findOne({ gid: message.guild.id });
    if (!storedSettings.economy) return message.channel.send(`Economy is disabled in this guild!`);
    let User = message.mentions.users.first() || bot.users.cache.get(args[0]) || message.author
    var userData = await money.findOne({ gid: message.guild.id, userid: User.id});
    if (!userData) {
       return bot.error(`This user has no 🍣!`, message.channel)      
    }
    let embed = new Discord.MessageEmbed()
    .setColor(userinfo.color)
    .setTitle(`${User.tag}'s balance`)  
    .setThumbnail(User.displayAvatarURL({dynamic: true}))
    .addFields(
      {name: `Hand`, value: `🍣 ` + userData.hand },
      {name: `Bank`, value: `:bank: ` + userData.bank }
    );
    message.channel.send(embed)

    
  },
};
