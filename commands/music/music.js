const { Client } = require("youtubei");
const ytdl = require('ytdl-core-discord');
const Discord = require('discord.js')
const { AudioPlayerStatus, createAudioResource, createAudioPlayer, NoSubscriberBehavior, joinVoiceChannel, StreamType, VoiceConnectionStatus } = require('@discordjs/voice');
const { MessageEmbed } = require("discord.js");
const lyricsFinder = require("lyrics-finder");

module.exports = {
  name: "music",
  description: "Play music!",
  category: "music",
  commandOptions: [
    {
      "name": "play",
      "description": "Play Music",
      "type": 1,
      options: [
        {
          type: 3,
          name: "name",
          description: "Name of the song or youtube url",
          required: true
        },
      ],
    },
    {
      "name": "loop",
      "description": "Disable/enable loop!",
      "type": 1,
    },
    {
      "name": "lyrics",
      "description": "Get lyrics of now playing music!",
      "type": 1,
      options: [
        {
          type: 3,
          name: "song",
          description: "song name or yt url",
          required: false
        },
      ],
    },
    {
      "name": "nowplaying",
      "description": "Get current song!",
      "type": 1,
    },
    {
      "name": "pause",
      "description": "Pause music!",
      "type": 1,
    },
    {
      "name": "queue",
      "description": "get music queue!",
      "type": 1,
    },
    {
      "name": "remove",
      "description": "Remove music from queue!",
      "type": 1,
      options: [
        {
          type: 10,
          name: "number",
          description: "Number in queue to remove",
          required: true
        },
      ],
    },
    {
      "name": "resume",
      "description": "Resume music!",
      "type": 1,
    },
    {
      "name": "shuffle",
      "description": "Shuffle the queue!",
      "type": 1,
    },
    {
      "name": "skip",
      "description": "Skip the current song!",
      "type": 1,
    },
    {
      "name": "skipto",
      "description": "Skip to song in queue!",
      "type": 1,
      options: [
        {
          type: 10,
          name: "number",
          description: "Queue number of song",
          required: true
        },
      ],
    },
    {
      "name": "stop",
      "description": "Stop the queue!",
      "type": 1,
    },
    {
      "name": "volume",
      "description": "Set the volume of the music music!",
      "type": 1,
      options: [
        {
          type: 10,
          name: "number",
          description: "Volume to set to",
          required: false
        }
      ],
    },
  ],
  run: async (bot, interaction, userinfo) => {
    let command = interaction.options._subcommand;
    if (command === `play`) {
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
        let embed = new Discord.MessageEmbed()
          .setTitle('Added to queue!')
          .setColor(userinfo.color)
          .addField('Name', song.title, true)
          .setThumbnail(song.thumbnail)
          .addField('Views', `${song.views}`, true)
          .addField(`Channel`, song.channel)
          .addField('Reqeusted By', song.req.tag, true)
          .addField('Duration', timeString, true)
        return await interaction.editReply({ embeds: [embed] });
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



        let noiceEmbed = new Discord.MessageEmbed()
          .setTitle('Started Playing!')
          .setColor(userinfo.color)
          .addField('Name', song.title, true)
          .setThumbnail(song.thumbnail)
          .addField('Views', `${song.views}`, true)
          .addField(`Channel`, song.channel)
          .addField('Reqeusted By', song.req.tag, true)
          .addField('Duration', timeString, true)
        await interaction.editReply({ embeds: [noiceEmbed] })
      }




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
    } else if (command === `loop`) {
      const serverQueue = bot.queue.get(interaction.guild.id);
      if (serverQueue) {
        serverQueue.loop = !serverQueue.loop;
        await interaction.editReply({
          embeds: [{
            description: `🔁  **|**  Loop is **\`${serverQueue.loop === true ? "enabled" : "disabled"}\`**`
          }]
        });
        return bot.queue.set(interaction.guild.id, serverQueue)
      };
      return bot.error("There is nothing playing in this server.", bot, interaction);

    } else if (command === `lyrics`) {
      let lyrics = null;
      const queue = bot.queue.get(interaction.guild.id);
      if (interaction.data.options[0]) {
        try {
          lyrics = await lyricsFinder(interaction.data.options[0].value, "");
          if (!lyrics) lyrics = `No lyrics found for ${interaction.data.options[0].value} :(`;
        } catch (error) {
          lyrics = `No lyrics found for ${interaction.data.options[0].value} :(`;
        }

        let lyricsEmbed = new MessageEmbed()
          .setTitle(`Lyrics For ${interaction.data.options[0].value}`)
          .setDescription(lyrics)
          .setColor(userinfo.color)
          .setTimestamp();

        if (lyricsEmbed.description.length >= 2048)
          lyricsEmbed.description = `${lyricsEmbed.description.substr(0, 2045)}...`;
        return bot.api.interactions(interaction.id, interaction.token).callback.post({
          data: {
            type: 4,
            data: {

              embeds: [lyricsEmbed]
            }
          }
        });
      }
      if (!queue) return bot.error(`I can't find the lyrics!`, bot, interaction)


      try {
        lyrics = await lyricsFinder(queue.songs[0].title, "");
        if (!lyrics) lyrics = `No lyrics found for ${queue.songs[0].title} :(`;
      } catch (error) {
        lyrics = `No lyrics found for ${queue.songs[0].title} :(`;
      }

      let lyricsEmbed = new MessageEmbed()
        .setTitle(`Lyrics For ${queue.songs[0].title}`)
        .setDescription(lyrics)
        .setColor(userinfo.color)
        .setTimestamp();

      if (lyricsEmbed.description.length >= 2048)
        lyricsEmbed.description = `${lyricsEmbed.description.substr(0, 2045)}...`;
      await interaction.editReply({embeds: [lyricsEmbed]});

    } else if (command === `nowplaying`) {
      const serverQueue = bot.queue.get(interaction.guild.id);
    if (!serverQueue) return bot.error("There is nothing playing in this server.", bot, interaction);
    let song = serverQueue.songs[0]
    let thing = new MessageEmbed()
      .setAuthor("Now Playing")
      .setThumbnail(song.img)
      .setColor(userinfo.color)
      .addField("Name", song.title, true)
      .addField("Duration", `${song.duration}s`, true)
      .addField("Requested by", song.req.tag, true)
      .setFooter(`Views: ${song.views}`)
      await interaction.editReply({embeds: [thing]});

    } else if (command === `pause`) {
      const channel = interaction.member.voice.channel;
    if (!channel) return bot.error(`You should join a voice channel before using this command!`, bot, interaction);
    let queue = bot.queue.get(interaction.guild.id)
    if(!queue) return bot.error(`There is nothing playing right now to pause!`, bot, interaction)
    if(queue.playing !== false)
    queue.player.pause()
    await interaction.editReply(`Music paused`);

    } else if (command === `queue`) {
      const channel = interaction.member.voice.channel;
    if (!channel) return bot.error(`You should join a voice channel before using this command!`, bot, interaction);
    const queue = bot.queue.get(interaction.guild.id)
    let np;
    if (!queue) {
      return bot.error(`There is nothing in queue!`, bot, interaction);
    } else {
      if (!queue.songs[0]) return bot.error(`There is nothing in queue!`, bot, interaction);
    }
    const status = queue.songs.map((t, i) => `\`${++i}.\` | [\`${t.title}\`](https://youtube.com/watch?v=${t.id}) - [<@${t.req.id}>]`).join('\n');
    if (!status.length) return bot.error(`There is nothing in queue!`, bot, interaction);

    if (!queue) np = status
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

    } else if (command === `remove`) {
      const queue = bot.queue.get(interaction.guild.id);
    if (!queue) return bot.error("There is no queue.", bot, interaction);
    if (queue.songs.length == 1) return bot.error("There is no queue.", bot, interaction);
    if (interaction.data.options[0].value > queue.songs.length)
      return bot.error(`The queue is only ${queue.songs.length} songs long!`, bot, interaction);

    const song = queue.songs.splice(interaction.data.options[0].value - 1, 1);
    await interaction.editReply({content: `❌ **|** Removed: **\`${song[0].title}\`** from the queue.`});

    } else if (command === `resume`) {
      const channel = interaction.member.voice.channel;
    if (!channel) return bot.error(`You should join a voice channel before using this command!`, bot, interaction);
    let queue = bot.queue.get(interaction.guild.id)
    if(!queue) return bot.error(`There is nothing playing right now to resume!`, bot, interaction)
    if(queue.playing !== false)
    queue.player.unpause()
    await interaction.editReply(`Music resumed!`);

    } else if (command === `shuffle`) {
      const channel = interaction.member.voice.channel;
    if (!channel) return bot.error(`You should join a voice channel before using this command!`, bot, interaction)
    const queue = bot.queue.get(interaction.guild.id)
    if (!queue) return bot.error('There are no songs in queue to shuffle', bot, interaction)
    let songs = queue.songs;
    for (let i = songs.length - 1; i > 1; i--) {
      let j = 1 + Math.floor(Math.random() * i);
      [songs[i], songs[j]] = [songs[j], songs[i]];
    }
    queue.songs = songs;
    message.client.queue.set(message.guild.id, queue);
    await interaction.editReply(`Shuffled the current queue 🔀`);

    } else if (command === `skip`) {
      const channel = interaction.member.voice.channel;
    if (!channel) return bot.error('You should join a voice channel before using this command!', bot, interaction);
    let queue = bot.queue.get(interaction.guild.id)
    if(!queue) return bot.error(`There is nothing in the queue right now!`, bot, interaction);

    if(!queue.songs[0]) {
      queue.connection.destroy()
      bot.queue.delete(interaction.guild.id);
      await interaction.editReply(`No songs left, ended queue`);
    } else {
      queue.songs.shift()
      const resource = createAudioResource(await ytdl(`https://www.youtube.com/watch?v=${queue.songs[0].id}`), { inputType: StreamType.Opus, inlineVolume: true });
      resource.volume.setVolume(queue.volume / 5)
      queue.songs[0].resource = resource
      queue.player.play(resource)
      await interaction.editReply(`Skipped current song!`);
    }

    } else if (command === `skipto`) {
      const queue = bot.queue.get(interaction.guild.id);
    if (!queue) return bot.error("There is no queue.", bot, interaction);
    if (interaction.data.options[0].value > queue.songs.length)
      return bot.error(`The queue is only ${queue.songs.length} songs long!`, bot, interaction);

    queue.playing = true;

    if (queue.loop) {
      for (let i = 0; i < interaction.data.options[0].value - 2; i++) {
        queue.songs.push(queue.songs.shift());
      }
    } else {
      queue.songs = queue.songs.slice(interaction.data.options[0].value - 2);
    }
    try {
      const resource = createAudioResource(await ytdl(`https://www.youtube.com/watch?v=${queue.songs[0].id}`), { inputType: StreamType.Opus, inlineVolume: true });
      resource.volume.setVolume(queue.volume / 5)
      queue.songs[0].resource = resource
      queue.player.play(resource)
    } catch (error) {
      console.log(error)
      queue.connection.destroy()
      bot.queue.delete(interaction.guild.id);
      await interaction.editReply(`No songs left, ended queue`);
    }

    await interaction.editReply({content: `${interaction.member.user.tag} ⏭ skipped \`${interaction.data.options[0].value - 1}\` songs`});

    } else if (command === `stop`) {
      const channel = interaction.member.voice.channel;
    if (!channel) return bot.error(`You should join a voice channel before using this command!`, bot, interaction);
    let queue = bot.queue.get(interaction.guild.id)
    if (!queue) return bot.error(`There is nothing playing to be stopped!`,bot, interaction);
    queue.connection.destroy()
    bot.queue.delete(interaction.guild.id);
    await interaction.editReply(`Music stopped`);

    } else if (command === `volume`) {
      const channel = interaction.member.voice.channel;
    if (!channel) return bot.error('You should join a voice channel before using this command!', bot, interaction);

    let queue = bot.queue.get(interaction.guild.id)

    if (!interaction.data.options[0]) return await interaction.editReply({
      ephemeral: true,
      content: 'The current volume is set to: ' + queue.volume
    });


    if (interaction.data.options[0].value > 100) return bot.error(`100 is the max volume!`, bot, interaction)
    queue.songs[0].resource.volume.setVolume(interaction.data.options[0].value / 5);
    queue.volume = interaction.data.options[0].value
    await interaction.editReply({ content: 'Volume is set to ' + interaction.data.options[0].value });

    } else {
      await interaction.editReply({content: `Something went wrong, try again!`, ephemeral: true})
    }


  },
};

