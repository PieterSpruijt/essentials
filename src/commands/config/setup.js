const fs = require(`fs`);

module.exports = {
    name: "setup",
    description: "Setup slash commands!",
    private: false,
    run: async (bot, interaction, userinfo) => {
        if (!interaction.member.permissions.has(bot.perms.ADMINISTRATOR) && !userinfo.developer) return bot.error(`You Dont have Permission to do that! You must be Administrator!`, bot, interaction);
        let loadedCommands = 0;
        fs.readdirSync("src/commands/").map(async (dir) => {
            //const commands = 
            fs.readdirSync(`src/commands/${dir}/`).map((cmd) => {
                let pull = require(`../${dir}/${cmd}`);
                let command = pull;
                bot.api.applications(`775055776854441985`).guilds(interaction.guild.id).commands.post({
                    data: {
                        name: command.name,
                        description: command.description,
                        options: command.commandOptions,
                        default_permission: true

                    }
                }).then(() => {
                    loadedCommands = loadedCommands + 1;
                    interaction.editReply(`Loaded \`${loadedCommands}\` of \`${bot.commands.size}\` commands!`);


                });



            });
        });

    },
};