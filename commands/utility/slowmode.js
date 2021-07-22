module.exports = {
  name: "slowmode",
  category: "utility",
  description: "Set the slowmode for the channel!",
  usage: "`slowmode [seconds] <d/h/m>`",
  run: async (bot, message, args, userinfo) => {
    if (!message.member.permissions.has("MANAGE_CHANNELS")) {
      return message.channel.send(`${bot.info.emojis.normal.cross} | You Dont have Permission to do that!`);
    }
    if (message.member.permissions.has("MANAGE_CHANNELS")) {
      if (!args[0])
      return message.channel.send(
        `${bot.info.emojis.normal.cross} | You did not specify the time in seconds you wish to set this channel's slow mode too!`
      );
    if (isNaN(args[0])) return message.channel.send(`${bot.info.emojis.normal.cross} | That is not a number!`);
    let reason = message.content.slice(
      bot.prefix.length + 9 + args[0].length + 1
    );
    if (!reason) {
      reason == "No reason provided!";
    }
    message.channel.setRateLimitPerUser(args[0], reason);
    message.channel.send(
      `${bot.info.emojis.normal.check} | Set the slowmode of this channel too **${args[0]}** with the reason: **${reason}**`
    );
    }
    
  },
};
