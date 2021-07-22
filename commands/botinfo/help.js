const { MessageEmbed } = require("discord.js");
const GuildSettings = require("../../models/settings");

module.exports = {
  name: "help",
  description: "Get help & list with all commands.",
  category: "botinfo",
  usage: "`help <command>`",
  aliases: ["commands"],
  run: async (bot, message, args, userinfo) => {
    var storedSettings = await GuildSettings.findOne({ gid: message.guild.id });
    if (!storedSettings) {
      // If there are no settings stored for this guild, we create them and try to retrive them again.
      const newSettings = new GuildSettings({
        gid: message.guild.id,
        prefix: bot.config.prefix
      });
      await newSettings.save().catch(()=>{});
      storedSettings = await GuildSettings.findOne({ gid: message.guild.id });
    }

    let Embed = new MessageEmbed();
	Embed.setColor(userinfo.color)
	Embed.setTitle('**Command List**')
	Embed.setURL('')
	Embed.setAuthor(bot.info.embed.Botname, bot.info.embed.profielfoto, bot.info.embed.website)
	Embed.setDescription(`**Important Links:** \n [Support Server](${bot.config.support_server}) | [Bot Invite](${bot.config.inviteurl}) | [Donate](https://paypal.me/essentialsteam)`)
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
  )
	Embed.setFooter(`To get more info on a command, do ${storedSettings.prefix}help command name!`);

	
	
	const data = [];
        const { commands } = message.client;

        if(!args.length){
            return message.channel.send(Embed)
        }

        const name = args[0].toLowerCase();
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));
        let Embed2 = new MessageEmbed()
        .setDescription(`${bot.info.emojis.normal.cross} | that\'s not a valid command!`)
        .setColor(`#e91e63`);

        if (!command) {
          let m = await message.channel.send(Embed2);
  
    return;
        }   
        let helpEmbed = new MessageEmbed()
        helpEmbed.setColor(userinfo.color)
        helpEmbed.setTitle(`Command Help`)
        helpEmbed.setAuthor(bot.info.embed.Botname, bot.info.embed.profielfoto, bot.config.website)
        helpEmbed.setDescription('')
        if (command.name) helpEmbed.addField(`**Name**`, command.name, true)
        if (command.description) helpEmbed.addField(`**Description:**`, command.description, true)
        if (command.usage) helpEmbed.addField(`**Usage:**`, command.usage, true)
        if (command.aliases) helpEmbed.addField(`**Aliases:**`, command.aliases.join(', '), true)
        helpEmbed.setFooter(bot.info.embed.footer_name, bot.info.embed.footer_foto);
        let m = await message.channel.send(helpEmbed);
  },
};