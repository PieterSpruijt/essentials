const Discord = require('discord.js');
const embed2 = require('../../embed.json');
const token = require("../../token.json");
const webhookClient = new Discord.WebhookClient(token.webhooks['kick-logs'][0], token.webhooks['kick-logs'][1]);


module.exports = async (guild, bot) => {
  try {
    let newembed = new Discord.MessageEmbed()
      .setTitle(`Removed of server: "${guild.name}" with id: "${guild.id}"\nNow in ${bot.guilds.cache.size} Servers`)
      .setColor('RED')
      .setFooter(embed2.footer_name)
      .setTimestamp();
  webhookClient.send(newembed);
  } catch (e) {}
};