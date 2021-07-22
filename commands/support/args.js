const Discord = require('discord.js');

module.exports = {
  name: "args",
  description: "Special developer command!",
  category: "support",
  usage: "`args [arg]`",
  SupportOnly: true,
  run: async (bot, message, args, userinfo) => {
    const rules = new Discord.MessageEmbed()
	.setColor('#e91e63')
	.setTitle('Rules')
	.setAuthor(bot.info.embed.Botname, bot.info.embed.profielfoto, bot.info.embed.website)
	.setDescription('_____')
	.setThumbnail(bot.info.embed.profielfoto)
  .addField('1. Be respectful', 'You must respect all users, regardless of your liking towards them. Treat others the way you want to be treated.')
  .addField('2. No Inappropriate Language', 'The use of profanity should be kept to a minimum. However, any derogatory language towards any user is prohibited.')
  .addField('3. No spamming', 'Don\'t send a lot of small messages right after each other. Do not disrupt chat by spamming.')
  .addField('4. No pornographic/adult/other NSFW material', 'This is a community server and not meant to share this kind of material.')
  .addField('5. No advertisements', 'We do not tolerate any kind of advertisements, whether it be for other communities or streams. You can post your content in the media channel if it is relevant and provides actual value (Video/Art)')
  .addField('6. No offensive names and profile pictures', 'You will be asked to change your name or picture if the staff deems them inappropriate.')
  .addField('7. Server Raiding', 'Raiding or mentions of raiding are not allowed.')
  .addField('8. Direct & Indirect Threats', 'Threats to other users of DDoS, Death, DoX, abuse, and other malicious threats are absolutely prohibited and disallowed.')
  .addField('9. Follow the Discord Community Guidelines', 'You can find them here: https://discordapp.com/guidelines')
  .addField('10. Do not join voice chat channels without permission of the people already in there', 'If you see that they have a free spot it is alright to join and ask whether they have an open spot, but leave if your presence is not wanted by whoever was there first.')
  .addField('__', 'The Admins and Mods will Mute/Kick/Ban per discretion. If you feel mistreated dm an Admin and we will resolve the issue.\nAll Channels will have pinned messages explaining what they are there for and how everything works. If you don\'t understand something, feel free to ask!\nYour presence in this server implies accepting these rules, including all further changes. These changes might be done at any time without notice, it is your responsibility to check for them.')
	.setFooter(bot.info.embed.footer_name, bot.info.embed.footer_foto);

const plans = new Discord.MessageEmbed()
  .setColor('#e91e63')
	.setTitle(':pushpin: ESSENTIALS PACKAGES')
  .addField(`<:donator:826425335708385280> Package: Donators`, `Name: **Donator**\nRole: **<@&814923216857464853>**\nPrice: **€1-5**\n\nName: **Donator+**\nRole: **<@&818790219809423380>**\nPrice: **€5-10**\n\nName: **Donator++**\nRole: **<@&826485903558967367>**\nPrice: **€10+**`)
  .addField(`🤖 Bot commands:`, `€0,30 per command`)
  .addField(`Events:`, `€0,20 per event`)
  .addField(`Plugins:`, `€1,50 per botplugin (logging/invites/music/usersystem/moderation and more)`)
	.setFooter(`#help-desk to purchase.`);

    if (!userinfo.developer) {
      let Embed = new Discord.MessageEmbed()
        .setDescription(`${bot.info.emojis.normal.cross} You are not allowed to use the args command\n This command is only for the Essentials support team!`)
        .setColor(`#e91e63`);
    message.channel.send(Embed)
    }
    if (userinfo.developer) {
        if (args[0] === `rules`) {
          message.channel.send(rules);
        }      
        if (args[0] === `plans`) {
          message.channel.send(plans);
        }
        if (args[0] === `reply`) {
          bot.api.channels[message.channel.id].messages.post({
            data: {
               "content": "This is a reply!",
               "tts": false,
               message_reference: {
                  message_id: message.id,
                  guild_id: message.guild.id,
                  channel_id: message.channel.id
               }
            }
         })
        }
  }



    
  },
};