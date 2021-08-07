const Discord = require('discord.js');

module.exports = {
    name: "ping",
    category: "info",
    description: "Returns latency and API ping",
    run: async (bot, interaction, userinfo) => {
        const embed = new Discord.MessageEmbed()
        .setColor(userinfo.color)
      .setDescription(`The bot ping is ${Math.round(bot.ws.ping)} ms`);
      interaction.editReply({embeds: [embed]});
    },
}