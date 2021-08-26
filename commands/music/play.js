const { Client } = require("youtubei");
const ytdl = require('ytdl-core-discord');
const discord = require('discord.js')
const { AudioPlayerStatus, createAudioResource, createAudioPlayer, NoSubscriberBehavior, joinVoiceChannel, StreamType, VoiceConnectionStatus } = require('@discordjs/voice');

module.exports = {
  name: "play",
  description: "Play music!",
  category: "music",
  aliases: ['p'],
  usage: "`play [url/name]`",
  run: async (bot, message, args, userinfo) => {
    if (!args[0]) return bot.error('> You didn\'t provide a song to play!', message.channel)
    let channel = message.member.voice.channel;
    if (!channel) return message.channel.send('> You need to join a voice channel to play a music!')


    const server = message.client.queue.get(message.guild.id);
    const youtube = new Client();
    let id = args.join('').split('=');
    var video = await youtube.findOne(id[1], {
      type: "video", // video | playlist | channel | all
    });
    if (!id[1] || !video[0]) {
      video = await youtube.findOne(args.join(' '), {
        type: "video", // video | playlist | channel | all
      });
    }

    let result = video

    const song = {
      id: result.id,
      title: result.title,
      duration: result.duration,
      thumbnail: result.thumbnails[0].url,
      upload: result.uploadDate || `Not found`,
      views: result.viewCount,
      requester: message.author,
      req: message.author,
      resource: null,
      channel: result.channel.name || `None`,
      channelurl: `https://www.youtube.com/channel/` + result.channel.id || `None`
    };
    if (!song.title || !song.id) bot.error(`I can't find this song, try again or try another name!`, message.channel)

    var date = new Date(0);
    date.setSeconds(song.duration); // specify value for SECONDS here
    var timeString = date.toISOString().substr(11, 8);

    if (server) {
      server.songs.push(song);
      let embed = new discord.MessageEmbed()
        .setTitle('Added to queue!')
        .setColor(userinfo.color)
        .addField('Name', song.title, true)
        .setThumbnail(song.thumbnail)
        .addField('Views', `${song.views}`, true)
        .addField(`Channel`, song.channel)
        .addField('Reqeusted By', song.req.tag, true)
        .addField('Duration', timeString, true)
      return message.channel.send({ embeds: [embed] });
    }

    const queueConstruct = {
      textChannel: message.channel,
      voiceChannel: channel,
      connection: null,
      songs: [],
      volume: 4,
      playing: true,
      loop: false,
      player: null
    };
    message.client.queue.set(message.guild.id, queueConstruct);
    queueConstruct.songs.push(song);

    const player = createAudioPlayer();

    const connection = joinVoiceChannel({
      channelId: message.member.voice.channel.id,
      guildId: message.member.voice.channel.guild.id,
      adapterCreator: message.member.voice.channel.guild.voiceAdapterCreator,
    });
    const play = async song => {
      const queue = message.client.queue.get(message.guild.id);
      if (!song) {
        message.client.queue.delete(message.guild.id);

      }
      const resource = createAudioResource(await ytdl(`https://www.youtube.com/watch?v=${song.id}`), { inputType: StreamType.Opus, inlineVolume: true });
      resource.volume.setVolume(queue.volume / 5)
      song.resource = resource
      player.play(resource)



      let noiceEmbed = new discord.MessageEmbed()
        .setTitle('Started Playing!')
        .setColor(userinfo.color)
        .addField('Name', song.title, true)
        .setThumbnail(song.thumbnail)
        .addField('Views', `${song.views}`, true)
        .addField(`Channel`, song.channel)
        .addField('Reqeusted By', song.req.tag, true)
        .addField('Duration', timeString, true)
      queue.textChannel.send({ embeds: [noiceEmbed] });

    };


    try {
      queueConstruct.connection = connection;
      queueConstruct.player = player
      connection.subscribe(player);
      play(queueConstruct.songs[0]);
      player.on(AudioPlayerStatus.Idle, () => {
        const shiffed = queueConstruct.songs.shift()
        if (queueConstruct.loop === true) {
          queueConstruct.songs.push(shiffed);
        }
        if (!queueConstruct.songs[0]) {
          message.client.queue.delete(message.guild.id);
          return bot.success(`Queue ended!`, message.channel);
        }
        play(queueConstruct.songs[0]);


      });
    } catch (error) {
      bot.error(`I could not join the voice channel`, message.channel);
      message.client.queue.delete(message.guild.id);
      await connection.destroy()
      return;
    }
  },
};

