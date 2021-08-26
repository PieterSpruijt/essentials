const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "report",
  category: "moderation",
  description: "Report a user of your choice!",
  usage: "`report [mention]`",
  run: async (bot, message, args, userinfo) => {
    let User = message.mentions.users.first() || null;

    if (User == null) {
      return message.channel.send(`${bot.info.emojis.normal.cross} | You did not mention a user! | \`report [tag user] [reason]\``);
    } else {
      let Reason = message.content.slice(bot.prefix.length + 22 + 7) || null;
      if (Reason == null) {
        return message.channel.send(
          `${bot.info.emojis.normal.cross} | You did not specify a reason for the report! | \`report [tag user] [reason]\``
        );
      }
      let Avatar = User.displayAvatarURL();
      let Channel = message.guild.channels.cache.find(
        (ch) => ch.name === "reports"
      );
      if (!Channel)
        return message.channel.send(
          `${bot.info.emojis.normal.cross} | There is no channel in this guild which is called \`reports\``
        );
      let Embed = new MessageEmbed()
        .setTitle(`New report!`)
        .setDescription(
          `${bot.info.emojis.normal.check} | The user \`${message.author.tag}\` has reported the user \`${User.tag}\`! `
        )
        .setColor(`RED`)
        .setThumbnail(Avatar)
        .addFields(
          { name: "Reporter ID", value: `${message.author.id}`, inline: true },
          { name: "Reporter Tag", value: `${message.author.tag}`, inline: true },
          { name: "Reported ID", value: `${User.id}`, inline: true },
          { name: "Reported Tag", value: `${User.tag}`, inline: true },
          { name: "Reason", value: `\`${Reason.slice(1)}\``, inline: true },
          {
            name: "Date (M/D/Y)",
            value: `${new Intl.DateTimeFormat("en-US").format(Date.now())}`,
            inline: true,
          }
        );
      Channel.send({embeds: [Embed]});
      message.channel.send(`<@${message.author.id}>, your report is sended!`)
    }
  },
};
