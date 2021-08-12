const Discord = require("discord.js");
const model = require("../../models/reminder");
const ms = require("ms");

module.exports = {
  name: "remind",
  description: "Set a reminder!",
  commandOptions: [
    {
      type: 3,
      name: `time`,
      description: `The time for the reminder, 1d, 2h,1m, 5s`,
      required: true
    },
    {
      type: 3,
      name: `message`,
      description: `The message of the reminder`,
      required: true
    },
    {
      type: 7,
      name: `channel`,
      description: `Channel to send the reminder in, empty for dm`,
      required: false
    }
  ],
  run: async (bot, interaction, userinfo) => {
    const endtime = new Date().getTime() + ms(interaction.data.options[0]);
    if (!endtime) return bot.error(`You did not enter a valid time`, bot, interaction);
    const message = interaction.data.options[1].value;
    const channel = interaction.data.options[2] ? interaction.data.options[2].channel.id : `dm`;
    if (!channel) return bot.error(`You did not enter a valid channel`, bot, interaction);
    if (channel != `dm`) {
      if (!channel.permissionsFor(interaction.user.id).has(bot.perms.SEND_MESSAGES)) return bot.error(`You can't send messages in this channel!`, bot, interaction);
    }
    let ifalreadyexist = await model.findOne({ text: message, userid: interaction.author.id, channel: channel, endtime: endtime });
    if (ifalreadyexist) return bot.error(`You already made this reminder!`, bot, interaction);
    let newData = new model({
      userid: interaction.user.id,
      text: message,
      channel: channel,
      endtime: endtime
    });
    newData.save();
    let embed = new Discord.MessageEmbed()
      .setColor(userinfo.color)
      .setTitle(`Created reminder`)
      .setDescription(`__________`)
      .addFields(
        { name: `Time:`, value: `${new Date(endtime).toUTCString()}` },
        { name: `Channel:`, value: `${channel === `dm` ? `<#${channel}>` : `dm`}` },
        { name: `Message:`, value: `${message}` },
      );
    setTimeout(async () => {
      let channel2;
      if (channel === `dm`) {
        channel2 = interaction.user;
      } else {
        channel2 = message.guild.channels.cache.get(channel);
      }
      let embed = new Discord.MessageEmbed()
        .setTitle(`Reminder 🔔`)
        .addFields(
          { name: `Message:`, value: message }
        )
        .setColor(userinfo.color);
      channel2.send(`<@${message.author.id}>`, embed).catch(() => { });
      await model.findOneAndDelete({ text: message, userid: interaction.user.id, channel: channel, endtime: endtime });
    }, endtime - new Date().getTime());
    await interaction.editReply({ embed: [embed] });
  },
};
