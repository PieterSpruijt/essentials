const { Client } = require("youtubei");
const ytdl = require('ytdl-core-discord');
const discord = require('discord.js')
const { VoiceConnectionStatus, entersState, AudioPlayerStatus, createAudioResource, createAudioPlayer, NoSubscriberBehavior, joinVoiceChannel, StreamType } = require('@discordjs/voice');
module.exports = {
  run: async (bot, interaction, userinfo) => {
    let channel = interaction.member.voice.channel;
    if (!channel) return bot.error(`You need to join a voice channel to play a music!`, bot, interaction);


    const server = bot.queue.get(interaction.guild.id);
    const youtube = new Client();
    let id = interaction.data.options[0].value.split('=');
    var video = await youtube.findOne(id[1], {
      type: "video", // video | playlist | channel | all
    });
    if (!id[1] || !video[0]) {
      video = await youtube.findOne(interaction.data.options[0].value, {
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
      requester: interaction.member.user,
      req: interaction.member.user,
      resource: null,
      channel: result.channel.name || `None`,
      channelurl: `https://www.youtube.com/channel/` + result.channel.id || `None`
    };
    if (!song.title || !song.id) bot.error(`I can't find this song, try again or try another name!`, bot, interaction)

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
      return await interaction.editReply({

        embeds: [noiceEmbed]
      })
    }

    const queueConstruct = {
      textChannel: interaction.channel,
      voiceChannel: channel,
      connection: null,
      songs: [],
      volume: 4,
      playing: true,
      loop: false,
      player: null
    };
    bot.queue.set(interaction.guild.id, queueConstruct);
    queueConstruct.songs.push(song);

    const player = createAudioPlayer();

    const connection = joinVoiceChannel({
      channelId: interaction.member.voice.channel.id,
      guildId: interaction.member.voice.channel.guild.id,
      adapterCreator: interaction.member.voice.channel.guild.voiceAdapterCreator,
    });
    const play = async song => {
      const queue = bot.queue.get(interaction.guild.id);
      if (!song) {
        bot.queue.delete(interaction.guild.id);

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
      await interaction.editReply({

        embeds: [noiceEmbed]
      })

    };


    try {
      queueConstruct.connection = connection;
      queueConstruct.player = player
      connection.subscribe(player);
      play(queueConstruct.songs[0]);

      connection.on(VoiceConnectionStatus.Disconnected, async (oldState, newState) => {
        try {
          await Promise.race([
            entersState(connection, VoiceConnectionStatus.Signalling, 5_000),
            entersState(connection, VoiceConnectionStatus.Connecting, 5_000),
          ]);
          // Seems to be reconnecting to a new channel - ignore disconnect
        } catch (error) {
          // Seems to be a real disconnect which SHOULDN'T be recovered from
          connection.destroy();
        }
      });
      player.on(AudioPlayerStatus.Idle, () => {
        const shiffed = queueConstruct.songs.shift()
        if (queueConstruct.loop === true) {
          queueConstruct.songs.push(shiffed);
        }
        if (!queueConstruct.songs[0]) {
          bot.queue.delete(interaction.guild.id);
          return bot.success(`Queue ended!`, bot, interaction);
        }
        play(queueConstruct.songs[0]);


      });
    } catch (error) {
      bot.error(`I could not join the voice channel`, bot, interaction);
      bot.queue.delete(interaction.guild.id);
      await connection.destroy()
      return;
    }
  },
};

