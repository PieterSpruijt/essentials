const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "remove",
  description: "Remove music!",
  category: "music",
  usage: "`remove [url/name]`",
  run: async (bot, message, args, userinfo) => {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return bot.error("There is no queue.",message.channel);
    if (!args.length) return bot.error(`Usage: ${client.config.prefix}\`remove <Queue Number>\``);
    if (isNaN(args[0])) return bot.error(`Usage: ${client.config.prefix}\`remove <Queue Number>\``);
    if (queue.songs.length == 1) return bot.error("There is no queue.",message.channel);
    if (args[0] > queue.songs.length)
      return bot.error(`The queue is only ${queue.songs.length} songs long!`,message.channel);
try{
    const song = queue.songs.splice(args[0] - 1, 1); 
    bot.success(`❌ **|** Removed: **\`${song[0].title}\`** from the queue.`, message.channel);
    message.react("✅")
} catch (error) {
        return bot.error(`:notes: An unexpected error occurred.\nPossible type: ${error}`, message.channel);
      }
  },
};

