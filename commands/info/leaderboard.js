const Discord = require('discord.js');
const money = require('../../models/economy');
const xpdb = require("../../models/xpdb");

const flags = {
  1: `:first_place:`,
  2: `:second_place:`,
  3: `:third_place:`,
  4: `:four:`,
  5: `:five:`,
  6: `:six:`,
  7: `:seven:`,
  8: `:eight:`,
  9: `:nine:`,
  10: `:keycap_ten:`
}

module.exports = {
  name: "leaderboard",
  description: "View guild leaderboard",
  private: false,
  commandOptions: [
    {
      type: 3,
      name: `leaderboard`,
      description: `The Leaderboard to see`,
      required: true,
      choices: [
        {
          "name": "Levels",
          "value": "levels"
        },
        {
          "name": "Invites",
          "value": "invites"
        },
        {
          "name": "Bank",
          "value": "bank"
        },
        {
          "name": "Hand",
          "value": "hand"
        }
      ]
    }
  ],
  run: async (bot, interaction, userinfo) => {
    const GuildSettings = require("../../models/settings");
    var storedSettings = await GuildSettings.findOne({ gid: interaction.guild.id });
    if (!storedSettings) storedSettings = { economy: false, levels: true };
    const lb = interaction.data.options[0].value;
    if (lb === `leveling`) {
      if (!storedSettings.economy) return bot.error(`Economy is disabled in this guild`, bot, interaction);
      const pattern = `${interaction.guild.id}`
      let db = await xpdb.find({ id: { $regex: pattern, $options: `x` } }).sort({ level: -1 });
      let content = "";
      let a = 0;
      for (let i = 0; i < db.length; i++) {
        if (i <= 9) {
          let user = `<@${db[i].id.slice(19)}>`;

          if (db[i].level != 0) {
            content += `${flags[i + 1 - a]} **${user}** - Level ${db[i].level}\n`
          } else {
            a++;
          }
        }

      }
      if (content.length === 0) {
        content = `No users!`
      }
      const embed = new Discord.MessageEmbed()
        .setDescription(`**${interaction.guild.name}'s** leveling Leaderboard\n\n${content}`)
        .setColor(userinfo.color)
        .setFooter(bot.info.embed.footer_name)
      await interaction.editReply({ embeds: [embed] });

    } else if (lb === `invites`) {
      await interaction.editReply(`I don't have invites, only https://dsc.gg/essentialscanary`);

    } else if (lb === `bank`) {
      if (!storedSettings.economy) return bot.error(`Economy is disabled in this guild!`, bot, interaction);
      var bank = await money.find({ gid: interaction.guild.id }).sort({ bank: -1 });
      let content = "";
      let b = 0;
      for (let i = 0; i < bank.length; i++) {
        let user = bot.users.cache.get(bank[i].userid).tag
        if (i.length === 10) return;



        if (bank[i].bank != 0) {
          content += `${flags[i + 1 - b]} **${user}** - 🍣 ${bank[i].bank}\n`
        } else {
          b++;
        }

      }
      if (content.length === 0) {
        content = `No users!`
      }
      const bankembed = new Discord.MessageEmbed()
        .setDescription(`**${interaction.guild.name}'s** bank Leaderboard\n\n${content}`)
        .setColor(userinfo.color)
        .setFooter(bot.info.embed.footer_name)
        await interaction.editReply({embeds: [bankembed]});

    } else if (lb === `hand`) {
      if (!storedSettings.economy) return bot.error(`Economy is disabled in this guild!`, bot, interaction);
      var hand = await money.find({ gid: interaction.guild.id }).sort({ hand: -1 });
      let content = "";
      let a = 0;
      for (let i = 0; i < hand.length; i++) {
        let user = bot.users.cache.get(hand[i].userid).tag
        if (i.length === 10) return;

        if (hand[i].hand != 0) {
          content += `${flags[i + 1 - a]} **${user}** - 🍣 ${hand[i].hand}\n`
        } else {
          a++;
        }


      }
      if (content.length === 0) {
        content = `No users!`
      }
      const handembed = new Discord.MessageEmbed()
        .setDescription(`**${interaction.guild.name}'s** hand Leaderboard\n\n${content}`)
        .setColor(userinfo.color)
        .setFooter(bot.info.embed.footer_name)
      await interaction.editReply({ embeds: [handembed] });

    }
  },
};
