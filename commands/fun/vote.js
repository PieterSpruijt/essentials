const token = require('../../token.json');
const DBL = require('dblapi.js');
const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "vote",
  description: "get if an user voted the bot",
  category: "fun",
  usage: "`vote [user id]`",
  run: async (bot, message, args, userinfo) => {
    const Embed1 = new MessageEmbed()
        Embed1.setTitle(`You have voted`)
        Embed1.setDescription(`click [HERE](${bot.config.voteurl}) to vote for me in 12 hours!!`)
        Embed1.setColor(`#00ff00`);

const Embed2 = new MessageEmbed()
        Embed2.setTitle(`You have not voted`)
        Embed2.setDescription(`click [HERE](${bot.config.voteurl}) to vote for me!`)
        Embed2.setColor(`#ff0000`);
    let dbl = new DBL(token.dbltoken, bot);

    let support = userinfo.developer;
    if (!support) {
      dbl.hasVoted(message.author.id).then(voted => {
        if (voted) message.channel.send(Embed1);
        if (!voted) message.channel.send(Embed2);
    }).catch(error => {bot.error(`there was an error by checking this vote!`, message.channel)});
    }
    if (support) {
      if (!args.length) {
        dbl.hasVoted(message.author.id).then(voted => {
          if (voted) message.channel.send(Embed1);
          if (!voted) message.channel.send(Embed2);
        }).catch(error => {bot.error(`there was an error by checking this vote!`, message.channel)});
      }
      if (args.length) {
        const User = bot.users.cache.get(args[0]) || message.mentions.users.first();
        if (!User) return bot.error(`Can't find this user!`, message.channel);
        let votedEmbed = new MessageEmbed()
        votedEmbed.setTitle(`has voted`)
        votedEmbed.setDescription(`<@${User.id}> has voted!! \nClick [HERE](${bot.config.voteurl}) to vote for me in 12 hours!!`)
        votedEmbed.setColor(`#00ff00`);

let notvotedEmbed = new MessageEmbed()
        notvotedEmbed.setTitle(`has not voted`)
        notvotedEmbed.setDescription(`<@${User.id}> has not voted!! \nClick [HERE](${bot.config.voteurl}) to vote for me!`)
        notvotedEmbed.setColor(`#ff0000`);

        dbl.hasVoted(`${User.id}`).then(voted => {
          if (voted) message.channel.send(votedEmbed);
          if (!voted) message.channel.send(notvotedEmbed);
        }).catch(error => {bot.error(`there was an error by checking this vote!`, message.channel)});
      }
    }
  },
};

