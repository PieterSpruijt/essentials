const model = global.models.joinrole;
const Discord = require("discord.js");

module.exports = {
  name: "joinroles",
  description: "get all join roles!",
  private: true,
  commandOptions: [
    {
      "name": "list",
      "description": "Get a list of all joinroles!",
      "type": 1,
    },
    {
      "name": "add",
      "description": "Add a joinrole!",
      "type": 1,
      options: [
        {
          type: 8,
          name: `role`,
          description: `Role to give at joining`,
          required: true
        }
      ]
    },
    {
      "name": "del",
      "description": "Delete a join role!",
      "type": 1,
      options: [
        {
          type: 8,
          name: `role`,
          description: `Role to not longer give at joining`,
          required: true
        }
      ]
    },
  ],
  run: async (bot, interaction, userinfo) => {
    if (!interaction.member.permissions.has(bot.perms.ADMINISTRATOR)) return bot.error(`You Dont have Permission to do that! You must be Administrator!`, bot, interaction);
    let command = interaction.options._subcommand;
    if (command === `list`) {
      var joinroles = await model.find({ gid: interaction.guild.id });
      let List = joinroles.map(data => `\nRole <@&${data.Role}>`).join('\n');
      if (!joinroles.length) {
        List = `No join roles set!`
      }
      await interaction.editReply({ embeds: [{ color: userinfo.color, title: `All join roles`, description: List }] });
    } else if (command === `add`) {
      const role = interaction.data.options[0].role;
      if (!role) return bot.error(`You did not specify a role!`, bot, interaction);
      let _ = await model.findOne({ gid: interaction.guild.id, Role: role.id });
      if (_) return bot.error(`This join role already exist!`, bot, interaction);
      const newData = new model({
        gid: interaction.guild.id,
        Role: role.id
      });
      newData.save();
      let embed = new Discord.MessageEmbed()
        .setTitle(`Join role created`)
        .setColor(userinfo.color)
        .setDescription(`<@&${role.id}> will now be given at joining!`);
      await interaction.editReply({ embeds: [embed] });

    } else if (command === `del`) {
      const role = interaction.data.options[0].role;
      if (!role) return bot.error(`You did not specify a role!`, bot, interaction);
      let _ = await model.findOne({ gid: interaction.guild.id, Role: role.id });
      if (!_) return bot.error(`I can't find that join role!`, bot, interaction);
      await model.deleteOne({gid: interaction.guild.id, Role: role.id});
      let embed = new Discord.MessageEmbed()
        .setTitle(`Join role deleted`)
        .setColor(userinfo.color)
        .setDescription(`<@&${role.id}> will now not be longer given!`);
        await interaction.editReply({embeds: [embed]});
    }

  },
};
