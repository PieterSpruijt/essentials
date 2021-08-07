const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "help",
  description: "Get help & list with all commands.",
  category: "botinfo",
  usage: "`help <command>`",
  aliases: ["commands"],
  run: async (bot, interaction, userinfo) => {
    let Embed = new MessageEmbed();
	Embed.setColor(userinfo.color)
	Embed.setTitle('**Command List**')
	Embed.setURL('')
	Embed.setAuthor(bot.config.botName, bot.config.embeds.footer_photo, bot.config.website)
	Embed.setDescription(`**Important Links:** \n [Support Server](${bot.config.support_server}) | [Bot Invite](${bot.config.botInvite}) | [Donate](https://paypal.me/essentialsteam)`)
	Embed.setThumbnail('')
	Embed.addFields(
        { name: ':tada: Fun', value: '`activity-start`, `yttogether`, `8ball`, `ad`, `announce`, `avatar`, `meme`, `poll`, `embed`, `say`, `trivia`, `gif`, `howgay`, `epicgamerrate`, `snipe`, `editsnipe`, `remind`, `randomtoken`, `url`'},
        { name: ':musical_note: Music', value: '`leave`, `loop`, `lyrics`, `nowplaying`, `pause`, `play`, `queue`, `remove`, `resume`, `shuffle`, `skip`, `skipto`, `stop`, `volume`'},
        { name: ':sushi: Economy', value: '`addbal`, `balance`, `beg`, `cleareconomy`, `deposit`, `economy`, `lottery`, `pay`, `removebal`, `rob`, `slots`, `withdraw`, `work`'},
        {name: ':incoming_envelope: Invites', value: '`addinvites`, `delinvites`, `clearinvites`, `joinmessage`, `invites`, `addjoinrole`, `deljoinrole`, `joinroles`'},
        { name: ':clock: Leveling', value: '`rank`, `levels`, `resetlevel`, `addreward`, `delreward`, `rewardlist`' },
        { name: ':information_source: Info', value: '`weather`, `color-info`, `mcname`, `leaderboard`, `botinfo`, `serverinfo`, `docs`, `help`, `ping`, `bot`, `vote`, `debug`, `credits`' },
        { name: ':frame_photo: Image', value: '`fox`, `panda`, `red-panda`, `cat`, `dog`, `duck`, `kiss`, `podium`, `spank`, `wanted`, `ascii`' },
        { name: ':gear: Config', value: '`delguilddata`, `cc`, `prefix`, `logchannel`, `settings`' },
        { name: ':hammer_pick: Mod', value: '`banlist`, `clear`, `ban`, `kick`, `report`, `warn`, `warns`, `slowmode`, `role`' },
        { name: ':wrench: Other', value: '`afk`, `giveaway`, `rradd`, `rrdel`, `emoji`, `invite`, `mcstatus`' },		
  );
  interaction.editReply({embeds: [Embed]})
  },
};