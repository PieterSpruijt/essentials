module.exports = {
  name: "ban",
  description: "Ban a member!",
  private: true,
  commandOptions: [
    {
      type: 6,
      name: `user`,
      description: `The user to ban`,
      required: true
    },
    {
      type: 3,
      name: `reason`,
      description: `Reason for ban`,
      required: false
    }
  ],
  run: async (bot, interaction, userinfo) => {
    if (!interaction.guild.me.permissions.has(bot.perms.BAN_MEMBERS)) return bot.error(`I Dont have Permission to do that!`, bot, interaction);
    if (!interaction.member.permissions.has(bot.perms.BAN_MEMBERS)) return bot.error(`You Dont have Permission to do that!`, bot, interaction);
    let User = interaction.data.options[0].member;
    if (User.permissions.has(bot.perms.KICK_MEMBERS)) return bot.error(`You can't ban a moderator`, bot, interaction);
    if (User.permissions.has(bot.perms.BAN_MEMBERS)) return bot.error(`You can't ban a moderator`, bot, interaction);
    let banReason = interaction.data.options[1] ? interaction.data.options[1].value : `Not specified`;
    User.send(`you are banned from **${interaction.guild.name}** for "${banReason}"`).then(async (User) => {
      interaction.guild.members.ban(User.id, { reason: banReason }).catch(error => {
        return bot.error(`Something went wrong`, bot, interaction);
      });
    });
    await interaction.editReply(`**${User.user.tag}** is banned for "${banReason}"`);

  },
};
