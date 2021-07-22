const { MessageEmbed } = require('discord.js');

module.exports = {
  name: "say",
  description: "Get the bot to say what ever you want!",
  category: "fun",
  usage: "`say [message]`",
  run: async (bot, message, args, userinfo) => {
    let test = args.join(" ");
        
    if(args[0] == null) return bot.error(`You did not specify your message to send!`, message.channel)
    let m = await message.channel.send(bot.info.emojis.animated.loading);
    m.edit(test)
  },
};
