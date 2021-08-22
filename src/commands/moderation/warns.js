const warns = require("../../models/warns");
const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "warns",
  description: "Get a user's warns in the guild!",
  private: true,
  commandOptions: [
    {
      type: 6,
      name: `user`,
      description: `The user`,
      required: true
    }
  ],
  run: async (bot, interaction, userinfo) => {
    if (!interaction.member.permissions.has(bot.perms.KICK_MEMBERS))
      return bot.error(`You Dont have Permsission to do that you can do \`report [tag user] [reason]\``, bot, interaction);
    let user = interaction.data.options[0].user;
    warns.find(
      { Guild: interaction.guild.id, User: user.id },
      async (err, data) => {
        if (err) console.log(err);
        if (!data.length)
          return await interaction.editReply(
            `${user.user.tag} has not got any warns in this guild!`
          );
        let Embed = new MessageEmbed()
          .setTitle(`${user.tag}'s warns in ${interaction.guild.name}.. `)
          .setColor(userinfo.color)
          .setDescription(
            data.map((d) => {
              return d.Warns.map(
                (w, i) => 
                  `${i + 1} - Moderator: ${interaction.guild.members.cache.get(w.Moderator) ? interaction.guild.members.cache.get(w.Moderator).user.tag : w.Moderator} Reason: ${w.Reason}`
              ).join("\n");
            }).toLocaleString()
          );
        await interaction.editReply({ embeds: [Embed] });
      }
    );
  },
};
