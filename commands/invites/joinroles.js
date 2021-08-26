const model = require("../../models/joinrole");
const Discord = require("discord.js");

module.exports = {
  name: "joinroles",
  description: "get all join roles!",
  category: "invites",
  usage: "`joinroles`",
  run: async (bot, message, args, userinfo) => {
    var joinroles = await model.find({gid: message.guild.id});
    let List = joinroles.map(data => `\nRole <@&${data.Role}>`).toString()
    if (!joinroles.length) {
      List = `No join roles set!`
    }
    message.channel.send({embeds: [{color: userinfo.color, title: `All join roles`, description: List}]})
  },
};
