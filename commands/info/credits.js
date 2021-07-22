const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "credits",
  description: "Get bot credits",
  category: "info",
  usage: "`credits`",
  run: async (bot, message, args, userinfo) => {
    let _ = new MessageEmbed()
    .setColor(userinfo.color)
    .setTitle(`Essentials | Credits`)
    .setFooter(bot.info.embed.footer_name)
    .setDescription(`Essentials is a bot owned by PieterSpruijt#5136 (<@628205772509151240>) with a lot of features!`)
    .addFields(
        {name: `Developers`, value: '[PieterSpruijt#5139](https://github.com/PieterSpruijt)  =>  `bot` & `server` & `hosting`\n! ! ! IrishAU#3995  =>  `website`'},
        {name: `Thanks to:`, value: `[All donators](https://patreon.com/join/essentialsteam) <:donator:826425335708385280>\n[All translators](${bot.config.support_server})\n[All staff & support members](${bot.config.support_server})\n[</Pascal>#4627](https://github.com/DotwoodMedia)  =>  \`logging\``}
    );
    message.channel.send(_)
  },
};

