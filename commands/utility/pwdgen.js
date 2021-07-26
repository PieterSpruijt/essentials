const { MessageEmbed } = require("discord.js");
var generator = require('generate-password');

module.exports = {
  name: "pwdgen",
  description: "Generate a secure password!",
  category: "utility",
  usage: "`pwdgen <lenght>`",
  aliases: ['genpassword', 'password', 'createpassword', 'passwordgen', 'generatepassword'],
  run: async (bot, message, args, userinfo) => {
    let lenght = parseInt(args[0]) || 15;
    var password = generator.generate({
      length: lenght,
      numbers: true
    });
    let embed = new MessageEmbed()
    .setColor(userinfo.color)
    .setTitle(`Password generator`)
    .addField(`Password:`, '```' + password +  '```')
    message.author.send({embeds: [embed]}).catch(e => {})
    message.channel.send(`I send you a password in DM, make sure that you have your DM's open!`)
  },
};
