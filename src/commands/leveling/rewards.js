const model = require("../../models/lvlreward");
const rewards = require('../../models/lvlreward');

module.exports = {
  name: "rewards",
  description: "get all level rewards!",
  private: true,
  commandOptions: [
    {
      "name": "list",
      "description": "Get a list of all leveling rewards!",
      "type": 1,
    },
    {
      "name": "add",
      "description": "Add a leveling reward!",
      "type": 1,
      options: [
        {
          type: 8,
          name: `role`,
          description: `Role to give`,
          required: true
        },
        {
          type: 10,
          name: `level`,
          description: `Level to give the role at`,
          required: true
        }
      ]
    },
    {
      "name": "del",
      "description": "Delete a leveling reward",
      "type": 1,
      options: [
        {
          type: 8,
          name: `role`,
          description: `Role to give`,
          required: true
        },
        {
          type: 10,
          name: `level`,
          description: `Level to give the role at`,
          required: true
        }
      ]
    },
  ],
  run: async (bot, interaction, userinfo) => {
    if (!interaction.member.permissions.has(bot.perms.ADMINISTRATOR)) return bot.error(`You Dont have Permission to do that! You must be Administrator!`, bot, interaction);
    let command = interaction.options._subcommand;
    if (command === `list`) {
      let Rewards = await model.find({ gid: interaction.guild.id });
      let List = Rewards.map(data => `Level ${data.level} - <@&${data.role}>`).join('\n')
      if (!Rewards.length) {
        List = `No level rewards set!`
      }
      await interaction.editRepy({ embeds: [{ color: userinfo.color, title: `All level rewards`, description: List }] });
    } else if (command === `add`) {
      const level = interaction.data.options[0].value;
      const role = interaction.data.options[1].role;
      if (!role) return bot.error(`You did not specify a role!`, bot, interaction);
      let _ = await rewards.findOne({ gid: interaction.guild.id, role: role.id, level: level });
      if (_) return bot.error(`This reward already exists!`, bot, interaction);
      const newData = new rewards({
        gid: interaction.guild.id,
        role: role.id,
        level: level,
      });
      newData.save();
      await interaction.editReply(`**${role.Discord.name}** will be given at level **${level}**`);

    } else if (command === `del`) {
      const level = interaction.data.options[0].value;
      const role = interaction.data.options[1].role;

      let _ = await rewards.findOne({ gid: interaction.guild.id, role: role.id, level });
      if (!_) return bot.error(`I can't find this reward!`, bot, interaction);
      await rewards.deleteOne({ gid: interaction.guild.id, role: role.id, level });
      await interaction.editReply(`**${role.Discord.name}** won't be given anymore at level **${level}**`);
    }
  },
};
