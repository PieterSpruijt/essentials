const Discord = require('discord.js');

module.exports = {
  name: "donate",
  description: "Donate to the bot!",
  category: "botinfo",
  usage: "`donate`",
  run: async (bot, message, args, userinfo) => {
    let Embed = new Discord.MessageEmbed()
        .setTitle(`Donate to Essentials!`)
        .setAuthor(bot.info.embed.Botname, bot.info.embed.profielfoto, bot.info.embed.website)
        .setThumbnail(bot.info.embed.profielfoto)
        .setDescription(`https://paypal.me/essentialsteam`)
        .setFooter(bot.info.embed.footer_name, bot.info.embed.footer_foto)
        .setColor(userinfo.color)
        .addFields(
          {name: `Patreon`, value: `[click here](https://patreon.com/join/essentialsteam)`});
    message.channel.send({embeds: [Embed]});
  },
};
