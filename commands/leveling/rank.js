const canvacord = require("canvacord");
const Discord = require("discord.js")
const xpdb = require("../../models/xpdb");
const GuildSettings = require("../../models/settings");

module.exports = {
  name: "rank",
  description: "Check your or someones rank!",
  private: false,
  commandOptions: [
    {
      type: 1,
      name: `user`,
      description: `See or reset someones rank!`,
      options: [
        {
          type: 6,
          name: `user`,
          description: `The user`,
          required: true
        }
      ]
    },
    {
      type: 1,
      name: `reset`,
      description: `Reset's someones rank!`,
      options: [
        {
          type: 6,
          name: `user`,
          description: `The user`,
          required: true
        }
      ]
    }
  ],
  run: async (bot, interaction, userinfo) => {
    if (interaction.options._subcommand === `reset`) {
      if (!userinfo.developer && !interaction.member.permissions.has(bot.perms.ADMINISTRATOR)) bot.error(`You Dont have Permission to do that! You must be Administrator!`, bot, interaction);
      let User = interaction.data.options[0].user;
      const userData = await xpdb.findOne({ id: `${interaction.guild.id}_${User.id}` });
      if (!userData) return bot.error(`This users hasn't got a rank!`, bot, interaction);
      await xpdb.deleteOne({ id: `${interaction.guild.id}_${User.id}` });
      await interaction.editReply(`Deleted **${User.tag}**'s rank!`);
    } else {
      var storedSettings = await GuildSettings.findOne({ gid: interaction.guild.id });
      if (storedSettings) {
        if (!storedSettings.levels) return bot.error(`Levels are disabled in this server!`, bot, interaction)
      }
      let User = interaction.data.options[0] ? interaction.data.options[0].user : interaction.member.user;
      let Avatar = User.displayAvatarURL({ dynamic: false, format: 'png' });
      const userData = await xpdb.findOne({ id: `${interaction.guild.id}_${User.id}` });
      if (!userData) return bot.error(`This users hasn't send any messages!`, bot, interaction);
      const rank = new canvacord.Rank()
        .setAvatar(Avatar)
        .setCurrentXP(userData.xp)
        .setRequiredXP(userData.reqXP)
        .setLevel(userData.level)
        .setStatus("online")
        .setProgressBar(userinfo.color, "COLOR")
        .setUsername(User.username)
        .setDiscriminator(User.discriminator);
      rank.build()
        .then(async (data) => {
          const attachment = new Discord.MessageAttachment(data, "RankCard.png");
          await interaction.editReply({ files: [attachment] });
        });
    }

  },
};
