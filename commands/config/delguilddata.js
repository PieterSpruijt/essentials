const Discord = require('discord.js');
const model = require('../../models/economy');
const model2 = require('../../models/afk');
const model3 = require('../../models/ReactionRole');
const model4 = require('../../models/custom');
const model6 = require('../../models/logchannel');
const model8 = require('../../models/lvlreward');
const model9 = require('../../models/xpdb');
const model10 = require('../../models/settings');
const model11 = require('../../models/warns');

module.exports = {
  name: "delguilddata",
  description: "Delete all guild data!",
  category: "config",
  usage: "`delguilddata`",
  timeout: 86400000,
  run: async (bot, message, args, userinfo) => {
    if (!message.member.permissions.has(bot.perms.ADMINISTRATOR)) return bot.error(`You Dont have Permission to do that! You must be Administrator!`, message.channel);
    try {
      message.channel.send(`Are you sure to do this, this can't be undone\n type \`yes\` to go further and \`cancel\` to cancel`);
      let e = await message.channel.awaitMessages(
        (u2) => u2.author.id === message.author.id,
        { time: 30000, max: 1, errors: ["time"] }
    );
    if (e.first().content.toLowerCase() === `yes`) {
      var d1 = await model.deleteMany({gid: message.guild.id});
      var d2 = await model2.deleteMany({gid: message.guild.id});
      var d3 = await model3.deleteMany({Guild: message.guild.id});
      var d4 = await model4.deleteMany({Guild: message.guild.id});
      var d6 = await model6.deleteMany({gid: message.guild.id});
      var d8 = await model8.deleteMany({gid: message.guild.id});
      var pattern = `${message.guild.id}`
      var d9 = await model9.deleteMany({id: {$regex:pattern, $options: `x`}});
      var d10 = await model10.deleteMany({gid: message.guild.id});
      var d11 = await model11.deleteMany({Guild: message.guild.id});
      message.channel.send(`Deleted all guild info!`);

    } else {
      message.channel.send(`Cancelled!`);
    }
    } catch (e) {
      bot.error(`Cancelled, you didn't reply!`, message.channel);
    }

  },
};
