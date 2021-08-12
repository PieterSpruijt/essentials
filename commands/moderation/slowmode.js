module.exports = {
  name: "slowmode",
  category: "moderation",
  description: "Set the slowmode for the channel!",
  private: false,
  commandOptions: [
    {
      type: 10,
      name: "seconds",
      description: "Amount of seconds to set slowmode to",
      required: true
    }
  ],
  run: async (bot, interaction) => {
    if (!interaction.member.permissions.has(bot.perms.MANAGE_CHANNELS)) return bot.error(`You are not allowed to do this`, bot, interaction);
    if (interaction.data.options[0].value > 21600000) return bot.error(`That is not a valid number (needs to be under 6h)!`, bot, interaction);
    interaction.channel.setRateLimitPerUser(interaction.data.options[0].value);
    await interaction.editReply(`Slowmode set to ${interaction.data.options[0].value}`);


  },
};
