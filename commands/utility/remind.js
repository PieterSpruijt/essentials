const Discord = require("discord.js");
const model = require("../../models/reminder");
const ms = require("ms");
const moment = require('moment');

module.exports = {
  name: "remind",
  description: "Set a reminder!",
  category: "moderation",
  aliases: ["setreminder", "reminders", "addreminder"],
  usage: "remind [message] [time] <channelid/channel/dm>",
  run: async (bot, message, args, userinfo) => {
    let embed = new Discord.MessageEmbed()
      .setColor(userinfo.color)
      .setTitle(`Create reminder`)
      .setDescription(`Progress:`)
      .addFields(
        { name: `Time:`, value: `${bot.info.emojis.animated.loading} | Loading` },
        { name: `Channel:`, value: `${bot.info.emojis.animated.loading} | Loading` },
        { name: `Message:`, value: `${bot.info.emojis.animated.loading} | Loading` },
      );
    const errorembed = new Discord.MessageEmbed()
      .setColor(userinfo.color)
      .setDescription(`Something went wrong!`);
    const embedmessage = await message.channel.send(embed);
    const m = await message.channel.send(`For how long is the reminder?`);
    try {
      let e = await message.channel.awaitMessages(
        (u2) => u2.author.id === message.author.id,
        { time: 30000, max: 1, errors: ["time"] }
      );
      if (ms(e.first().content)) {
        const endtime = new Date().getTime() + ms(e.first().content);
        let embed = new Discord.MessageEmbed()
          .setColor(userinfo.color)
          .setTitle(`Create reminder`)
          .setDescription(`Progress:`)
          .addFields(
            { name: `Time:`, value: `${bot.info.emojis.normal.check} | ${new Date(endtime).toLocaleTimeString()}` },
            { name: `Channel:`, value: `${bot.info.emojis.animated.loading} | Loading` },
            { name: `Message:`, value: `${bot.info.emojis.animated.loading} | Loading` },
          );
        e.first().delete().catch(e => { });
        embedmessage.edit(embed);
        m.edit(`To which channels must the reminder be send? (mention/id/dm/this)`);
        try {
          let e = await message.channel.awaitMessages(
            (u2) => u2.author.id === message.author.id,
            { time: 30000, max: 1, errors: ["time"] }
          );
          var channel;
          if (e.first().content.toLowerCase() === `dm`) {
            channel = `dm`;

          } else if (e.first().content.toLowerCase() === `this`) {
            channel = message.channel.id;

          } else if (message.guild.channels.cache.get(e.first().content)) {
            channel = e.first().content;


          } else if (e.first().mentions.channels.first()) {
            channel = e.first().mentions.channels.first().id;
            if (!channel.permissionsFor(message.author.id).has(`SEND_MESSAGES`, false)) {
              e.first().delete().catch(e => { });
              embedmessage.edit(errorembed);
              return m.edit(`You don't have access to chat is that channel!`);
            }

          } else {
            e.first().delete().catch(e => { });
            embedmessage.edit(errorembed);
            return m.edit(`I can't find that channel!`);
          }
          e.first().delete().catch(e => { });
          let mention;
          if (channel === `dm`) {
            mention = `dm`
          } else {
            mention = `<#${channel}>`
          }
          let embed = new Discord.MessageEmbed()
            .setColor(userinfo.color)
            .setTitle(`Create reminder`)
            .setDescription(`Progress:`)
            .addFields(
              { name: `Time:`, value: `${bot.info.emojis.normal.check} | ${new Date(endtime).toLocaleTimeString()}` },
              { name: `Channel:`, value: `${bot.info.emojis.normal.check} | ${mention}` },
              { name: `Message:`, value: `${bot.info.emojis.animated.loading} | Loading` },
            );
          embedmessage.edit(embed);
          m.edit(`What is the message to remind?`);
          try {
            let e = await message.channel.awaitMessages(
              (u2) => u2.author.id === message.author.id,
              { time: 30000, max: 1, errors: ["time"] }
            );
            if (e.first().content) {
              const text = e.first().content;
              e.first().delete().catch(e => { });

              let ifalreadyexist = await model.findOne({ text: text, userid: message.author.id, channel: channel, endtime: endtime });
              if (ifalreadyexist) return bot.error(`You already made this reminder!`);
              let newData = new model({
                userid: message.author.id,
                text: text,
                channel: channel,
                endtime: endtime
              });
              newData.save();
              let embed = new Discord.MessageEmbed()
                .setColor(userinfo.color)
                .setTitle(`Created reminder`)
                .setDescription(`__________`)
                .addFields(
                  { name: `Time:`, value: `${bot.info.emojis.normal.check} | ${new Date(endtime).toLocaleTimeString()}` },
                  { name: `Channel:`, value: `${bot.info.emojis.normal.check} | ${mention}` },
                  { name: `Message:`, value: `${bot.info.emojis.normal.check} | ${text}` },
                );
              embedmessage.edit(embed);
              m.delete();
              e.first().delete().catch(e => { });

              setTimeout(async () => {
                let channel2;
                if (channel === `dm`) {
                  channel2 = message.author;
                } else {
                  channel2 = message.guild.channels.cache.get(channel);
                }
                let embed = new Discord.MessageEmbed()
                  .setTitle(`Reminder 🔔`)
                  .addFields(
                    { name: `Message:`, value: text }
                  )
                  .setColor(userinfo.color);
                channel2.send(`<@${message.author.id}>`, embed).catch(e => {});
                let deleted = await model.findOneAndDelete({ text: text, userid: message.author.id, channel: channel, endtime: endtime });
              }, endtime - new Date().getTime());



            } else {
              e.first().delete().catch(e => { });
              embedmessage.edit(errorembed);
              return m.edit(`You did not specify a correct message!`);
            }

          } catch (e) {
            embedmessage.edit(errorembed);
            return m.edit(`You did not answer!`);
          }

        } catch (e) {
          embedmessage.edit(errorembed);
          return m.edit(`You did not answer!`);
        }

      } else {
        e.first().delete().catch(e => { });
        embedmessage.edit(errorembed);
        return m.edit(`You did not specify your time correct!`);
      }

    } catch (e) {
      embedmessage.edit(errorembed);
      return m.edit(`You did not answer!`);
    }

  },
};
