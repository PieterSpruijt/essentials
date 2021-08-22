const ReactionModel = require("../../models/ReactionRole");

module.exports = {
  name: "reactionroles",
  description: "get all reaction roles",
  private: true,
  commandOptions: [
    {
      "name": "list",
      "description": "Get a list of all reaction roles!",
      "type": 1,
    },
    {
      "name": "add",
      "description": "Create a reaction role!",
      "type": 1,
      options: [
        {
          type: 7,
          name: `channel`,
          description: `The channel of the message`,
          required: true
        },
        {
          type: 3,
          name: `message`,
          description: `The ID of the message`,
          required: true
        },
        {
          type: 3,
          name: `emoji`,
          description: `The emoji`,
          required: true
        },
        {
          type: 8,
          name: `role`,
          description: `Role to give`,
          required: true
        },
      ]
    },
    {
      "name": "del",
      "description": "Delete a reaction role",
      "type": 1,
      options: [
        {
          type: 3,
          name: `message`,
          description: `The ID of the message`,
          required: true
        },
        {
          type: 8,
          name: `role`,
          description: `Role to give`,
          required: true
        },
      ]
    },
  ],
  run: async (bot, interaction, userinfo) => {
    const command = interaction.options._subcommand;
    if (command === `list`) {
      let ReactionRoles = await ReactionModel.find({ Guild: interaction.guild.id });
      let Roles = ReactionRoles.map(data => `<#${data.Channel}> - ${data.Reaction} - ${data.MessageID} - <@&${data.Role}>`).join('\n')
      if (!Roles.length) {
        Roles = `No reactionroles set!`
      }
      await interaction.editReply({ embeds: [{ color: userinfo.color, title: `All reactionroles`, description: Roles }] });
    } else if (command == `add`) {
      const channel = interaction.data.options[0].channel;
      if (!channel) bot.error(`You did not specify a channel`, bot, interaction);
      const message = await channel.messsages.fetch(interaction.data.options[1]);
      if (!message) return bot.error(`I can't find that message!`, bot, interaction);
      const emoji = interaction.data.options[2];
      const role = interaction.data.options[3].role;
      if (!role) return bot.error(`You did not specify a role!`, bot, interaction);
      const newData = new ReactionModel({
        Guild: interaction.guild.id,
        Reaction: emoji,
        MessageID: message,
        Channel: channel.id,
        Role: role.id,
      });
      newData.save();
      await interaction.editReply(`Reaction role created!`);
      let m = await channel.messages.fetch(message);
      m.react(emoji).catch(() => { return interaction.followUp({ content: `Could not react on the message`, ephemeral: true }) });
    } else if (command === `del`) {
      const message = interaction.data.options[0];
      let _ = await ReactionModel.findOne({ Guild: interaction.guild.id, MessageID: message });
      if (!_) return bot.error(`I can't find this reactio role or message`, bot, interaction);
      await ReactionModel.deleteMany({ Guild: interaction.guild.id, MessageID: message });
      await interaction.editReply(`Reaction role deleted`);

    }

  },
};
