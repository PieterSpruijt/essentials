const warns = require("../../models/warns");

module.exports = {
  name: "warn",
  description: "Warn a user",
  category: "moderation",
  usage: "`warn [mention] [reason]`",
  run: async (bot, message, args, userinfo) => {
    if (!message.member.permissions.has(bot.perms.KICK_MEMBERS))
      return message.channel.send(`${bot.info.emojis.normal.cross} | You Dont have Permission to do that you can do \`report [tag user] [reason]\``);
    let user = message.mentions.users.first();
    if (!user) return message.channel.send(`${bot.info.emojis.normal.cross} | You did not mention a user! | \`warn [tag user] [reason]\``);
    if (!args.slice(1).join(" "))
      return message.channel.send(`${bot.info.emojis.normal.cross} | You did not specify a reason! | \`warn [tag user] [reason]\``);
    warns.findOne(
      { Guild: message.guild.id, User: user.id },
      async (err, data) => {
        if (err) console.log(err);
        if (!data) {
          let newWarns = new warns({
            User: user.id,
            Guild: message.guild.id,
            Warns: [
              {
                Moderator: message.author.id,
                Reason: args.slice(1).join(" "),
              },
            ],
          });
          newWarns.save();
          message.channel.send(
            `${bot.info.emojis.normal.check} | ${user.tag} has been warned with the reason of ${args
              .slice(1)
              .join(" ")}. **${user.tag}** now has 1 warn.`
          );
        } else {
          data.Warns.unshift({
            Moderator: message.author.id,
            Reason: args.slice(1).join(" "),
          });
          data.save();
          message.channel.send(
            `${bot.info.emojis.normal.check} | ${user.tag} has been warned with the reason of ${args
              .slice(1)
              .join(" ")}. **${user.tag}** now has ${data.Warns.length} warns.`
          );
        }
      }
    );
  },
};
