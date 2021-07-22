const ytdl = require('ytdl-core-discord');
var scrapeYt = require("scrape-yt");
const discord = require('discord.js')

module.exports = {
  name: "play",
  description: "Play music!",
  category: "music",
  usage: "`play [url/name]`",
  run: async (bot, message, args, userinfo) => {
    if(!args[0]) return message.channel.send('> You didn\'t provide a song to play!')
    let channel = message.member.voice.channel;
    if(!channel) return message.channel.send('> You need to join a voice channel to play a music!')

    if (!channel.permissionsFor(message.client.user).has("CONNECT")) return message.channel.send('I don\'t have permission to join the voice channel')
    if (!channel.permissionsFor(message.client.user).has("SPEAK"))return message.channel.send('I don\'t have permission to speak in the voice channel')


    const server = message.client.queue.get(message.guild.id);
    let video = await scrapeYt.search(args.join(' '))
    let result = video[0]

    const song = {
        id: result.id,
        title: result.title,
        duration: result.duration,
        thumbnail: result.thumbnail,
        //upload: result.uploadDate || `None`,
        views: result.viewCount,
        requester: message.author,
        req: message.author
        //channel: result.channel.name || `None`,
        //channelurl: result.channel.url || `None`
      };
      if (!song.title || !song.id ) bot.error(`I can't find this song, try again or try another name!`, message.channel)

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
        .addField('Views', song.views, true)
        .addField('Reqeusted By', song.requester, true)
        .addField('Duration', timeString, true)
        return message.channel.send(embed)
    }

    const queueConstruct = {
        textChannel: message.channel,
        voiceChannel: channel,
        connection: null,
        songs: [],
        volume: 4,
        playing: true
    };
    message.client.queue.set(message.guild.id, queueConstruct);
    queueConstruct.songs.push(song);


    const play = async song => {
        const queue = message.client.queue.get(message.guild.id);
        if (!song) {
            queue.voiceChannel.leave();
            message.client.queue.delete(message.guild.id);
            message.channel.send('> There are no songs in queue, I\'m leaving the voice channel!')
            return;
        }

        const dispatcher = queue.connection.play(await ytdl(`https://youtube.com/watch?v=${song.id}`, {
            filter: format => ['251'],
            highWaterMark: 1 << 25
        }), {
            type: 'opus'
        })
            .on('finish', () => {
                const shiffed = queue.songs.shift()
                if (queue.loop === true) {
                    queue.songs.push(shiffed);
                }
                play(queue.songs[0]);
            })
            .on('error', error => console.error(error));
        dispatcher.setVolumeLogarithmic(queue.volume / 5);
        let noiceEmbed = new discord.MessageEmbed()
        .setTitle('Started Playing')
        .setThumbnail(song.thumbnail)
        .setColor(userinfo.color)
        .addField('Name', song.title, true)
        .addField('Requested By', song.requester, true)
        .addField('Views', song.views, true)
        .addField('Duration', timeString, true)
        queue.textChannel.send(noiceEmbed);
    };


    try {
        const connection = await channel.join();
        queueConstruct.connection = connection;
        play(queueConstruct.songs[0]);
    } catch (error) {
        console.error(`I could not join the voice channel`);
        message.client.queue.delete(message.guild.id);
        await channel.leave();
        return message.channel.send(`I could not join the voice channel: ${error}`);
    }
  },
};

