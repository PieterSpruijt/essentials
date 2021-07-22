const canvacord = require("canvacord");
const Discord = require("discord.js")
const xpdb = require("../../models/xpdb");
const GuildSettings = require("../../models/settings");

module.exports = {
  name: "rank",
  description: "Check your or someones rank!",
  category: "leveling",
  usage: "rank <mention/id>",
  run: async (bot, message, args, userinfo) => {
    var storedSettings = await GuildSettings.findOne({ gid: message.guild.id });
      if (storedSettings) {
        if (!storedSettings.levels) return message.channel.send(`Levels are disabled in this server!`)
      }
    let User = message.mentions.users.first() || bot.users.cache.get(args[0]) || message.author;
    let Avatar = User.displayAvatarURL({ dynamic: false, format: 'png' });
    const userData = await xpdb.findOne({ id: `${message.guild.id}_${User.id}` });
    if (!userData) return message.channel.send(`This users hasn't send any messages!`)
    const rank = new canvacord.Rank()
    .setAvatar(Avatar)
    .setCurrentXP(userData.xp)
    .setRequiredXP(userData.reqXP)
    .setLevel(userData.level)
    .setStatus("online")
    .setProgressBar(userinfo.color, "COLOR")
    .setUsername(User.username)
    .setDiscriminator(User.discriminator);
    rank.build()
    .then(data => {
        const attachment = new Discord.MessageAttachment(data, "RankCard.png");
        message.channel.send(attachment);
    });
  },
};
