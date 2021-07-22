const ReactionModel = require("../../models/ReactionRole");
const { Message, Client, MessageEmbed } = require("discord.js");

module.exports = {
  name: "rradd",
  description: "Add a reaction role",
  category: "reactionroles",
  usage: "`rradd [channel id] [role id] [emoji]`",
  /**
   * @param {Client} bot
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (bot, message, args, userinfo) => {
    let Embed2 = new MessageEmbed()
        .setDescription(`You Dont have Permission to do that! You must be Administrator!`)
        .setColor(`#e91e63`);
        let Embed3 = new MessageEmbed()
        .setDescription(`I could not find that channel in the guild!`)
        .setColor(`#e91e63`);
        let Embed4 = new MessageEmbed()
        .setDescription(`I could not find that message in the channel!`)
        .setColor(`#e91e63`);
        let Embed5 = new MessageEmbed()
        .setDescription(`I could not find thatrole in this server!`)
        .setColor(`#e91e63`);
        let Embed6 = new MessageEmbed()
        .setDescription(`That is a custom emojis or no emoji!`)
        .setColor(`#e91e63`);

    if (!message.member.permissions.has(bot.perms.ADMINISTRATOR)) {
      return message.channel.send(Embed2);
    }
    let number = (await ReactionModel.find({Guild: message.guild.id})).length;
    if (number >= 10) {
      return message.channel.send({embed: {color: userinfo.color, title: `Ooh, Ooh`, description: `You have reached the limit of reactionroles! Delete some with \`rrdel\`\n `}});
    }
    if (message.member.permissions.has(bot.perms.ADMINISTRATOR)) {
      const m4 = await message.channel.send(`What is the channel of the message?`);
        try {
          const msgs1 = await message.channel.awaitMessages(
              (u2) => u2.author.id === message.author.id,
              { time: 30000, max: 1, errors: ["time"] }
            );
            if (msgs1.first().mentions.channels.first()) {
                const channel = msgs1.first().mentions.channels.first();
              const m1 = await message.channel.send(`What is the messageID of the message?`)
              try {
                const msgs2 = await message.channel.awaitMessages(
                  (u2) => u2.author.id === message.author.id,
                  { time: 30000, max: 1, errors: ["time"] }
                );
                if (channel.messages.fetch(msgs2.first().content)) {
                    let messageID = msgs2.first().content;
                    const m2 = await message.channel.send(`What is the emoji?`);
                  try {
                    const msgs3 = await message.channel.awaitMessages(
                      (u2) => u2.author.id === message.author.id,
                      { time: 30000, max: 1, errors: ["time"] }
                    );
                    function isCustomEmoji(emoji) {
                      return emoji.split(":").length == 1 ? false : true;
                    }
                    if (!isCustomEmoji(msgs3.first().content)) {
                      const emoji = msgs3.first().content;
                      const m3 = await message.channel.send(`What is the role ID to give?`)
                      try {
                        const msgs4 = await message.channel.awaitMessages(
                          (u2) => u2.author.id === message.author.id,
                          { time: 30000, max: 1, errors: ["time"] }
                        );
                        if (message.guild.roles.cache.get(msgs4.first().content)) {
                          const role = message.guild.roles.cache.get(msgs4.first().content);
                          try {
                            const newData = new ReactionModel({
                                Guild: message.guild.id,
                                Reaction: emoji,
                                MessageID: messageID,
                                Channel: channel.id,
                                Role: role.id,
                              });
                              newData.save();
                              message.channel.send(`ReactionRole Created!`)
                              let m = await channel.messages.fetch(messageID);
                              m.react(emoji).catch(e => {})
                          } catch (e) {
                            return console.log(e)
                          }
                          
                    
                        } else {
                          return message.channel.send(Embed5);
                        }
                      } catch (e) {
                        return console.log(e)
                      }
                      
                
                    } else {
                      return message.channel.send(Embed6);
                    }
                  } catch (e) {
                    return message.channel.send(`You did not answer!`);
                  }
                  
                  
                  
                } else {
                  message.channel.send(Embed4);
                }
              } catch (e) {
                return message.channel.send(`You did not answer!`);
              }
              

            } else {
              message.channel.send(Embed3);
            }
          } catch (e) {
            return message.channel.send(`You did not answer!`);
          }
      
    
    }
  },
};
