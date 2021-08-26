const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "clear",
  description: "Clear messages in a channel",
  aliases: ["prune", "delete"],
  category: "moderation",
  usage: "clear [amount]",
  run: async (bot, message, args, userinfo) => {
    if (!message.member.permissions.has(bot.perms.MANAGE_MESSAGES))
    return message.channel.send(`${bot.info.emojis.normal.cross} | You Dont have Permsission to do that you can do \`report [tag user] [reason]\` of you want to report someone!`);
    const amount = parseInt(args[0]) + 1;     


    if (isNaN(amount)) {
			return message.reply(`${bot.info.emojis.normal.cross} | that doesn\'t seem to be a valid number. | \`clear [amount 1-99]\``);
		} else if (amount <= 1 || amount > 100) {
			return message.reply(`${bot.info.emojis.normal.cross} | you need to input a number between 1 and 99. | \`clear [amount 1-99]\``);
		}
    if (amount > 100) amount = 100;

		message.channel.bulkDelete(amount, true).catch(err => {
			//console.error(err); mogelijk error van console.
			message.channel.send(`${bot.info.emojis.normal.cross} | there was an error trying to delete messages in this channel!`);
		});
  },
};
