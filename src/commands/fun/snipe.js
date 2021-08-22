const { MessageEmbed } = require("discord.js");
module.exports = {
  name: "snipe",
  description: "Get a snipe of your choice in the channel!",
  private: false,
  commandOptions: [
    {
      type: 5,
      name: `editsnipe`,
      description: `Editsnipe`,
      required: false
    }
  ],
  run: async (bot, interaction, userinfo) => {
    if (interaction.data.options[0] ? interaction.data.options[0].value : false) {
      const snipes = bot.editsnipes.get(interaction.channel.id);
      if (!snipes) return bot.error(`I don't have any snipes in this channel!`, bot, interaction);
      const random = Math.floor(Math.random() * snipes.length);
      let msg = snipes[random];
      const Embed = new MessageEmbed()
        .setAuthor(
          msg.author.tag,
          msg.author.displayAvatarURL({ dynamic: true, size: 256 })
        )
        .addFields(
          { name: `Old content:`, value: "```" + msg.oldContent + "```" },
          { name: `New content:`, value: "```" + msg.newContent + "```" }
        )
        .setFooter(`Date: ${msg.date} | ${random + 1}/${snipes.length + 1}`);
      if (msg.attachment) Embed.setImage(msg.attachment);
      await interaction.editReply({ embeds: [Embed] });

    } else {
      const snipes = bot.snipes.get(interaction.channel.id);
      if (!snipes) return bot.error(`I don't have any snipes in this channel!`, bot, interaction);
      const random = Math.floor(Math.random() * snipes.length);
      let msg = snipes[random];
      const Embed = new MessageEmbed()
        .setColor(userinfo.color)
        .setAuthor(
          msg.author.tag,
          msg.author.displayAvatarURL({ dynamic: true, size: 256 })
        )
        .setDescription(msg.content)
        .setFooter(`Date: ${msg.date} | ${random + 1}/${snipes.length + 1}`);
      if (msg.attachment) Embed.setImage(msg.attachment);
      await interaction.editReply({ embeds: [Embed] });
    }

  },
};
