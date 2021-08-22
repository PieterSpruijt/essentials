const model = require("../../models/afk");
const { MessageEmbed } = require('discord.js');

module.exports = {
  name: "afk",
  description: "Set your afk!",
  private: false,
  commandOptions: [
    {
      type: 1,
      name: `set`,
      description: `Set afk`,
      options: [
        {
          type: 3,
          name: `message`,
          description: `The afk message`,
          required: false
        }
      ]

    },
    {
      type: 1,
      name: `list`,
      description: `List of afk people`,
    }
  ],
  run: async (bot, interaction, userinfo) => {
    const command = interaction.options._subcommand;
    if (command === `set`) {
      const text = interaction.data.options[0] ? interaction.data.options[0].value : `Not specified`;
      let User = interaction.member.user;
      var afk = await model.findOne({ gid: interaction.guild.id, userid: User.id });
      if (afk) return bot.error(`You're already afk`, bot, interaction);
      const newData = new model({
        gid: interaction.guild.id,
        userid: User.id,
        message: text,
      });
      newData.save();
      interaction.member.setNickname(`[AFK] ` + interaction.member.displayName).catch(() => { });
      await interaction.editReply({ embeds: [{ description: ` Set your afk: ${text}`, color: userinfo.color }] });
    } else if (command === `list`) {

      let list = await model.find({ gid: interaction.guild.id });
      if (!list) return bot.error(`Nobady is afk`, bot, interaction);
      let content = "";
      for (let i = 0; i < list.length; i++) {
        if (i <= 9) {
          let user = `<@${list[i].userid}>`;
          let if1;
          if (list[i].message.lenght >= 10) {
            if1 = `Too long`
          } else {
            if1 = list[i].message
          }
          content += `${i + 1} **${user}** -  ${if1}\n`
        }

      }
      if (content.length === 0) {
        content = `No users are afk!`
      }
      let embed = new MessageEmbed()
        .setTitle(`Afk users:`)
        .setDescription(content)
        .setColor(userinfo.color);
      await interaction.editReply({ embeds: [embed] });
    }

  },
};
