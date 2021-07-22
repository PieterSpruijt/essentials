const { MessageEmbed } = require("discord.js");
const config = require('../../config.json');
const ms = require("ms");
const package = require('../../package.json');
const GuildSettings = require("../../models/settings");



module.exports = {
  name: "botinfo",
  description: "Get all info about this bot!",
  category: "botinfo",
  usage: "`botinfo`",
  aliases: ["serveramount", "servercount", "botdetails", "memberamount", "channelamount", "owners", "developers"],
  run: async (bot, message, args, userinfo) => { 
    let currentshard = null;
    bot.shard.broadcastEval('this.shard.ids').then((data) => {
      currentshard = parseInt(data) + 1;
    })
    var totalGuilds;
    var totalMembers;
    var totalChannels;
    const promises = [
      bot.shard.fetchClientValues('guilds.cache.size'),
      bot.shard.broadcastEval('this.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)'),
      bot.shard.broadcastEval('this.guilds.cache.reduce((acc, guild) => acc + guild.channels.cache.size, 0)'),
    ];
    
    Promise.all(promises)
      .then(results => {
        totalGuilds = results[0].reduce((acc, guildCount) => acc + guildCount, 0);
        totalMembers = results[1].reduce((acc, memberCount) => acc + memberCount, 0);
        totalChannels = results[2].reduce((acc, channelCount) => acc + channelCount, 0);
      })
      .catch(e => {});

    var storedSettings = await GuildSettings.findOne({ gid: message.guild.id });
    if (!storedSettings) {
      // If there are no settings stored for this guild, we create them and try to retrive them again.
      const newSettings = new GuildSettings({
        gid: message.guild.id,
        prefix: config.prefix
      });
      await newSettings.save().catch(()=>{});
      storedSettings = await GuildSettings.findOne({ gid: message.guild.id });
    }

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
  Embed.setThumbnail(bot.info.embed.profielfoto)
  Embed.addFields(
  { name: `Bot name:`, value: `${bot.user.tag}`, inline: true },
  { name: `Your Prefix:`, value: storedSettings.prefix, inline: true },
  { name: `Creation Day:`, value: `8/11/2020 18:54:57 by [PieterSpruijt#5136](https://www.pieterspruijt.nl/)`, inline: true },
  { name: `Total servers:`, value: `${totalGuilds}`, inline: true },
  { name: `Servers in shard:`, value: `${bot.guilds.cache.size}`, inline: true },
  { name: `Total Channels`, value: `${totalChannels}`, inline: true },
  { name: `Total Members`, value: `${totalMembers}`, inline: true },
  { name: `Shard`, value: `${bot.shard.ids[0]}/${bot.shard.client.ws.totalShards}`, inline: true },
  { name: `Uptime:`, value: uptime, inline: true },
  { name: `Api speed:`, value: `${Math.round(bot.ws.ping)}ms`, inline: true },
  { name: `Bot version:`, value: `${package.version}`, inline: true },
  { name: `Bot Memory:`, value: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`, inline: true },
  { name: `Discord.js version:`, value: package.dependencies["discord.js"], inline: true },
  { name: `Owner:`, value: `${config.owner}`, inline: true },
  { name: `Developers:`, value: `${config.developers}`, inline: true },
  { name: `List of commands`, value: `\`${storedSettings.prefix}help\``, inline: true },
  { name: 'Help us grow', value: `click [HERE](${config.inviteurl}) to invite me`, inline: true },
  { name: `Links:`, value: `Add me: [[HERE]](${config.inviteurl})\nSupport Server: [[HERE]](${config.support_server})\nWebsite: [[HERE]](${config.website})`, inline: false },
  )
Embed.setFooter(bot.info.embed.footer_name, bot.info.embed.footer_foto);
    message.channel.send(Embed);  
  },
};