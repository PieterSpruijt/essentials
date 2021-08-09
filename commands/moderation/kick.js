const { MessageEmbed } = require("discord.js");

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
  run: async (bot, interaction, userinfo) => {
    if (!interaction.guild.me.permissions.has(bot.perms.KICK_MEMBERS)) return bot.error(`I Dont have Permission to do that!`, bot, interaction);
    if (!interaction.member.permissions.has(bot.perms.KICK_MEMBERS)) return bot.error(`You Dont have Permission to do that!`, bot, interaction);
    let User = interaction.data.options[0].user
    if (User.permissions.has(bot.perms.KICK_MEMBERS)) return bot.error(`You can't kick a moderator`, bot, interaction);
    if (User.permissions.has(bot.perms.BAN_MEMBERS)) return bot.error(`You can't kick a moderator`, bot, interaction);
    let Reason = interaction.data.options[1] ? interaction.data.options[1].value : `Not specified`;
    User.send(`you are kicked from **${interaction.guild.name}** for "${Reason}"`)
    interaction.guild.members.kick(User.id, { reason: Reason }).catch(error => {
      return bot.error(`I can't kick this user!`, bot, interaction);
    })
    await interaction.editReply(`**${User.tag}** is kicked for "${Reason}"`);
  },
};

