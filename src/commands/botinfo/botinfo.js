const { MessageEmbed } = require("discord.js");
const package = global.package;
const Discord = require(`discord.js`);

module.exports = {
  name: "botinfo",
  description: "Get all info about this bot!",
  category: "botinfo",
  private: false,
  timeout: 10000,
  commandOptions: [
    {
      type: 1,
      name: `ping`,
      description: `Bot API speed!`,
      required: false
    },
    {
      type: 1,
      name: `vote`,
      description: `Check if you have voted!`,
      required: false
    },
    {
      type: 1,
      name: `bugreport`,
      description: `Report a bug!`,
      required: false,
      options: [
        {
          type: 3,
          name: `bug`,
          description: `Describe your bug`,
          required: true
        }
      ]
    },
    {
      type: 1,
      name: `credits`,
      description: `See bot credits!`,
      required: false
    },
    {
      type: 1,
      name: `debug`,
      description: `Get a debug menu!`,
      required: false
    },
    {
      type: 1,
      name: `info`,
      description: `Get inf about this bot!`,
      required: false
    }
  ],
  run: async (bot, interaction, userinfo) => {
    let command = interaction.options._subcommand;
    if (command === `info`) {
      /*
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
        */


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

    } else if (command == `ping`) {
      const embed = new Discord.MessageEmbed()
        .setColor(userinfo.color)
        .setDescription(`The bot ping is ${Math.round(bot.ws.ping)} ms`);
      interaction.editReply({ embeds: [embed] });

    } else if (command == `vote`) {
      const Embed1 = new MessageEmbed()
      Embed1.setTitle(`You have voted`)
      Embed1.setDescription(`click [HERE](https://top.gg/bot/775055776854441985/vote) to vote for me in 12 hours!!`)
      Embed1.setColor(`#00ff00`);

      const Embed2 = new MessageEmbed()
      Embed2.setTitle(`You have not voted`)
      Embed2.setDescription(`click [HERE](https://top.gg/bot/775055776854441985/vote) to vote for me!`)
      Embed2.setColor(`#ff0000`);
      const DBL = require('dblapi.js');
      let dbl = new DBL(bot.config.topggToken, bot);
      dbl.hasVoted(interaction.member.user.id).then(async (voted) => {
        if (voted) await interaction.editReply({ embeds: [Embed1] });
        if (!voted) await interaction.editReply({ embeds: [Embed2] });
      }).catch(() => { bot.error(`there was an error by checking this vote!`, bot, interaction) });

    } else if (command == `bugreport`) {
      const buglogs = new Discord.WebhookClient({ id: bot.config.webhooks["bug-reports"][0], token: bot.config.webhooks["bug-reports"][1] });
      buglogs.send({
        embeds: [
          new Discord.MessageEmbed()
            .setTitle(`New bugreport from ${interaction.member.user.tag}!`)
            .setDescription(interaction.data.options[0].value)
            .setColor(userinfo.color)
        ]
      });
      await interaction.editReply(`Your bugreport has been send!`);

    } else if (command == `credits`) {
      let contributors = bot.guilds.cache.get(`792753972255260702`).roles.cache.get('867701687572758548').members.map(m => m.user.tag);
      let _ = new MessageEmbed()
        .setColor(userinfo.color)
        .setTitle(`Essentials | Credits`)
        .setFooter(bot.config.embeds.footer_name)
        .setDescription(`Essentials is a bot owned by PieterSpruijt#5136 (<@628205772509151240>) with a lot of features!`)
        .addFields(
          { name: `Developers:`, value: '[PieterSpruijt#5139](https://github.com/PieterSpruijt)  =>  `bot` & `server` & `hosting`\n Contributors: ' + contributors.join(' ').toString() },
          { name: `Thanks to:`, value: `[All donators](https://ko-fi.com/pieterspruijt) <:donator:826425335708385280>\n[All translators](${bot.config.support_server})\n[All staff & support members](${bot.config.support_server})\n[</Pascal>#4627](https://github.com/DotwoodMedia)  =>  \`logging\`` }
        );
      await interaction.editReply({ embeds: [_] });

    } else if (command == `debug`) {
      let Embed = new Discord.MessageEmbed()
        .setTitle(`Debug info`)
        .addFields(
          { name: `Server ID:`, value: interaction.guild.id },
          { name: `Shard:`, value: `[${bot.shard.ids}/${bot.shard.client.ws.totalShards} ]` },
          { name: `Server Region:`, value: interaction.guild.region },
          { name: `Total Memory:`, value: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB` },
          { name: `Voice channels connected:`, value: bot.voice.connections.size }
        )
        .setColor(userinfo.color);
      await interaction.editReply({ embeds: [Embed] });

    }

  },
};