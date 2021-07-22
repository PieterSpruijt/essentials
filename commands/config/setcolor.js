const userdb = require("../../models/userdb");
const isHexcolor = require('is-hexcolor')

module.exports = {
  name: "setcolor",
  description: "Change your premium color!",
  category: "config",
  usage: "`setcolor [hex]`",
  run: async (bot, message, args, userinfo) => {
    if (!userinfo.premium) return message.channel.send({embed: {description: `${bot.info.emojis.normal.cross} | you don't have Essentials Premium!!`, color: userinfo.color}});
    if (!isHexcolor(args[0])) return message.channel.send({embed: {description: `${bot.info.emojis.normal.cross} You did not specify an hex color!`, color: `#e91e63`}});
        userdb.findOne(
          { userid: message.author.id },
          async (err, data) => {
            if (err) throw err;
              data.color = args[0];
              data.save();
          }
        );
        message.channel.send({embed: {description: `${bot.info.emojis.normal.check} Changed ${args[0]} to your default embed color`, color: `#e91e63`}});  

  },
};
