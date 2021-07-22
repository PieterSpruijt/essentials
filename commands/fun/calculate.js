const math = require('mathjs');
const Discord = require("discord.js");

module.exports = {
  name: "calculate",
  description: "Calculate something!",
  category: "fun",
  usage: "`calculate [calculation]`",
  run: async (bot, message, args, userinfo) => {
    if (!args[0]) return bot.error(`You did not specify something to calculate!`, message.channel);
    let resp;

    try {
        resp = math.evaluate(args.join(" "))
    } catch (e) {
        return bot.error('Please provide a **valid** question', message.channel)
    }

    const embed = new Discord.MessageEmbed()
    .setColor(userinfo.color)
    .setTitle('Calculator')
    .addField('Question', `\`\`\`css\n${args.join(' ')}\`\`\``)
    .addField('Answer', `\`\`\`css\n${resp}\`\`\``)

    message.channel.send({embeds: [embed]});
  },
};
