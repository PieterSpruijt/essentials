const { MessageEmbed } = require("discord.js");
const package = require('../../package.json');



module.exports = {
  name: "botinfo",
  description: "Get all info about this bot!",
  category: "botinfo",
  run: async (bot, interaction, userinfo) => {
    var totalGuilds;
    var totalMembers;
    var totalChannels;
    const promises = [
      bot.shard.broadcastEval(bot => bot.guilds.cache.size),
      bot.shard.broadcastEval(bot => bot.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)),
      bot.shard.broadcastEval(bot => bot.guilds.cache.reduce((acc, guild) => acc + guild.channels.cache.size, 0)),
    ];

    Promise.all(promises)
      .then(results => {
        totalGuilds = results[0].reduce((acc, guildCount) => acc + guildCount, 0);
        totalMembers = results[1].reduce((acc, memberCount) => acc + memberCount, 0);
        totalChannels = results[2].reduce((acc, channelCount) => acc + channelCount, 0);
      })
      .catch(e => { });


    let totalSeconds = (bot.uptime / 1000);
    let days = Math.floor(totalSeconds / 86400);
    totalSeconds %= 86400;
    let hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = Math.floor(totalSeconds % 60);
    let uptime = `${days}d, ${hours}h, ${minutes}m and ${seconds}s`;

    let Embed = new MessageEmbed();
    Embed.setColor(userinfo.color)
    Embed.setTitle('BotDetails')
    Embed.setURL('')
    Embed.setDescription('')
    Embed.setThumbnail(bot.config.embeds.footer_photo)
    Embed.addFields(
      { name: `Bot name:`, value: `${bot.user.tag}`, inline: true },
      { name: `Creation Day:`, value: `8/11/2020 18:54:57 by [PieterSpruijt#5136](https://www.pieterspruijt.nl/)`, inline: true },
      //{ name: `Total servers:`, value: `${totalGuilds}`, inline: true },
      { name: `Servers in shard:`, value: `${bot.guilds.cache.size}`, inline: true },
      //{ name: `Total Channels`, value: `${totalChannels}`, inline: true },
      //{ name: `Total Members`, value: `${totalMembers}`, inline: true },
      { name: `Shard`, value: `${bot.shard.ids[0] + 1}/${bot.shard.client.ws.totalShards}`, inline: true },
      { name: `Uptime:`, value: uptime, inline: true },
      { name: `Api speed:`, value: `${Math.round(bot.ws.ping)}ms`, inline: true },
      { name: `Bot version:`, value: `${package.version}`, inline: true },
      { name: `Bot Memory:`, value: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`, inline: true },
      { name: `Discord.js version:`, value: package.dependencies["discord.js"], inline: true },
      { name: `Owner:`, value: `${bot.config.owner}`, inline: true },
      { name: `Developers:`, value: `${bot.config.developers}`, inline: true },
      { name: `List of commands`, value: `\`/help\``, inline: true },
      { name: 'Help us grow', value: `click [HERE](${bot.config.botInvite}) to invite me`, inline: true },
      { name: `Links:`, value: `Add me: [[HERE]](${bot.config.botInvite})\nSupport Server: [[HERE]](${bot.config.support_server})\nWebsite: [[HERE]](${bot.config.website})`, inline: false },
    )
    Embed.setFooter(bot.config.embeds.footer_name, bot.config.embeds.footer_photo);
    interaction.editReply({ embeds: [Embed] });
  },
};