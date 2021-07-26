const { MessageEmbed } = require("discord.js");
const model = require("../../models/afk");
const { Message } = require('discord.js');

module.exports = {
  name: "afklist",
  description: "Get all afk users!",
  category: "utility",
  usage: "`afklist`",
  run: async (bot, message, args, userinfo) => {
    let list = await model.find({gid: message.guild.id});
    if (!list) return bot.error(`Nobady is afk`, message.channel);
    let content = "";
    for (let i = 0; i < list.length; i++) {
      if (i <= 9) {
        let user = `<@${list[i].userid}>`;
        let if1;
        if (list[i].message.lenght >= 10) {
          if1 = `Too long`
        } else {
          if1 = list[i].message
        }
            content += `${i +1} **${user}** -  ${if1}\n`
      }

      }
      if (content.length === 0) {
        content = `No users are afk!`
    }
    let embed = new MessageEmbed()
    .setTitle(`Afk users:`)
    .setDescription(content)
    .setColor(userinfo.color);
    message.channel.send({embeds: [embed]})

  },
};
