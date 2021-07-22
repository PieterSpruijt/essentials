const Discord = require('discord.js');

module.exports = {
  name: "commandlist",
  description: "Special developer command!",
  category: "support",
  aliases: ['cl'],
  usage: "`commandlist`",
  run: async (bot, message, args, userinfo) => {
    if (!userinfo.developer) {
      let Embed = new MessageEmbed()
        .setDescription(`${bot.info.emojis.normal.cross} You are not allowed to use the commandlist (cl) command\n This command is only for the Essentials support team!`)
        .setColor(`#e91e63`);
      return message.channel.send(Embed)
    }
    let content = [];
    let data = ``;
    bot.commands.forEach(c => {
      if (!content.includes(c.name)) {
        content.push(c.name);
        let usage = `None`;
        if (c.usage) usage = c.usage.replace('`', '').replace('`', '').replace('<', `&lt;`).replace('>', `&gt;`);
        let command = {
          usage: usage,
          description: c.description || `None`,
          aliases: c.aliases || `-`
        }
        data += `\n<tr>
<td>${command.usage}</td>
<td>${command.description}</td>
<td>${command.aliases}</td>
</tr>`;
      }
    });
    let attachment = new Discord.MessageAttachment(Buffer.from(data, 'utf-8'), 'myfile.txt');
    message.channel.send(`Command_list in html`, attachment);

  },
};