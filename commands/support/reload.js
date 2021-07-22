const Discord = require('discord.js');

module.exports = {
  name: "reload",
  description: "Special developer command!",
  category: "support",
  usage: "`reload [command]`",
  run: async (bot, message, args, userinfo) => {
    if (!userinfo.developer) {
      let Embed = new Discord.MessageEmbed()
        .setDescription(`${emoji.normal.cross} You are not allowed to use the args command\n This command is only for the Essentials support team!`)
        .setColor(`#e91e63`);
    message.channel.send(Embed)
    }
    if (userinfo.developer) {
      const commandName = args[0].toLowerCase();
		const command = bot.commands.get(commandName)
			|| bot.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

		if (!command) {
			return message.channel.send(`There is no command with name or alias \`${commandName}\`, ${message.author}!`);
		}

		delete require.cache[require.resolve(`../${command.category}/${command.name}.js`)];

		try {
			const newCommand = require(`../${command.category}/${command.name}.js`);
			bot.commands.set(newCommand.name, newCommand);
			message.channel.send(`Command \`${command.name}\` was reloaded!`);
		} catch (error) {
			console.error(error);
			message.channel.send(`There was an error while reloading a command \`${command.name}\`:\n\`${error.message}\``);
		}
    }
    
  },
};
