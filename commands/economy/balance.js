const Discord = require('discord.js');
const money = require('../../models/economy');

module.exports = {
  name: `balance`,
  description: `Get a users balance, add or remove money!`,
  private: false,
  commandOptions: [
    {
      type: 1,
      name: "user",
      description: "View a users balance",
      options: [
        {
          type: 6,
          name: `user`,
          description: `The User`,
          required: true,

        }
      ]
    },
    {
      "name": "add",
      "description": "Give someone money!",
      "type": 1,
      options: [
        {
          type: 6,
          name: `user`,
          description: `The User`,
          required: true,
        },
        {
          type: 10,
          name: `amount`,
          description: `Amount of coins`,
          required: true,
        }
      ]
    },
    {
      "name": "remove",
      "description": "Remove someones money!",
      "type": 1,
      options: [
        {
          type: 6,
          name: `user`,
          description: `The User`,
          required: true,
        },
        {
          type: 10,
          name: `amount`,
          description: `Amount of coins`,
          required: true,
        }
      ]
    },
    {
      "name": "clear",
      "description": "Wipe someones money!",
      "type": 1,
      options: [
        {
          type: 6,
          name: `user`,
          description: `The User`,
          required: true,
        }
      ]
    },
    {
      "name": "withdraw",
      "description": "Withdraw money from the bank!",
      "type": 1,
      options: [
        {
          type: 10,
          name: `amount`,
          description: `Amount of coints to withdraw`,
          required: true
        }
      ]
    },
    {
      "name": "deposit",
      "description": "Deposit money to the bank!",
      "type": 1,
      options: [
        {
          type: 10,
          name: `amount`,
          description: `Amount of coints to deposit`,
          required: true
        }
      ]
    },
    {
      "name": "pay",
      "description": "Pay an user money!",
      "type": 1,
      options: [
        {
          type: 6,
          name: `user`,
          description: `The User to pay`,
          required: true,
        }
      ]
    },
  ],
  run: async (bot, interaction, userinfo) => {
    let command = interaction.options._subcommand ? interaction.options._subcommand : false;
    if (command === `add`) {
      const GuildSettings = require("../../models/settings");
      var storedSettings = await GuildSettings.findOne({ gid: interaction.guild.id });
      if (!storedSettings.economy) return bot.error(`Economy is disabled in this guild!`, bot, interaction);
      if (!interaction.member.permissions.has(bot.perms.ADMINISTRATOR)) return bot.error(`You doný have Admin perms!`, bot, interaction);

      let User = interaction.data.options[0].user;
      if (!User) return bot.error(`You did not specify an user to send 🍣 to!`, bot, interaction);
      if (User.bot) return bot.error(`You can't give bots 🍣!`, bot, interaction);
      if (!(interaction.data.options[1].value > 0)) return bot.error(`You did not specify a correct amount of 🍣!`, bot, interaction);
      var userData = await money.findOne({ gid: interaction.guild.id, userid: User.id });
      if (!userData) {
        const newSettings = new money({
          gid: interaction.guild.id,
          userid: User.id,
          bank: 0,
          hand: interaction.data.options[1].value
        });
        await newSettings.save().catch(() => { });
        await interaction.editReply(`Added **${interaction.data.options[1].value}** 🍣 to **${User.tag}**'s balance`);
      } else {
        money.findOne(
          { gid: interaction.guild.id, userid: User.id },
          async (err, data) => {
            if (err) throw err;
            data.hand = data.hand + interaction.data.options[1].value;
            data.save();
          }
        );
        await interaction.editReply(`Added **${interaction.data.options[1].value}** 🍣 to **${User.tag}**'s balance`);
      }
    } else if (command === `clear`) {
      const GuildSettings = require("../../models/settings");
      var storedSettings = await GuildSettings.findOne({ gid: interaction.guild.id });
      if (!storedSettings.economy) return bot.error(`Economy is disabled in this guild!`, bot, interaction);
      if (!interaction.member.permissions.has(bot.perms.ADMINISTRATOR)) return bot.error(`You doný have Admin perms!`, bot, interaction);
      let User = interaction.data.options[0].user;
      if (User.bot) return bot.error(`Bots can't have  🍣!`, bot, interaction);
      var userData = await money.findOne({ gid: interaction.guild.id, userid: User.id });
      if (!userData) {
        bot.error(`This user has no balance to clear!`, bot, interaction);
      } else {
        var deleted = await money.deleteOne({ gid: interaction.guild.id, userid: User.id });
        await interaction.editReply(`Wiped **${User.tag}**'s balance`);
      }

    } else if (command == `remove`) {
      const GuildSettings = require("../../models/settings");
      var storedSettings = await GuildSettings.findOne({ gid: interaction.guild.id });
      if (!storedSettings.economy) return bot.error(`Economy is disabled in this guild!`, bot, interaction);
      if (!interaction.member.permissions.has(bot.perms.ADMINISTRATOR)) return bot.error(`You doný have Admin perms!`, bot, interaction);

      let User = interaction.data.options[0].user;
      if (User.bot) return bot.error(`Bots can't have  🍣!`, bot, interaction);
      if (!(interaction.data.options[1].value > 0)) return bot.error(`You did not specify a correct amount of 🍣!`, bot, interaction);
      var userData = await money.findOne({ gid: interaction.guild.id, userid: User.id });
      if (!userData) {
        bot.error(`This user has no balance!`, bot, interaction);
      } else {
        money.findOne(
          { gid: interaction.guild.id, userid: User.id },
          async (err, data) => {
            if (err) throw err;
            data.hand = data.hand - interaction.data.options[1].value
            data.save();
          }
        );
        await interaction.editReply(`Removed **${interaction.data.options[1].value}** 🍣 of **${User.tag}**'s balance`);
      }
    } else if (command === `withdraw`) {
      const GuildSettings = require("../../models/settings");
      var storedSettings = await GuildSettings.findOne({ gid: interaction.guild.id });
      if (!storedSettings.economy) return bot.error(`Economy is disabled in this guild!`, bot, interaction);
      var userData = await money.findOne({ gid: interaction.guild.id, userid: interaction.member.user.id });
      if (!userData || userData.bank === 0) return bot.error(`You don't have any 🍣 to withdraw`, bot, interaction);
      if (parseInt(interaction.data.options[0].value) === userData.bank) {
        money.findOne(
          { gid: interaction.guild.id, userid: interaction.member.user.id },
          async (err, data) => {
            if (err) throw err;
            data.hand = data.hand + userData.bank,
              data.bank = 0;
            data.save();
          }
        );
        return await interaction.editReply(`You withdrawed 🍣 **${userData.bank}**!`);
      }
      if (!(interaction.data.options[0].value > 0)) return bot.error(`You did not specify a correct amount of 🍣!`, bot, interaction);
      if (userData.bank <= parseInt(interaction.data.options[0].value)) return bot.error(`You don't have so many 🍣 on the bank!`, bot, interaction);
      money.findOne(
        { gid: interaction.guild.id, userid: interaction.member.user.id },
        async (err, data) => {
          if (err) throw err;
          data.hand = data.hand + interaction.data.options[0].value;
          data.bank = data.bank - interaction.data.options[0].value;
          data.save();
        }
      );
      await interaction.editReply(`You withdrawed 🍣 **${interaction.data.options[0].value}**!`);

    } else if (command === `deposit`) {
      const GuildSettings = require("../../models/settings");
      var storedSettings = await GuildSettings.findOne({ gid: interaction.guild.id });
      if (!storedSettings.economy) return bot.error(`Economy is disabled in this guild!`, bot, interaction);
      var userData = await money.findOne({ gid: interaction.guild.id, userid: interaction.member.user.id });
      if (!userData || userData.hand === 0) return bot.error(`You don't have any 🍣 to deposit`, message.channel);
      if (interaction.data.options[0].value === userData.hand) {
        money.findOne(
          { gid: interaction.guild.id, userid: interaction.member.user.id },
          async (err, data) => {
            if (err) throw err;
            data.hand = 0,
              data.bank = data.bank + userData.hand;
            data.save();
          }
        );
        return await interaction.editReply(`You deposit 🍣 **${userData.hand}** on the bank!`);
      }
      if (!(interaction.data.options[0].value > 0)) return bot.error(`You did not specify a correct amount of 🍣!`, bot, interaction);
      if (userData.hand <= interaction.data.options[0].value) return bot.error(`You don't have so many 🍣 in your hand!`, bot, interaction);
      money.findOne(
        { gid: interaction.guild.id, userid: interaction.member.user.id },
        async (err, data) => {
          if (err) throw err;
          data.hand = data.hand - interaction.data.options[0].value;
          data.bank = data.bank + interaction.data.options[0].value;
          data.save();
        }
      );
      return await interaction.editReply(`You deposit 🍣 **${interaction.data.options[0].value}** on the bank!`);

    } else if (command === `pay`) {
      const GuildSettings = require("../../models/settings");
      var storedSettings = await GuildSettings.findOne({ gid: interaction.guild.id });
      if (!storedSettings.economy) return bot.error(`Economy is disabled in this guild!`, bot, interaction);
      let User = interaction.data.options[0].user;
      if (User === interaction.member.user) return bot.error(`You can't give yourself 🍣!`, bot, interaction)
      if (User.bot) return bot.error(`You can't give bots 🍣!`, bot, interaction);
      if (!(interaction.data.options[1].value > 0)) return bot.error(`You did not specify a correct amount of 🍣!`, bot, interaction);
      var userData = await money.findOne({ gid: interaction.guild.id, userid: interaction.member.user.id });
      if (!userData) return bot.error(`You don't have any 🍣!`, bot, interaction);
      if (userData.hand <= interaction.data.options[1].value) return bot.error(`You don't have enough 🍣 in your hand!`, bot, interaction);
      var user2Data = await money.findOne({ gid: interaction.guild.id, userid: User.id });
      if (!user2Data) {
        const newSettings = new money({
          gid: interaction.guild.id,
          userid: User.id,
          bank: 0,
          hand: interaction.data.options[1].value
        });
        await newSettings.save().catch(() => { });
        money.findOne(
          { gid: interaction.guild.id, userid: interaction.member.user.id },
          async (err, data) => {
            if (err) throw err;
            data.hand = data.hand - interaction.data.options[1].value;
            data.save();
          }
        );
        await interaction.editReply(`You successfully paid **${User.tag}** 🍣 **${interaction.data.options[1].value}**!`);

      } else {
        money.findOne(
          { gid: interaction.guild.id, userid: User.id },
          async (err, data) => {
            if (err) throw err;
            data.hand = data.hand + interaction.data.options[1].value;
            data.save();
          }
        );
        money.findOne(
          { gid: interaction.guild.id, userid: interaction.member.user.id },
          async (err, data) => {
            if (err) throw err;
            data.hand = data.hand - interaction.data.options[1].value;
            data.save();
          }
        );
        interaction.editReply(`You successfully paid **${User.tag}** 🍣 **${interaction.data.options[1].value}**!`);

      }
    } else {
      const GuildSettings = require("../../models/settings");
      var storedSettings = await GuildSettings.findOne({ gid: interaction.guild.id });
      if (!storedSettings.economy) return bot.error(`Economy is disabled in this guild!`, bot, interaction);
      let User = interaction.data.options[0] ? interaction.data.options[0].user : interaction.member.user;
      var userData = await money.findOne({ gid: interaction.guild.id, userid: User.id });
      if (!userData) {
        return bot.error(`This user has no 🍣!`, bot, interaction)
      }
      let embed = new Discord.MessageEmbed()
        .setColor(userinfo.color)
        .setTitle(`${User.tag}'s balance`)
        .addFields(
          { name: `Hand`, value: `🍣 ` + userData.hand },
          { name: `Bank`, value: `:bank: ` + userData.bank }
        );
      await interaction.editReply({ embeds: [embed] });
    }





  },
};
