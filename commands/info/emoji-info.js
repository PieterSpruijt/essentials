const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "emoji-info",
  description: "Get emoji info",
  category: "info",
  usage: "`emoji-info [emoji]`",
  run: async (bot, message, args, userinfo) => {
    let hasEmoteRegex = /<a?:.+:\d+>/gm
    let emoteRegex = /<:.+:(\d+)>/gm
    let animatedEmoteRegex = /<a:.+:(\d+)>/gm
  
    let msgs = await message.channel.messages.fetch()
    let msg = msgs.find(m => m.content.match(hasEmoteRegex))
  
    if (emoji = emoteRegex.exec(msg)) {
    let url = "https://cdn.discordapp.com/emojis/" + emoji[1] + ".png?v=1"
    let data = bot.emojis.cache.get(emoji[1])
    let embed = new MessageEmbed()
    .setTitle(`Emoji found!`)
    .setDescription('Found an emoji with id:`' + emoji[1] + '`')
    .addFields(
      {name: `Name:`, value: data.name},
      {name: `ID:`, value: data.id},
      {name: `Animated:`, value: data.animated},
      {name: `Guild:`, value: `"${data.guild.name}"`}
    )
    .setImage(url)
    .setColor(userinfo.color);
    message.channel.send({embeds: [embed]});
    }
    else if (emoji = animatedEmoteRegex.exec(msg)) {
    let url = "https://cdn.discordapp.com/emojis/" + emoji[1] + ".gif?v=1"
    let data = bot.emojis.cache.get(emoji[1])
    let embed = new MessageEmbed()
    .setTitle(`Emoji found!`)
    .setDescription('Found an emoji with id:`' + emoji[1] + '`')
    .addFields(
      {name: `Name:`, value: data.name},
      {name: `ID:`, value: data.id},
      {name: `Animated:`, value: data.animated},
      {name: `Guild:`, value: `"${data.guild.name}"`},
      {name: `Download:`, value: `[HERE](${url})`}
    )
    .setImage(url)
    .setColor(userinfo.color);
    message.channel.send({embeds: [embed]});
    }
    else {
    message.channel.send("Couldn't find an emoji to paste!")
    }
  },
};

