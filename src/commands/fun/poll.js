const Discord = require("discord.js");

module.exports = {
  name: "poll",
  description: "Create a simple yes or no poll",
  private: true,
  commandOptions: [
    {
      type: 7,
      name: `channel`,
      description: `The channel for the poll`,
      required: true
    },
    {
      type: 3,
      name: `poll`,
      description: `The question of the poll`,
      required: true
    }
  ],
  run: async (bot, interaction, userinfo) => {
    if (!interaction.member.permissions.has(bot.perms.ADMINISTRATOR))
      return bot.error(`You Dont have Permission to do that! You must be Administrator!`, bot, interaction);
    const channel = interaction.data.options[0]
    if (!channel.channel) return bot.error(`This is not a text channel`, bot, interaction);
    if (channel.channel.type != `GUILD_TEXT`) return bot.error(`This is not a text channel`, bot, interaction);
    let question = interaction.data.options[1].value;
    const Embed = new Discord.MessageEmbed()
      .setTitle(`New poll!`)
      .setDescription(`${question}`)
      .setFooter(`${interaction.member.user.tag} created this poll.`)
      .setColor(userinfo.color);
    let msg = await channel.channel.send({ embeds: [Embed] });
    await msg.react("👍");
    await msg.react("👎");
    await interaction.editReply(`Poll created!`);
  },
};
