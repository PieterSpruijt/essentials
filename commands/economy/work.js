const Discord = require('discord.js');
const money = require('../../models/economy');

module.exports = {
  name: "work",
  description: "Work to get money",
  category: "economy",
  usage: "`work`",
  timeout: 600000,
  run: async (bot, message, args, userinfo) => {
    const GuildSettings = require("../../models/settings");
    var storedSettings = await GuildSettings.findOne({ gid: message.guild.id });
    if (!storedSettings.economy) return message.channel.send(`Economy is disabled in this guild!`);
    let User = message.author;
    var userData = await money.findOne({ gid: message.guild.id, userid: message.author.id});
    if (!userData) {
        // If there are no settings stored for this guild, we create them and try to retrive them again.
      const newSettings = new money({
        gid: message.guild.id,
        userid: message.author.id,
        bank: 0,
        hand: 0
      });
      await newSettings.save().catch(()=>{});
      userData = await money.findOne({ gid: message.guild.id, userid: User.id});
      
    }

    let replies = ['Programmer','Builder','Waiter','Busboy','Chief','Mechanic', 'Hacker']
    let result = Math.floor((Math.random() * replies.length));
        let amount = Math.floor(Math.random() * 80) + 1;
        let embed1 = new Discord.MessageEmbed()
        .setColor(userinfo.color)
        .setDescription(`${bot.info.emojis.normal.check} You worked as a ${replies[result]} and earned 🍣 ${amount}`);
        message.channel.send(embed1)

        money.findOne(
          { gid: message.guild.id, userid: User.id},
            async (err, data) => {
              if (err) throw err;
                data.hand = data.hand + amount;
                data.save();
            }
          );

    

    
  },
};
