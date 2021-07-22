const { MessageEmbed } = require("discord.js");
const sendError = require("../../util/error");

module.exports = {
  name: "loop",
  description: "Disable/enable loop!",
  category: "music",
  usage: "`loop`",
  run: async (bot, message, args, userinfo) => {
    const serverQueue = message.client.queue.get(message.guild.id);
       if (serverQueue) {
            serverQueue.loop = !serverQueue.loop;
            return message.channel.send({
                embed: {
                    color: userinfo.color,
                    description: `🔁  **|**  Loop is **\`${serverQueue.loop === true ? "enabled" : "disabled"}\`**`
                }
            });
        };
    return sendError("There is nothing playing in this server.", message.channel);
  },
};

