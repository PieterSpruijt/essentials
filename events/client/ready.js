const config = require('../../config.json');

module.exports = async (bot) => {
  setInterval(() => {
    const index = Math.floor(Math.random() * (StatusList.length - 1) + 1);
    bot.user.setActivity(StatusList[index]);
  }, 30000); // Runs this every 30 seconds.
  const StatusList = [
    `${config.prefix}help`,
    `dsc.gg/essentialscanery`,
    `dsc.gg/essentials`,
    `dsc.gg/essentialshelp`,
  ];

  const Topgg = require('@top-gg/sdk')
  const api = new Topgg.Api(require('../../token.json').dbltoken);
  api.postStats({
    serverCount: bot.guilds.cache.size,
    shardId: bot.shard.ids[0], // if you're sharding
    shardCount: bot.options.shardCount
  });
  setInterval(() => {
    api.postStats({
      serverCount: bot.guilds.cache.size,
      shardId: bot.shard.ids[0], // if you're sharding
      shardCount: bot.options.shardCount
    });
  }, 1800000) // post every 30 minutes
};

