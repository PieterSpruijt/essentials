const { MessageEmbed } = require("discord.js");
const axios = require("axios");

module.exports = {
  name: "trivia",
  description: "Test your knowledge!",
  category: "fun",
  usage: "`trivia`",
  run: async (bot, message, args, userinfo) => {
    axios
    .get(`https://opentdb.com/api.php?amount=1`)
    .then(async (embed) => {
      const { data } = embed;
      var answers = [];
      let data2 = data
      let question = ``;
      let correct = ``;
      data.results.forEach(r => {
        question = r.question
        correct = r.correct_answer
      })

      data2.results.forEach(data => {answers.push(data.correct_answer); data.incorrect_answers.forEach(inc => {answers.push(inc)})});
      answers = answers.sort(() => Math.random() - 0.5);
    let i = 0;
    const Embed = new MessageEmbed()
      .setTitle(question)
      .setDescription(
        answers.map((opt) => {
          i++;
          return `${opt}\n`;
        })
      )
      .setColor(userinfo.color)
      .setFooter(
        `Reply to this message with the correct answer! You have 60 seconds.`
      );
    message.channel.send(Embed);
    try {
      let msgs = await message.channel.awaitMessages(
        (u2) => u2.author.id === message.author.id,
        { time: 60000, max: 1, errors: ["time"] }
      );
      if (parseInt(msgs.first().content) == correct) {
        return message.channel.send(`${bot.info.emojis.normal.check} | You got it correct!`);
      } else {
        return message.channel.send(`${bot.info.emojis.normal.cross} | You got it incorrect.`);
      }
    } catch (e) {
      return bot.error(`You did not answer!`, message.channel);
    }
    })
  },
};
