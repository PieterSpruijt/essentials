const { MessageEmbed } = require('discord.js')

module.exports = {
  name: `queue`,
  description: `Get music queue!`,
  private: false,
  run: async (bot, interaction, userinfo) => {
    const channel = interaction.member.voice.channel;
    if (!channel) return bot.error(`You should join a voice channel before using this command!`, bot, interaction);
    const queue = bot.queue.get(interaction.guild.id)
    let np;
    let thumbnail;
    if (!queue) {
      return bot.error(`There is nothing in queue!`, bot, interaction);
    } else {
      if (!queue.songs[0]) return bot.error(`There is nothing in queue!`, bot, interaction);
    }
    const status = queue.songs.map((t, i) => `\`${++i}.\` | [\`${t.title}\`](https://youtube.com/watch?v=${t.id}) - [<@${t.req.id}>]`).join('\n');
    if (!status.length) return bot.error(`There is nothing in queue!`, bot, interaction);
    else np = `[${queue.songs[0].title}](https://youtube.com/watch?v=${queue.songs[0].id}) - [<@${queue.songs[0].req.id}>]`
    if (queue) thumbnail = queue.songs[0].thumbnail
    else thumbnail = interaction.guild.iconURL()
    let embed = new MessageEmbed()
      .setTitle('Queue')
      .setThumbnail(thumbnail)
      .setColor(userinfo.color)
      .addField(`Now playing`, np, false)
      .addField('Queue', status, false)
      .addField("Text Channel", `<#${queue.textChannel.id}>`, true)
      .addField("Voice Channel", `<#${queue.voiceChannel.id}>`, true)
      .setFooter(`Currently Server Volume is ${queue.volume}/100 | Loop: ${queue.loop}`);
      await interaction.editReply({embeds: [embed]});
  },
};

