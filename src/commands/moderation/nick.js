module.exports = {
  name: "nick",
  description: "Nick a member!",
  private: true,
  commandOptions: [
    {
      type: 6,
      name: "user",
      description: "The user to nick",
      required: true
    },
  ],
  run: async (bot, interaction) => {
    if (!interaction.guild.me.permissions.has(bot.perms.MANAGE_NICKNAMES)) return bot.error(`I Dont have Permission to do that!`, bot, interaction);
    let User = interaction.data.options[0].member;
    var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    var string_length = 8;
    var randomstring = '';
    for (var i = 0; i < string_length; i++) {
      var rnum = Math.floor(Math.random() * chars.length);
      randomstring += chars.substring(rnum, rnum + 1);
    }
    User.setNickname(`Moderated Name ${randomstring}`).catch(() => {
      return bot.error(`Something went wrong!`, bot, interaction);
    });
    await interaction.editReply(`**${User.user.tag}** is nicked!`);

  },
};

