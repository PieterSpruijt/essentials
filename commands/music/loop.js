const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "loop",
  description: "Disable/enable loop!",
  category: "music",
  usage: "`loop`",
  run: async (bot, message, args, userinfo) => {
    const serverQueue = message.client.queue.get(message.guild.id);
       if (serverQueue) {
            serverQueue.loop = !serverQueue.loop;
             message.channel.send({
                embeds: [{
                    color: userinfo.color,
                    description: `🔁  **|**  Loop is **\`${serverQueue.loop === true ? "enabled" : "disabled"}\`**`
                }]
            });
            return message.client.queue.set(message.guild.id, serverQueue)
        };
    return bot.error("There is nothing playing in this server.", message.channel);
  },
};

