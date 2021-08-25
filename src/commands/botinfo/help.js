const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "help",
  description: "Get help & list with all commands.",
  category: "botinfo",
  usage: "`help <command>`",
  private: false,
  run: async (bot, interaction, userinfo) => {
    let Embed = new MessageEmbed();
	Embed.setColor(userinfo.color)
	Embed.setTitle('**Command List**')
	Embed.setURL('')
	Embed.setAuthor(bot.config.botName, bot.config.embeds.footer_photo, bot.config.website)
	Embed.setDescription(`**Important Links:** \n [Support Server](${bot.config.support_server}) | [Bot Invite](${bot.config.botInvite}) | [Donate](https://paypal.me/essentialsteam)`)
	Embed.setThumbnail('')
	Embed.addFields(
        { name: ':tada: Fun', value: ''},
        { name: ':musical_note: Music', value: ''},
        { name: ':sushi: Economy', value: ''},
        {name: ':incoming_envelope: Invites', value: ''},
        { name: ':clock: Leveling', value: '' },
        { name: ':information_source: Info', value: '' },
        { name: ':frame_photo: Image', value: '' },
        { name: ':gear: Config', value: '' },
        { name: ':hammer_pick: Mod', value: '' },
        { name: ':wrench: Other', value: '' },
  );
  interaction.editReply({embeds: [Embed]})
  },
};