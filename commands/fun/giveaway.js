const { MessageEmbed } = require("discord.js");

const ms = require("ms");
module.exports = {
  name: "giveaway",
  description: "Create a simple giveaway",
  usage: "`giveaway`",
  category: "fun",
  run: async (bot, message, args, userinfo) => {
    if (!message.member.permissions.has(bot.perms.ADMINISTRATOR)) {
      return bot.error(`You Dont have Permission to do that! You must be Administrator!`, message.channel)
    }
    if (message.member.permissions.has(bot.perms.ADMINISTRATOR)) {
      message.channel.send(`What is the time of the giveaway?`);
        try {
            let msgs = await message.channel.awaitMessages(
              (u2) => u2.author.id === message.author.id,
              { time: 15000, max: 1, errors: ["time"] }
            );
            if (msgs.first().content.endsWith('s') || msgs.first().content.endsWith('d') || msgs.first().content.endsWith('m') || msgs.first().content.endsWith('h')) {
                let time = msgs.first().content;
              message.channel.send(`Mention the channel you want the giveaway in`)
              try {
                let msgs = await message.channel.awaitMessages(
                  (u2) => u2.author.id === message.author.id,
                  { time: 15000, max: 1, errors: ["time"] }
                );
                if (msgs.first().mentions.channels.first()) {
                    let channel = msgs.first().mentions.channels.first();
                  message.channel.send(`What is the prize of the giveaway?`);
                  try {
                    let msgs = await message.channel.awaitMessages(
                      (u2) => u2.author.id === message.author.id,
                      { time: 15000, max: 1, errors: ["time"] }
                    );
                    if (msgs.first().content) {
                      const prize = msgs.first().content;
                      message.channel.send(`How many winners?`)
                      try {
                        let msgs = await message.channel.awaitMessages(
                          (u2) => u2.author.id === message.author.id,
                          { time: 15000, max: 1, errors: ["time"] }
                        );
                        if (parseInt(msgs.first().content)) {
                            let winners = msgs.first().content;
                            message.channel.send(`*Giveaway created in ${channel}* (${prize})`);
            
                            bot.giveawaysManager.start(channel, {
                              // The giveaway duration
                              time: ms(time),
                              // The giveaway prize
                              prize: prize,
                              // The giveaway winner count
                              winnerCount: parseInt(winners),
                              // Who hosts this giveaway
                              hostedBy: message.author,
                              // Messages
                              messages: {
                                giveaway: "🎉🎉 **GIVEAWAY** 🎉🎉",
                                giveawayEnded: "🎉🎉 **GIVEAWAY ENDED** 🎉🎉",
                                timeRemaining: "Remaining time: **{duration}**!",
                                inviteToParticipate: "react with 🎉 to join!",
                                winMessage: "Congratulation, {winners}! You have won **{prize}** !",
                                embedFooter: "Giveaway!",
                                embedColor: `YELLOW`,
                                noWinner: "Giveaway cancelled, not enough participants.",
                                winners: "Winner(s)",
                                endedAt: "Ended at",
                                units: {
                                    seconds: "seconds",
                                    minutes: "minutes",
                                    hours: "hours",
                                    days: "days",
                                    pluralS: false // Not needed, because units end with a S so it will automatically removed if the unit value is lower than 2
                                }
                            }
                          });
                          
                          
                          
                        } else {
                          bot.error(`I could not find that channel in the guild!`, message.channel)
                        }
                      } catch (e) {
                        return bot.error(`error`, message.channel)
                      }
                      
                
                    } else {
                      return bot.error(`You did not answer!`, message.channel)
                    }
                  } catch (e) {
                    return bot.error(`You did not answer!`, message.channel)
                  }
                  
                  
                  
                } else {
                  bot.error(`I could not find that channel in the guild!`, message.channel)
                }
              } catch (e) {
                return bot.error(`You did not answer!`, message.channel)
              }
              

            } else {
              bot.error(`You did not specify the time!`, message.channel)
            }
          } catch (e) {
            return bot.error(`You did not answer!`, message.channel)
          }
      
    
    }
    
  },
};
