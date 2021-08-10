module.exports = {
  name: "clear",
  description: "Clear messages in a channel",
  private: true,
  commandOptions: [
    {
      type: 10,
      name: `amount`,
      description: `Amount of messages to delete`,
      required: true
    }
  ],
  run: async (bot, interaction) => {
    if (!interaction.member.permissions.has(bot.perms.MANAGE_MESSAGES))
      return bot.error(`You Dont have Permsission to do that you can do \`report [tag user] [reason]\` of you want to report someone!`, bot, interaction);
    let amount = interaction.data.options[0].value + 1;


    if (amount <= 1 || amount > 100) {
      return bot.error(`you need to input a number between 1 and 99.`, bot, interaction);
    }
    if (amount > 100) amount = 100;

    interaction.channel.bulkDelete(amount, true).catch(async () => {
      //console.error(err); mogelijk error van console.
      return await bot.error(`There was an error trying to delete messages in this channel!`, bot, interaction);
    });
    await interaction.editReply(`Cleared ${interaction.data.options[0].value} messages`);
  },
};
