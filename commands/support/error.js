
module.exports = {
  name: "error",
  description: "Special developer command!",
  category: "support",
  usage: "`error`",
  run: async (bot, message, args, userinfo) => {
    if (message.author.id != bot.config.ownerID) return;
    message.channel.send(`Error done!`);
    this_is_an_error

  },
};
