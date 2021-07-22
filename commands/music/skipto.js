const { MessageEmbed } = require("discord.js");
const sendError = require("../../util/error");

module.exports = {
  name: "skipto",
  description: "Skip to music",
  category: "music",
  aliases: ["st"],
  usage: "`skipto [url/name]`",
  run: async (bot, message, args, userinfo) => {
    if (!args.length || isNaN(args[0]))
      return message.channel.send(`you did not specify an number in the queue`);
        

    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return sendError("There is no queue.",message.channel);
    if (args[0] > queue.songs.length)
      return sendError(`The queue is only ${queue.songs.length} songs long!`,message.channel);

    queue.playing = true;

    if (queue.loop) {
      for (let i = 0; i < args[0] - 2; i++) {
        queue.songs.push(queue.songs.shift());
      }
    } else {
      queue.songs = queue.songs.slice(args[0] - 2);
    }
     try{
    queue.connection.dispatcher.end();
      }catch (error) {
        queue.voiceChannel.leave()
        message.client.queue.delete(message.guild.id);
       return sendError(`:notes: The player has stopped and the queue has been cleared.: ${error}`, message.channel);
      }
    
    queue.textChannel.send({
                        embed: {
                            color: userinfo.color,
                            description: `${message.author} ⏭ skipped \`${args[0] - 1}\` songs`
                        }
   
                   });
                   message.react("✅")
  },
};

