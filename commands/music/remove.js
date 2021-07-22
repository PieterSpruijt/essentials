const { MessageEmbed } = require("discord.js");
const sendError = require("../../util/error");

module.exports = {
  name: "remove",
  description: "Remove music!",
  category: "music",
  usage: "`remove [url/name]`",
  run: async (bot, message, args, userinfo) => {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return sendError("There is no queue.",message.channel);
    if (!args.length) return sendError(`Usage: ${client.config.prefix}\`remove <Queue Number>\``);
    if (isNaN(args[0])) return sendError(`Usage: ${client.config.prefix}\`remove <Queue Number>\``);
    if (queue.songs.length == 1) return sendError("There is no queue.",message.channel);
    if (args[0] > queue.songs.length)
      return sendError(`The queue is only ${queue.songs.length} songs long!`,message.channel);
try{
    const song = queue.songs.splice(args[0] - 1, 1); 
    message.channel.send(`❌ **|** Removed: **\`${song[0].title}\`** from the queue.`);
    message.react("✅")
} catch (error) {
        return sendError(`:notes: An unexpected error occurred.\nPossible type: ${error}`, message.channel);
      }
  },
};

