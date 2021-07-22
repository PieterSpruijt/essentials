const { MessageEmbed } = require('discord.js');
const figlet = require('figlet');
const jsp = require('jspaste')
const { text } = require("figlet");

module.exports = {
  name: "ascii",
  description: "Make text with ascii!",
  category: "images",
  usage: "`ascii [text]`",
  run: async (bot, message, args, userinfo) => {
    let Embed2 = new MessageEmbed()
        .setDescription(`${bot.info.emojis.normal.cross} | You did not specify your text! | \`ascii [text]\``)
        .setColor(userinfo.color);
    if(args[0] == null) return message.channel.send(Embed2);
    let test = args.join(" ");
        figlet(test, async function(err, ascii) {
          if (err) {
              message.channel.send(Embed2)
              console.dir(err);
              return;
          }
          const link = await jsp.publicar(ascii)
          let Embed3 = new MessageEmbed()
          .setAuthor(bot.info.embed.Botname, bot.info.embed.profielfoto, bot.info.embed.website)
          .addField('Download', `[Direct](${link.url})`)
          .addField('Preview', `\`\`\`${ascii}\`\`\``)
          .setColor(userinfo.color)
          .setFooter(bot.info.embed.footer_name, bot.info.embed.footer_foto);
          message.channel.send({embeds: [Embed3]});
        
    
      
  });
  },
};
