const warns = require("../../models/warns");
const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "warns",
  description: "Get a user's warns in the guild!",
  category: "moderation",
  usage: "`warns [mention]`",
  run: async (bot, message, args, userinfo) => {
    if (!message.member.permissions.has(bot.perms.KICK_MEMBERS))
      return message.channel.send(`${bot.info.emojis.normal.cross} | You Dont have Permsission to do that you can do \`report [tag user] [reason]\``);
    let user = message.mentions.members.first();
    if (!user) return message.channel.send(`${bot.info.emojis.normal.cross} | No user specified! | \`warns [tag user]\``);
    warns.find(
      { Guild: message.guild.id, User: user.id },
      async (err, data) => {
        if (err) console.log(err);
        if (!data.length)
          return message.channel.send(
            `${bot.info.emojis.normal.check} | ${user.user.tag} has not got any warns in this guild!`
          );
        let Embed = new MessageEmbed()
          .setTitle(`${user.user.tag}'s warns in ${message.guild.name}.. `)
          .setColor(userinfo.color)
          .setDescription(
            data.map((d) => {
              return d.Warns.map(
                (w, i) =>
                  `${i} - Moderator: ${
                    message.guild.members.cache.get(w.Moderator).user.tag
                  } Reason: ${w.Reason}`
              ).join("\n");
            })
          );
        message.channel.send(Embed);
      }
    );
  },
};
