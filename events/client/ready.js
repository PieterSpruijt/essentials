const config = require('../../config.json');

module.exports = async (bot) => {
  setInterval(() => {
    const index = Math.floor(Math.random() * (StatusList.length - 1) + 1);
    bot.user.setActivity(StatusList[index]);
  }, 30000); // Runs this every 30 seconds.
  var totalGuilds;
  var totalMembers;
  var totalChannels;
  const promises = [
    bot.shard.fetchClientValues('guilds.cache.size'),
    bot.shard.broadcastEval('this.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)'),
    bot.shard.broadcastEval('this.guilds.cache.reduce((acc, guild) => acc + guild.channels.cache.size, 0)'),
  ];
  const StatusList = [
    `with ${totalGuilds} server and ${totalMembers} members`,
    `${config.prefix}help`,
    `dsc.gg/essentialscanery`,
    `dsc.gg/essentials`,
    `dsc.gg/essentialshelp`,
  ];
};

