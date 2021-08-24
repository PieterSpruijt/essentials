const { MessageEmbed } = require("discord.js");
const model = require("../../models/invites");

module.exports = {
  name: "invites",
  description: "Get invites",
  private: true,
  commandOptions: [
    {
      "name": "add",
      "description": "Add invites",
      "type": 1,
      options: [
        {
          type: 6,
          name: 'user',
          description: `User`,
          required: true
        },
        {
          type: 3,
          name: "type",
          description: "Total, invites, left",
          required: true,
          choices: [
            {
              name: "total",
              value: "total"
            },
            {
              name: "invites",
              value: "invites"
            },
            {
              name: "left",
              value: "left"
            }
          ]
        },
        {
          type: 10,
          name: "amount",
          description: "Amount of invites ",
          required: true
        }
      ]
    },
    {
      "name": "remove",
      "description": "Remove invites of an user",
      "type": 1,
      options: [
        {
          type: 6,
          name: 'user',
          description: `User`,
          required: true
        },
        {
          type: 3,
          name: "type",
          description: "Total, invites, left",
          required: true,
          choices: [
            {
              name: "total",
              value: "total"
            },
            {
              name: "invites",
              value: "invites"
            },
            {
              name: "left",
              value: "left"
            }
          ]
        },
        {
          type: 10,
          name: "amount",
          description: "Amount of invites ",
          required: true
        }
      ]
    },
    {
      "name": "clear",
      "description": "Wipe someones invites",
      "type": 1,
      options: [
        {
          type: 6,
          name: 'user',
          description: `User`,
          required: true
        }
      ]

    },
    {
      "name": "user",
      "description": "Check someones invites",
      "type": 1,
      options: [
        {
          type: 6,
          name: 'user',
          description: `User`,
          required: false
        }
      ]

    }

  ],
  run: async (bot, interaction, userinfo) => {
    const choise = interaction.options._subcommand;
    if (choise === `user`) {
      let user = interaction.data.options[0] ? interaction.data.options[0].member : interaction.member;
      var invites = await model.findOne({ gid: interaction.guild.id, userid: user.user.id });
      if (invites) {
        var _ = new MessageEmbed()
          .setTitle(`📨 Invites`)
          .setColor(userinfo.color)
          .setDescription(`**${user.user.tag}** has ${invites.invites} invites (\`${invites.total}\` total, \`${invites.left}\` left)!`);
      }
      if (!invites) {
        _ = new MessageEmbed()
          .setTitle(`📨 Invites`)
          .setColor(userinfo.color)
          .setDescription(`**${user.user.tag}** has 0 invites (\`0\` total, \`0\` left)!`);
      }
      await interaction.editReply({ embeds: [_] });
    } else if (choise === `add`) {
      if (!interaction.member.permissions.has(bot.perms.ADMINISTRATOR)) return bot.error(`You Dont have Permission to do that! You must be Administrator!`, bot, interaction);
      if (!userinfo.developer) return bot.error(`You Dont have Permission to do that!`, bot, interaction);
      let user = interaction.data.options[0].member;
      let amount = parseInt(interaction.data.options[2].value);
      let args = [``, interaction.data.options[1].value]
      let userData = await model.findOne({ gid: interaction.guild.id, userid: user.user.id });
      if (!userData) {
        const newData = new model({
          gid: interaction.guild.id,
          userid: user.user.id,
          invites: 0,
          left: 0,
          total: 0,
          inviter: false
        });
        newData.save();
        userData = await model.findOne({ gid: interaction.guild.id, userid: user.user.id });
      }

      if (args[1] === `total`) {
        model.findOne(
          { gid: interaction.guild.id, userid: user.user.id },
          async (err, data) => {
            if (err) throw err;
            data.total = data.total + amount;
            data.save();
          }
        );

      } else if (args[1] === `left`) {
        model.findOne(
          { gid: interaction.guild.id, userid: user.user.id },
          async (err, data) => {
            if (err) throw err;
            data.left = data.left + amount;
            data.save();
          }
        );

      } else if (args[1] === `invites`) {
        model.findOne(
          { gid: interaction.guild.id, userid: user.user.id },
          async (err, data) => {
            if (err) throw err;
            data.invites = data.invites + amount;
            data.save();
          }
        );

      } else {
        return bot.error(`You did not specify a correct category: [total/invites/left]`, bot, interaction);
      }
      await interaction.editReply({ content: `Added ${amount} ${args[1]}` });
    } else if (choise === `remove`) {
      if (!interaction.member.permissions.has(bot.perms.ADMINISTRATOR)) return bot.error(`You Dont have Permission to do that! You must be Administrator!`, bot, interaction);
      let user = interaction.data.options[0].member;
      let amount = parseInt(interaction.data.options[2].value);
      let args = [``, interaction.data.options[1].value]
      let userData = await model.findOne({ gid: interaction.guild.id, userid: user.user.id });
      if (!userData) {
        return bot.error(`This user has no invites to remove!`, bot, interaction);
      }
      if (args[1] === `total`) {
        model.findOne(
          { gid: interaction.guild.id, userid: user.user.id },
          async (err, data) => {
            if (err) throw err;
            data.total = data.total - amount;
            data.save();
          }
        );

      } else if (args[1] === `left`) {
        model.findOne(
          { gid: interaction.guild.id, userid: user.user.id },
          async (err, data) => {
            if (err) throw err;
            data.left = data.left - amount;
            data.save();
          }
        );

      } else if (args[1] === `invites`) {
        model.findOne(
          { gid: interaction.guild.id, userid: user.user.id },
          async (err, data) => {
            if (err) throw err;
            data.invites = data.invites - amount;
            data.save();
          }
        );

      } else {
        return bot.error(`You did not specify a correct category: [total/invites/left]`, bot, interaction);
      }
      await interaction.editReply({ content: `Removed ${amount} ${args[1]}` });
    } else if (choise === `clear`) {
      if (!interaction.member.permissions.has(bot.perms.ADMINISTRATOR)) return bot.error(`You Dont have Permission to do that! You must be Administrator!`, bot, interaction);
      let user = interaction.data.options[0].member;
      let userData = await model.findOne({ gid: interaction.guild.id, userid: user.user.id });
      if (!userData) {
        return bot.error(`This user has no invites to remove!`, bot, interaction);
      } else {
        await model.deleteMany({ gid: interaction.guild.id, userid: user.user.id });
        await interaction.editReply({ content: `**${user.user.tag}**'s invites are wiped` });
      }
    }

  },
};

