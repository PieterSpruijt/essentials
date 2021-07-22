const ReactionModel = require("../../models/ReactionRole");
const { Message, Client, MessageEmbed } = require("discord.js");

module.exports = {
  name: "rrdel",
  description: "Delete a reaction role",
  category: "reactionroles",
  /**
   * @param {Client} bot
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (bot, message, args, userinfo) => {
    if (!message.member.permissions.has(bot.perms.ADMINISTRATOR)) {
      let Embed2 = new MessageEmbed()
        .setDescription(`You Dont have Permission to do that! You must be Administrator!`)
        .setColor(`#e91e63`);
      return message.channel.send(Embed2);
    }
    if (!message.guild.roles.cache.has(args[1]))
      return message.channel.send(`${bot.info.emojis.normal.cross} | That role does not exist in this guild \`rrdel [messageID] [RoleID]\`!`);
    if (!args[0])
      return message.channel.send(
        `${bot.info.emojis.normal.cross} | You did not specify thr message id of the reaction roles you wish to delete \`rrdel [messageID] [RoleID]\`!`
      );
    ReactionModel.findOne(
      { MessageID: args[0], Guild: message.guild.id },
      async (err, data) => {
        if (err) throw err;
        if (!data)
          return message.channel.send(`${bot.info.emojis.normal.cross} | That is not a recation role message \`rrdel [messageID] [RoleID]\`!`);
        ReactionModel.findOneAndDelete(
          { MessageID: args[0], Guild: message.guild.id },
          (err) => {
            if (err) throw err;
          }
        );
        return message.channel.send(`${bot.info.emojis.normal.check} | Deleted that reaction role!`);
      }
    );
  },
};
