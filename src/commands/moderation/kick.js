module.exports = {
  name: "kick",
  description: "Kick a member!",
  private: true,
  commandOptions: [
    {
      type: 6,
      name: `user`,
      description: `The user to kick`,
      required: true
    },
    {
      type: 3,
      name: `reason`,
      description: `Reason for kick`,
      required: false
    }
  ],
  run: async (bot, interaction) => {
    if (!interaction.guild.me.permissions.has(bot.perms.KICK_MEMBERS)) return bot.error(`I Dont have Permission to do that!`, bot, interaction);
    if (!interaction.member.permissions.has(bot.perms.KICK_MEMBERS)) return bot.error(`You Dont have Permission to do that!`, bot, interaction);
    let User = await interaction.guild.members.fetch(interaction.data.options[0].value);
    if (!User) return bot.error(`I can't find that user!`, bot, interaction);
    if (User.permissions.has(bot.perms.KICK_MEMBERS)) return bot.error(`You can't kick a moderator`, bot, interaction);
    if (User.permissions.has(bot.perms.BAN_MEMBERS)) return bot.error(`You can't kick a moderator`, bot, interaction);
    if (!User.kickable) return bot.error(`I can't ban this user!`, bot, interaction);
    let Reason = interaction.data.options[1] ? interaction.data.options[1].value : `Not specified`;
    User.send(`you are kicked from **${interaction.guild.name}** for "${Reason}"`)
    interaction.guild.members.kick(User, { reason: Reason }).catch(() => {
      return bot.error(`I can't kick this user!`, bot, interaction);
    })
    await interaction.editReply(`**${User.user.tag}** is kicked for "${Reason}"`);
  },
};

