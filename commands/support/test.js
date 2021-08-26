const language = require('../../language');
const model = require('../../models/settings');

module.exports = {
  name: "test",
  description: "Special developer command!",
  category: "support",
  usage: "`test`",
  run: async (bot, message, args, userinfo) => {
      message.channel.send(`${language(message.guild, "DEVELOPER")}`);
  },
};
