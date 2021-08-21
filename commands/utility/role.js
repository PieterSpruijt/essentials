module.exports = {
  name: "role",
  description: "Add/remove someones roles!",
  private: true,
  commandOptions: [
    {
      type: 6,
      name: `user`,
      description: `The user`,
      required: true
    },
    {
      type: 8,
      name: `role`,
      description: `The role`,
      required: true
    }
  ],
  run: async (bot, interaction) => {
    var User = interaction.data.options[0].member;
    var role = interaction.data.options[1].role;
    await interaction.guild.members.fetch(User.user.id);
    if (!interaction.member.hasPermission(bot.perms.MANAGE_ROLES)) return bot.error(`You Dont have Permission to do that!`, bot, interaction);
    if (interaction.member.roles.highest.rawPosition <= role.rawPosition) return bot.error(`You Dont have Permission to do that!`, bot, interaction);
    if (interaction.guild.me.roles.highest.rawPosition <= User.roles.highest.rawPosition || interaction.guild.me.roles.highest.rawPosition <= role.rawPosition) {
      return bot.error(`You don't have the perms to do that!`, bot, interaction)
    } else {
      if (User.roles.cache.has(role.id)) {
        User.roles.remove(role).catch(() => {
          return bot.error(`Something went wrong with removing the role!`, bot, interaction);
        });
        await interaction.editReply(`Successfull removed **${role.name}** from **${User.user.tag}**`);
      } else {
        User.roles.add(role).catch(() => {
          return bot.error(`Something went wrong with adding the role!`, bot, interaction);
        });
        await interaction.editReply(`Successfull added **${role.name}** to **${User.user.tag}**`);
      }
    }
  },
};
