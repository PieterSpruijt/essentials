const { MessageEmbed } = require("discord.js");
module.exports = {
  name: "8ball",
  description: "There is a big chance I insult you!",
  category: "fun",
  usage: "`8ball [question]`",
  run: async (bot, message, args, userinfo) => {
    const test = args.join(" ");

    if (!test.length) {
      bot.error(`You did not specify your question! | \`8ball [question]\``, message.channel)
      //message.channel.send(Embed2);
    }
    if (test.length) {
      let responses = [
        "Yes",
        "No",
        "Absolute",
        "Absolute not",
        "Definetly",
        "Absoloutely",
        "Not in a million years",
      ];
      let response =
        responses[Math.floor(Math.random() * responses.length - 1)];
      let Embed = new MessageEmbed()
        .setTitle(`8Ball!`)
        .setDescription(`Your question: ${test}\nMy reply: ${response}`)
        .setColor(userinfo.color);
      let m = await message.channel.send(Embed);
    
    }
  },
};
