const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "nuke",
  description: "Nuke a channel",
  private: true,
  usage: "nuke ",
  run: async (bot, interaction) => {
    if (!interaction.channel.permissionsFor(interaction.guild.me).has(bot.perms.MANAGE_CHANNELS)) return bot.error(`I Dont have Permsission to do that!`, bot, interaction);
    if (!interaction.member.permissions.has(bot.perms.ADMINISTRATOR))
      return bot.error(`You Dont have Permsission to do that!`, bot, interaction);
    if (interaction.guild.publicUpdatesChannelId) {
      if (interaction.guild.rulesChannelId === interaction.channel.id) return bot.error(`I can't nuke a community rules channel`, bot, interaction);
      if (interaction.guild.publicUpdatesChannelId === interaction.channel.id) return bot.error(`I can't nuke a Community updates channel`, bot, interaction);
    }
    await interaction.editReply(`Channel is being nuked!`);
    interaction.channel.clone().then((channel2) => {
      channel2.setPosition(interaction.channel.position).then(
        interaction.channel.delete()
      )
      let Embed = new MessageEmbed()
        .setImage(`https://i.imgur.com/Da7ScU4.gif`)
        .setTitle(`Channel Nuked by **${interaction.member.user.tag}**`)
        .setColor(`RED`)
      channel2.send({ embeds: [Embed] });
    });

  },
};
