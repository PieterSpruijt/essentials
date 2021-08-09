const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "report",
  description: `Report an user!`,
  private: true,
  commandOptions: [
    {
      type: 6,
      name: `user`,
      description: `The user to report`,
      required: true
    },
    {
      type: 3,
      name: `reason`,
      description: `Reason for report`,
      required: true
    }
  ],
  run: async (bot, interaction, userinfo) => {
    let User = interaction.data.options[0].user
    let Avatar = User.displayAvatarURL();
    let Channel = interaction.guild.channels.cache.find(
      (ch) => ch.name === "reports"
    );
    if (!Channel)
      return bot.error(
        `There is no channel in this guild which is called \`#reports\``, bot, interaction
      );
    let Embed = new MessageEmbed()
      .setTitle(`New report!`)
      .setDescription(
        `${bot.config.emojis.normal.check} | The user \`${interaction.member.user.tag}\` has reported the user \`${User.tag}\`! `
      )
      .setColor(`RED`)
      .setThumbnail(Avatar)
      .addFields(
        { name: "Reporter ID", value: `${interaction.member.user.id}`, inline: true },
        { name: "Reporter Tag", value: `${interaction.member.user.tag}`, inline: true },
        { name: "Reported ID", value: `${User.id}`, inline: true },
        { name: "Reported Tag", value: `${User.tag}`, inline: true },
        { name: "Reason", value: `\`${interaction.data.options[1].value}\``, inline: true },
        {
          name: "Date (M/D/Y)",
          value: `${new Intl.DateTimeFormat("en-US").format(Date.now())}`,
          inline: true,
        }
      );
    Channel.send({ embeds: [Embed] });
    await interaction.editReply(`**${User.tag}** is reported for "${interaction.data.options[1].value}"`);

  },
};
