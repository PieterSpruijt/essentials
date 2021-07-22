const userdb = require("../../models/userdb");
const config = require("../../config.json");

module.exports = {
  name: "settings",
  description: "Change your info!",
  category: "config",
  usage: "`settings [snipe] [value]`",
  run: async (bot, message, args, userinfo) => {
      if (!args[0]) return bot.error(`You did not specify a name of a setting\nSnipe = visibility in snipe command`, message.channel);
      let target = message.author;
    let userinfo2 = await userdb.findOne({ userid: target.id });
    if (!userinfo2) {
      // If there are no settings stored for this guild, we create them and try to retrive them again.
      newSettings = new userdb({
        userid: target.id,
        developer: false,
        banned: false,
        color: `#e91e63`,
        snipe: true,
      });
      await newSettings.save().catch(()=>{});
      userinfo2 = await userdb.findOne({ userid: target.id });
      return message.channel.send({embed: {description: `I succesfully saved the new user, try your command again`, color: `GREEN`}});
    }
    if (!args[0]) return bot.error(`You did not specify a setting`, message.channel);
    if (args[0] !== `snipe`) return bot.error(`You did not specify a setting`, message.channel);
    if (args[1] !== `true` && args[1] != `false`) return bot.error(`You did not specify a value`, message.channel);
      if (args[1] === `true`) {
        userdb.findOne(
          { userid: target.id },
          async (err, data) => {
            if (err) throw err;
              data[args[0]] = true;
              data.save();
          }
        );
        message.channel.send({embed: {description: `${bot.info.emojis.normal.check} You turned **${args[0]}** on`, color: `#e91e63`}});
      } else if (args[1] === `false`) {
        userdb.findOne(
          { userid: target.id },
          async (err, data) => {
            if (err) throw err;
              data[args[0]] = false;
              data.save();
          }
        );
        message.channel.send({embed: {description: `${bot.info.emojis.normal.check} You turned **${args[0]}** off`, color: `#e91e63`}});
      }
      
    

  },
};
