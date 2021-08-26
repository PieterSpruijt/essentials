const Discord = require('discord.js');

module.exports = {
  name: "guildlist",
  description: "Special developer command!",
  category: "support",
  aliases: ['gl'],
  usage: "`guildlist`",
  run: async (bot, message, args, userinfo) => {
    if (!userinfo.developer) {
      let Embed = new MessageEmbed()
        .setDescription(`${bot.info.emojis.normal.cross} You are not allowed to use the commandlist (cl) command\n This command is only for the Essentials support team!`)
        .setColor(`#e91e63`);
      return message.channel.send(Embed)
    }
    let data = ``;
    bot.guilds.cache.forEach(guild => {

        data += `\n"${guild.name}  (${guild.id})", "${guild.memberCount} members", ""${guild.channels.cache.size} channels", "owner: ${guild.ownerID}", "${guild.roles.cache.size} roles"`;
      
    });
    let attachment = new Discord.MessageAttachment(Buffer.from(data, 'utf-8'), 'myfile.txt');
    message.channel.send(`all guilds`, attachment);

  },
};