const model = require("../../models/invitemessages");
const Discord = require("discord.js");
const defaultmessage = `**{user.tag}** joined the server, invited by **{inviter.tag}** ({inviter.invites} invites)`;

module.exports = {
  name: "joinmessage",
  description: "Set join messages!",
  private: true,
  commandOptions: [
    {
      type: 1,
      name: `edit`,
      description: `Edit the joinmessage!`,
      options: [
        {
          type: 3,
          name: `message`,
          description: `The joinmessage`,
          required: false
        }
      ]
    },
    {
      type: 1,
      name: `embed`,
      description: `Enable/disable joinmessage is an embed!`,
      options: [
        {
          type: 5,
          name: `value`,
          description: `true or false`,
          required: true
        }
      ]
    },
    {
      type: 1,
      name: `channel`,
      description: `Set a channel to send the joinmessage to`,
      options: [
        {
          type: 7,
          name: `channel`,
          description: `The channel`,
          required: true
        }
      ]
    },
    {
      type: 1,
      name: `test`,
      description: `Test the joinmessage`
    },
    {
      type: 1,
      name: `delete`,
      description: `Delete the joinmessage`
    },
    {
      type: 1,
      name: `help`,
      description: `See examples and info`
    },
  ],
  run: async (bot, interaction, userinfo) => {
    if (!interaction.member.permissions.has(bot.perms.ADMINISTRATOR)) return bot.error(`You Dont have Permission to do that! You must be Administrator!`, bot, interaction);
    const command = interaction.options._subcommand;
    if (command === `help`) {
      await interaction.editReply("**Options:**\n> `{user.tag}`, `{user.discriminator}`, `{user.invites}`, `{user.username}`, `{inviter.tag}`, `{inviter.username}`, `{inviter.invites}`, `{inviter.discriminator}`\n\nDefault: `" + defaultmessage + "`")
    } else if (command === `edit`) {
      let text = interaction.data.options[0].value;
      let joinmessage = await model.findOne({ gid: interaction.guild.id });
      if (!joinmessage) {
        return bot.error(`You haven't set a channel!`, bot, interaction);
      } else {
        model.findOne(
          { gid: interaction.guild.id },
          async (err, data) => {
            if (err) throw err;
            data.Message = text;
            data.save();
          }
        );
      }
      let embed = new Discord.MessageEmbed()
        .setColor(userinfo.color)
        .setTitle(`Joinmessage set!`)
        .addField(`Message:`, text)
        .setDescription(`A new join message is set, this will be send to <#${joinmessage.Channel}>`);
      await interaction.editReply({ embeds: [embed] });

    } else if (command === `embed`) {
      let joinmessage = await model.findOne({ gid: interaction.guild.id });
      if (!joinmessage) {
        return bot.error(`You haven't set a channel!`, bot, interaction);
      }
      if (joinmessage.embed) {
        model.findOne(
          { gid: interaction.guild.id },
          async (err, data) => {
            if (err) throw err;
            data.embed = false
            data.save();
          }
        );
        await interaction.editReply({ embeds: [{ color: userinfo.color, description: `Set embed to false!` }] });
      } else {
        model.findOne(
          { gid: interaction.guild.id },
          async (err, data) => {
            if (err) throw err;
            data.embed = true
            data.save();
          }
        );
        await interaction.editReply({ embeds: [{ color: userinfo.color, description: `Set embed to true!` }] });
      }

    } else if (command === `channel`) {
      let channel = interaction.data.options[0].channel;
      if (!channel) return bot.error(`I can't find that channel!`, bot, interaction);
      let joinmessage = await model.findOne({ gid: interaction.guild.id });
      if (!joinmessage) {
        const newData = new model({
          gid: interaction.guild.id,
          Message: defaultmessage,
          Channel: channel.id
        });
        newData.save();
      } else {
        model.findOne(
          { gid: interaction.guild.id },
          async (err, data) => {
            if (err) throw err;
            data.Channel = channel.id
            data.save();
          }
        );
      }
      let embed = new Discord.MessageEmbed()
        .setColor(userinfo.color)
        .setDescription(`<#${channel.id}> is now the new joinmessage channel!`);
      await interaction.editReply({ embeds: [embed] });

    } else if (command === `test`) {
      let joinmessage = await model.findOne({ gid: interaction.guild.id });
      let message1 = joinmessage.Message;
      message1 = message1.replace(`{user.tag}`, interaction.user.tag)
      message1 = message1.replace(`{user.invites}`, 5)
      message1 = message1.replace(`{user.username}`, interaction.user.username)
      message1 = message1.replace(`{user.discriminator}`, interaction.user.discriminator)
      message1 = message1.replace(`{inviter.tag}`, `PieterSpruijt#5136`)
      message1 = message1.replace(`{inviter.username}`, `PieterSpruijt`)
      message1 = message1.replace(`{inviter.invites}`, 6)
      message1 = message1.replace(`{inviter.discriminator}`, `5`)
      if (joinmessage.embed) {
        let embed = new Discord.MessageEmbed()
          .setColor(`#e91e63`)
          .setDescription(message1)
        interaction.guild.channels.cache.get(joinmessage.Channel).send({ embeds: [embed] }).catch(() => { return bot.error(`Something went wrong with testing!`, bot, interaction) }).then(async () => {
          await interaction.editReply(`Tested in <#${joinmessage.Channel}>!`);
        })
      } else {
        interaction.guild.channels.cache.get(joinmessage.Channel).send(message1).catch(() => { return bot.error(`Something went wrong with testing!`, bot, interaction) }).then(async () => {
          await interaction.editReply(`Tested in <#${joinmessage.Channel}>!`);
        })
      }

    } else if (command === `delete`) {
      let joinmessage = await model.findOne({ gid: interaction.guild.id });
      if (!joinmessage) return bot.error(`Nothing to disable`, bot, interaction);
      await model.deleteMany({ gid: interaction.guild.id });
      await interaction.editReply({ embeds: [{ color: userinfo.color, description: `Disabled join messages!` }] });

    } else {
      await bot.error(`This is not an option!`, bot, interaction);
    }
  },
};