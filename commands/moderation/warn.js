const warns = require("../../models/warns");

module.exports = {
  name: "warn",
  description: "Warn a user",
  private: true,
  commandOptions: [

    {
      type: 6,
      name: `user`,
      description: `The user to warn`,
      required: true
    },
    {
      type: 3,
      name: `reason`,
      description: `Reason for warn`,
      required: true
    }

  ],
  run: async (bot, interaction, userinfo) => {
    if (!interaction.member.permissions.has(bot.perms.KICK_MEMBERS))
      return bot.error(`You Dont have Permission to do that you can do \`report [tag user] [reason]\``, bot, interaction);
    let user = interaction.data.options[0].user;
    warns.findOne(
      { Guild: interaction.guild.id, User: user.id },
      async (err, data) => {
        if (err) console.log(err);
        if (!data) {
          let newWarns = new warns({
            User: user.id,
            Guild: interaction.guild.id,
            Warns: [
              {
                Moderator: interaction.member.user.id,
                Reason: interaction.data.options[1].value,
              },
            ],
          });
          newWarns.save();
          await interaction.editReply(
            `${user.tag} has been warned with the reason of ${interaction.data.options[1].value}. **${user.tag}** now has 1 warn.`
          );
        } else {
          data.Warns.unshift({
            Moderator: interaction.member.user.id,
            Reason: interaction.data.options[1].value,
          });
          data.save();
          await interaction.editReply(
            `${user.tag} has been warned with the reason of ${interaction.data.options[1].value}. **${user.tag}** now has ${data.Warns.length} warns.`
          );
        }
      }
    );
  },
};
