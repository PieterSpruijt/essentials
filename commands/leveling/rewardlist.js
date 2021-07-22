const model = require("../../models/lvlreward");
const Discord = require("discord.js");

module.exports = {
  name: "rewardlist",
  description: "get all level rewards!",
  category: "leveling",
  usage: "`rewardlist`",
  run: async (bot, message, args, userinfo) => {
    let Rewards = await model.find({gid: message.guild.id});
    let List = Rewards.map(data => `\nLevel ${data.level} - <@&${data.role}>`).toString()
    if (!Rewards.length) {
      List = `No level rewards set!`
    }
    message.channel.send({embeds: [{color: userinfo.color, title: `All level rewards`, description: List}]})
  },
};
