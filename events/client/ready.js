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
};

