const custom = require("../../models/custom");
const { MessageEmbed } = require('discord.js');

module.exports = {
  name: "cc",
  description: "Create a custom command",
  category: "config",
  timeout: 5000,
  usage: "`cc [command] [text]`",
  aliases: ["custom"],
  run: async (bot, message, args, userinfo) => {
    let Embed2 = new MessageEmbed()
        .setDescription(`${bot.info.emojis.normal.cross} | You do not have enough permissions!`)
        .setColor(userinfo.color);
        let Embed3 = new MessageEmbed()
        .setDescription(`${bot.info.emojis.normal.cross} | You did not specify a custom command name!`)
        .setColor(userinfo.color);
        let Embed4 = new MessageEmbed()
        .setDescription(`${bot.info.emojis.normal.cross} | No content specified!`)
        .setColor(userinfo.color);

    if (!message.member.permissions.has(bot.perms.ADMINISTRATOR))
      return message.channel.send(Embed2);
    if (!args[0])
      return message.channel.send(Embed3);
    if (!args.slice(1).join(" "))
      return message.channel.send(Embed4);
    custom.findOne(
      { Guild: message.guild.id, Command: args[0] },
      async (err, data) => {
        if (err) throw err;
        if (data) {
          data.Content = args.slice(1).join(" ");
          data.save();

          message.channel.send(
            `${bot.info.emojis.normal.check} | Successfully updated the command \`${args[0]}\``
          );
        } else if (!data) {
          let newData = new custom({
            Guild: message.guild.id,
            Command: args[0],
            Content: args.slice(1).join(" "),
          });
          newData.save();
          message.channel.send(
            `${bot.info.emojis.normal.check} | Successfully created the command \`${args[0]}\``
          );
        }
      }
    );
  },
};
