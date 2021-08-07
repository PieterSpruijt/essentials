const Discord = require('discord.js');



module.exports = async (bot, guild) => {
  try {
    const webhookClient = new Discord.WebhookClient({ id: bot.config.webhooks['kick-logs'][0], token: bot.config.webhooks['kick-logs'][1] });
    let newembed = new Discord.MessageEmbed()
      .setTitle(`Removed of server: "${guild.name}" with id: "${guild.id}"\nNow in ${bot.guilds.cache.size} Servers`)
      .setColor('RED')
      .setFooter(bot.config.embeds.footer_name)
      .setTimestamp();
    webhookClient.send({ embeds: [newembed] });
  } catch (e) { }
};