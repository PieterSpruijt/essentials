module.exports = {
  name: "say",
  description: "Get the bot to say what ever you want!",
  private: true,
  commandOptions: [
    {
      type: 3,
      name: `text`,
      description: `Text to say`,
      required: true
    },
    {
      type: 5,
      name: `embed`,
      description: `Send the text in an embed`,
      required: false
    }
  ],
  run: async (bot, interaction, userinfo) => {
    let embed = interaction.data.options[1] ? interaction.data.options[1].value : false;
    let text = interaction.data.options[0].value;
    if (embed) {
      interaction.channel.send({ embeds: [{ color: userinfo.color, description: text }] });
    } else {
      if (interaction.member.permissions.has(bot.perms.ADMINISTRATOR)) {

        interaction.channel.send(text);
      } else {
        interaction.channel.send({ content: text, allowedMentions: [`users`] });
      }
    }
    await interaction.editReply(`Mesage send!`);

  },
};
