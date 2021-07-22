    const { MessageEmbed } = require("discord.js");
const sendError = require("../../util/error");

module.exports = {
  name: "leave",
  description: "Leave music channel!",
  category: "music",
  usage: "`leave`",
  run: async (bot, message, args, userinfo) => {
    let channel = message.member.voice.channel;
        if (!channel) return sendError("I'm sorry but you need to be in a voice channel!", message.channel);
        if (!message.guild.me.voice.channel) return sendError("I Am Not In Any Voice Channel!", message.channel);

        try {
            await message.guild.me.voice.channel.leave();
        } catch (error) {
            await message.guild.me.voice.kick(message.guild.me.id);
            return sendError("Trying To Leave The Voice Channel...", message.channel);
        }
        let queue = message.client.queue.get(message.guild.id)
        if (queue) {
            queue.songs = []
            queue.connection.dispatcher.end('Stopped!')
        }

        const Embed = new MessageEmbed()
            .setAuthor("Leave Voice Channel", "https://raw.githubusercontent.com/SudhanPlayz/Discord-MusicBot/master/assets/Music.gif")
            .setColor(userinfo.color)
            .setTitle("Success")
            .setDescription("🎶 Left The Voice Channel.")
            .setTimestamp();
        return message.channel.send(Embed).catch(() => message.channel.send("🎶 Left The Voice Channel :C"));
  },
};

