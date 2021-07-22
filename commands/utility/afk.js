const { MessageEmbed } = require("discord.js");
const model = require("../../models/afk");
const { Message } = require('discord.js');

module.exports = {
  name: "afk",
  description: "Set your afk!",
  category: "utility",
  usage: "`afk <afk message>`",
  run: async (bot, message, args, userinfo) => {
    let User = message.author;
    var afk = await model.findOne({ gid: message.guild.id, userid: User.id });
    let text = args.join(" ") || `Not specified`;
    if (afk) return bot.error(`You're already afk`, message.channel);
    const newData = new model({
      gid: message.guild.id,
      userid: User.id,
      message: text,
    });
    newData.save();
    message.member.setNickname(`[AFK] ` + message.member.displayName).catch(e => {});
    message.channel.send(`<@${User.id}>`, {embed: {description: ` Set your afk: ${text}`, color: userinfo.color}});
  },
};
