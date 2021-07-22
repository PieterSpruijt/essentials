const Discord = require('discord.js');
const money = require('../../models/economy');

module.exports = {
  name: "lottery",
  description: "Start a lottery",
  category: "economy",
  usage: "`work`",
  timeout: 600000,
  run: async (bot, message, args, userinfo) => {
    const GuildSettings = require("../../models/settings");
    var storedSettings = await GuildSettings.findOne({ gid: message.guild.id });
    if (!storedSettings.economy) return message.channel.send(`Economy is disabled in this guild!`);
	  
	  var noperms = new Discord.MessageEmbed()
	  .setDescription(`<:Sushi:830763209300377620> | No acces \nYou need the __send messages__ permission to start a lottery!`)
	  .setColor(`#F0838B`)
	  .setTimestamp()
	  .setFooter(`© | Made by Snowy#4099`);
	  
	  if(!message.member.permissiosn.has(bot.perms.ADMINISTRATOR)) return message.channel.send(noperms);
	  
    var User = message.mentions.members.first();
    var userData = await money.findOne({ gid: message.guild.id, userid: message.author.id});
    if (!userData) {
      const newSettings = new money({
        gid: message.guild.id,
        userid: message.author.id,
        bank: 0,
        hand: 0
      });
      await newSettings.save().catch(()=>{});
      userData = await money.findOne({ gid: message.guild.id, userid: User.id});
      
    }

    let replies = ['a car','a motor','a computer','a house','a design','a airplain', 'microphone']
    let result = Math.floor((Math.random() * replies.length));
        let amount = Math.floor(Math.random() * 80) + 1;
        let embed1 = new Discord.MessageEmbed()
        .setDescription(`${bot.info.emojis.normal.check} <@${message.author.id}> selled ${replies[result]} on the lottery and earned 🍣 ${amount} \n\n${message.author.username} lost ${amount} by buying ${replies[result]}`)
		.setColor(userinfo.color);
	  
        message.channel.send(embed1);

        money.findOne(
          { gid: message.guild.id, userid: User.id},
            async (err, data) => {
              if (err) throw err;
                data.hand = data.hand + amount;
                data.save();
            }
          );
		  
		  money.findOne(
          { gid: message.guild.id, userid: message.author.id},
            async (err, data) => {
              if (err) throw err;
                data.hand = data.hand - amount;
                data.save();
            }
          );

    

    
  },
};