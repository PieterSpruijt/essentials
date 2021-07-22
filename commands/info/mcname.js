const { MessageEmbed } = require('discord.js');
const axios = require('axios');

module.exports = {
  name: "mcname",
  description: "Get Minecraft user",
  category: "info",
  usage: "`mcname`",
  run: async (bot, message, args, userinfo) => {
    if (!args[0]) return bot.error(`You did not specify a name!`, message.channel);
    let url = `https://some-random-api.ml/mc?username=${encodeURIComponent(args[0])}`;
    axios
      .get(url)
      .then(async (embed) => {
        let { data } = embed;
        if (data.error) return bot.error(`I can't find that user!`, message.channel);
        let content = ``;
        for (let i = 0; i < data.name_history.length; i++) {
          if (i <= 9) {
            let username = data.name_history[i].username;
    
            if (data.name_history[i].changedToAt != `Original Name`) {
                content += `${data.name_history[i].username}  -  ${data.name_history[i]/changedToAt}\n`
            } else {
            }
          }
    
          }
          if (!content.length) { content = `No name history`}
        let embed2 = new MessageEmbed()
          .setTitle(`${args[0]}'s profile`)
          .addFields(
            { name: `Username:`, value: data.username },
            { name: `uuid:`, value: data.uuid },
            { name: `Names:`, value: content}
          )
          .setColor(userinfo.color);
        message.channel.send({embeds: [embed2]});
      })
  },
};
