module.exports = {
  name: "banlist",
  description: "Get a list of all banned members!",
  category: "moderation",
  usage: "`banlist`",
  run: async (bot, message, args, userinfo) => {
    message.guild.fetchBans()
  .then(banned => {
    let list = banned.map(user => user.tag).join('\n');

    // Make sure if the list is too long to fit in one message, you cut it off appropriately.
    if (list.length >= 1950) list = `${list.slice(0, 1948)}...`;

    message.channel.send(`**${banned.size} users are banned:**\n${list}`);
  })
  .catch(e => {bot.error(`Something went wrong!`, message.channel)});
  },
};
