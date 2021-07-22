const { MessageEmbed } = require('discord.js');

module.exports = {
  name: "embed",
  description: "Get the bot to embed what ever you want!",
  category: "fun",
  usage: "`embed [message]`",
  run: async (bot, message, args, userinfo) => {
    const test = args.join(" ")
    if(test[0] == null) return bot.error(`You did not specify your message to send!`, message.channel)
    let Embed = new MessageEmbed()
	.setColor(userinfo.color)
	.setAuthor(message.author.tag, message.author.displayAvatarURL())
	.setDescription(test)
	.setTimestamp()

    message.channel.send(Embed);
  },
};
