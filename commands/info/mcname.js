const { MessageEmbed } = require('discord.js');
const axios = require('axios');

module.exports = {
  name: "mcname",
  description: "Get Minecraft user",
  private: false,
  commandOptions: [
    {
      type: 3,
      name: `username`,
      description: `The Minecraft username`,
      required: true
    }
  ],
  run: async (bot, interaction, userinfo) => {
    let username = interaction.data.options[0].value;
    let url = `https://some-random-api.ml/mc?username=${encodeURIComponent(username)}`;
    await axios
      .get(url)
      .catch(() => { return bot.error(`Something went wrong!`, bot, interaction) })
      .then(async (embed) => {
        if (!embed) return;
        let { data } = embed;
        if (data.error) return bot.error(`I can't find that user!`, bot, interaction);
        let content = ``;
        for (let i = 0; i < data.name_history.length; i++) {
          if (i <= 9) {


            if (data.name_history[i].changedToAt != `Original Name`) {
              console.log(data)
              content += `${data.name_history[i].name}  -  ${data.name_history[i].changedToAt}\n`
            }
          }

        }
        if (!content.length) { content = `No name history` }
        let embed2 = new MessageEmbed()
          .setTitle(`${username}'s profile`)
          .addFields(
            { name: `Username:`, value: data.username },
            { name: `uuid:`, value: data.uuid },
            { name: `Names:`, value: content }
          )
          .setColor(userinfo.color);
        await interaction.editReply({ embeds: [embed2] });
      })
  },
};
