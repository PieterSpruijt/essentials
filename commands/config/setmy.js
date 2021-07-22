const userdb = require("../../models/userdb");
const config = require("../../config.json");

module.exports = {
  name: "setmy",
  description: "Change your premium info!",
  category: "config",
  usage: "`setmy [color/premium/vip/serverstaff/developer]`",
  run: async (bot, message, args, userinfo) => {
    if (message.author.id !== config.ownerID) return message.channel.send({embeds: [{description: `${bot.info.emojis.normal.cross} You are not allowed to use this command\n This command is only for the Essentials support team!`, color: `#e91e63`}]});
    let target = {
      id: args[0]
    };
    if (!target) return message.channel.send({embeds: [{description: `${bot.info.emojis.normal.cross} You did not specify an user`, color: `#e91e63`}]});
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
      return message.channel.send({embeds: [{description: `I succesfully saved the new user, try your command again`, color: `GREEN`}]});
    }
    if (!args[1]) return message.channel.send({embed: {description: `${bot.info.emojis.normal.cross} You did not specify an thing to add to the user`, color: `#e91e63`}});
    if (args[1] !== `developer` && !`banned`) return message.channel.send({embeds: [{description: `${bot.info.emojis.normal.cross} You did not specify an thing to add to the user`, color: `#e91e63`}]});
    if (args[2] !== `true` && !`false`) return message.channel.send({embeds: [{description: `${bot.info.emojis.normal.cross} You did not specify an value to add to the user`, color: `#e91e63`}]});
      if (args[2] === `true`) {
        userdb.findOne(
          { userid: target.id },
          async (err, data) => {
            if (err) throw err;
              data[args[1]] = true;
              data.save();
          }
        );
        message.channel.send({embeds: [{description: `${bot.info.emojis.normal.check} Added ${args[1]} to user`, color: `#e91e63`}]});
      }
      if (args[2] === `false`) {
        userdb.findOne(
          { userid: target.id },
          async (err, data) => {
            if (err) throw err;
              data[args[1]] = false;
              data.save();
          }
        );
        message.channel.send({embeds: [{description: `${bot.info.emojis.normal.check} removed ${args[1]} to user`, color: `#e91e63`}]});
      }
      
    

  },
};
