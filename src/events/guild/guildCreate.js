const Discord = require('discord.js');



module.exports = async (bot, guild) => {
  try {
    let command = require(`../../commands/config/setup.js`);
    bot.api.applications(`775055776854441985`).guilds(guild.id).commands.post({
      data: {
        name: command.name,
        description: command.description,
        options: command.commandOptions,
        default_permission: true

      }
    }).catch(() => { });
    const webhookClient = new Discord.WebhookClient({ id: bot.config.webhooks['new-servers'][0], token: bot.config.webhooks['new-servers'][1] });
    let newembed = new Discord.MessageEmbed()
      .setTitle(`New Server: "${guild.name}" with id: "${guild.id}\nNow in ${bot.guilds.cache.size} Servers"`)
      .setColor('#e91e63')
      .setFooter(bot.config.embeds.footer_name)
      .setTimestamp();
    webhookClient.send({ embeds: [newembed] });
    let defaultChannel = "";
    guild.channels.cache.forEach((channel) => {
      if (channel.type == "text" && defaultChannel == "") {
        if (channel.permissionsFor(guild.me).has("SEND_MESSAGES")) {
          defaultChannel = channel;
        }
      }
    })
    const Embed2 = new Discord.MessageEmbed()
    Embed2.setColor('#7289da')
    Embed2.setTitle(`thanks for inviting ${bot.user.username}`)
    Embed2.setAuthor(bot.config.Botname, bot.config.embeds.footer_photo, bot.config.website)
    Embed2.setThumbnail(bot.config.embeds.footer_photo)
    Embed2.addFields(
      { name: 'How to set prefix?', value: `the default prefix is` + ' / ' + `(slash commands)` },
      { name: 'I need help what now?', value: `You can reach us by clicking [HERE](${bot.config.website}). we also have a discord help server click [HERE](${bot.config.support_server}).` },
      { name: 'Invite the bot!', value: `You can invite the bot by pressing [HERE](${bot.config.botInvite})` }
    )
    Embed2.setFooter(bot.config.embeds.footer_name, bot.config.embeds.footer_photo);
    defaultChannel.send({ embeds: [Embed2] })
    defaultChannel.send(bot.config.support_server);
  } catch (e) {
    //error
  }
};