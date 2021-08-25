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
    Embed.setDescription(`**Important Links:** \n [Support Server](${bot.config.support_server}) | [Bot Invite](${bot.config.botInvite}) | [Donate](https://ko-fi.com/pieterspruijt)`)
    Embed.setThumbnail('')
    Embed.addFields(
      { name: ':tada: Fun', value: '`8ball`, `activity`, `calculate`, `decode`, `encode`, `epicgamerrate`, `howgay`, `randomtoken`, `say`, `snipe`, `userinfo`, `image`, `color-info`, `mcname`, `afk`, `emoji`, `mcstatus`, `pwdgen`, `remind`, `url`' },
      { name: ':musical_note: Music', value: '`loop`, `lyrics`, `nowplaying`, `pause`, `play`, `queue`, `remove`, `resume`, `shuffle`, `skip`, `stop`, `volume`' },
      { name: ':sushi: Economy', value: '`balance`, `beg`, `rob`, `slots`, `work`' },
      { name: ':incoming_envelope: Invites', value: '`invites`, `joinmessage`, `joinroles`' },
      { name: ':clock: Leveling', value: '`rank`, `rewards`' },
      { name: ':information_source: Info', value: '`botinfo`, `help`, `invite`, `' },
      { name: ':gear: Server', value: '`settings`, `setup`, `dev`, `poll`, `leaderboard`, `reactionroles`, `serverinfo`' },
      { name: ':hammer_pick: Mod', value: '`ban`, `clear`, `clearuser`, `kick`, `nick`, `nuke`, `report`, `slowmode`, `warn`, `warns`, `role`' },
      { name: ':wrench: Other', value: '' },
    );
    interaction.editReply({ embeds: [Embed] })
  },
};