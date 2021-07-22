const ids = require('../../ids.json');
const token = require("../../token.json");
const { MessageEmbed } = require('discord.js');
const Discord = require("discord.js");
const evallog = new Discord.WebhookClient(token.webhooks['eval-log'][0], token.webhooks['eval-log'][1]);

const clean = text => {
  if (typeof(text) === "string")
    return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
  else
      return text;
}


module.exports = {
  name: "eval",
  description: "Special developer command!",
  category: "support",
  usage: "`eval [code]`",
  aliases: ["e", "s_eval"],
  run: async (bot, message, args, userinfo) => {
    if (message.author.id != bot.config.ownerID) return;
    if (!userinfo.developer) {
      let Embed = new MessageEmbed()
        .setDescription(`${bot.info.emojis.normal.cross} You are not allowed to use the eval (e) command\n This command is only for the Essentials support team!`)
        .setColor(`#e91e63`);
    message.channel.send(Embed)
    }
    if (userinfo.developer) {
      try {
        const code = args.join(" ");
        if(code.includes(`token`)) return message.channel.send("I am not gonna show my token :person_facepalming:");

        let evaled = eval(code);

        let Embed2 = new MessageEmbed()
        .setDescription(`${bot.info.emojis.normal.cross} | You don't specify your code. | \`eval message.channel.send("Hello")\``)
        .setColor(`#e91e63`);
        if (!code) 
          return message.channel.send(Embed2);

        if (typeof evaled !== "string")
          evaled = require("util").inspect(evaled);
        message.channel.send({
          embed:{
            fields:[
              {name:"📥 Input code",value:`\`\`\`${args.slice().join(" ")}\`\`\``},
              {name:"📤 Output code",value:`\`\`\`${clean(evaled)}\`\`\``}
            ],
            color:`GREEN`
          }, code:"xl"}).catch((err)=>{message.channel.send(`the script executed, but an error was raised while sending it.\n\`\`\`${err}\`\`\``)});
         evallog.send({
            embed:{
              fields:[
                {name: "New code", value: `<@${message.author.id}>`},
                {name:"📥 Input code",value:`\`\`\`${args.slice().join(" ")}\`\`\``},
               {name:"📤 Output code",value:`\`\`\`${clean(evaled)}\`\`\``}
              ],
              color:`GREEN`
            }, code:"xl"}).catch((err)=>{evallog.send(`the script executed, but an error was raised while sending it.\n\`\`\`${err}\`\`\``)});
      } catch (err) {
        message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
      }
  }
    
  },
};
