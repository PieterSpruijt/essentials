const { MessageEmbed } = require("discord.js");
const model = require("../../models/invites");

module.exports = {
  name: "invites",
  description: "Get invites",
  category: "invites",
  usage: "`invites <mention/id>`",
  run: async (bot, message, args, userinfo) => {
    let user = message.mentions.users.first() || bot.users.cache.get(args[0]) || message.author;
    var invites = await model.findOne({gid: message.guild.id, userid: user.id});
    if (invites) {
      var _ = new MessageEmbed()
      .setTitle(`📨 Invites`)
      .setColor(userinfo.color)
      .setDescription(`**${user.tag}** has ${invites.invites} invites (\`${invites.total}\` total, \`${invites.left}\` left)!`);
    } 
    if (!invites) {
      _ = new MessageEmbed()
      .setTitle(`📨 Invites`)
      .setColor(userinfo.color)
      .setDescription(`**${user.tag}** has 0 invites (\`0\` total, \`0\` left)!`);
    }
    message.channel.send({embeds: [_]})
  },
};

