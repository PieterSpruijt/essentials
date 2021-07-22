const ReactionModel = require("../../models/ReactionRole");
const { Message, Client, MessageEmbed, Role } = require("discord.js");

module.exports = {
  name: "rrlist",
  description: "get all reaction roles",
  category: "reactionroles",
  /**
   * @param {Client} bot
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (bot, message, args, userinfo) => {
    let ReactionRoles = await ReactionModel.find({Guild: message.guild.id});
    let Roles = ReactionRoles.map(data => `\n<#${data.Channel}> - ${data.Reaction} - ${data.MessageID} - <@&${data.Role}>`).toString()
    if (!Roles.length) {
      Roles = `No reactionroles set!`
    }
    message.channel.send({embed: {color: userinfo.color, title: `All reactionroles`, description: Roles}})
  },
};
