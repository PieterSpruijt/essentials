const Discord = require('discord.js');

module.exports = {
    name: "devcommands",
    description: "Get access to developer commands!",
    category: "developer",
    private: false,
    commandOptions: [
        {
            type: 5,
            name: `value`,
            description: `Value to set developer commands to`,
            required: true
        }
    ],
    run: async (bot, interaction, userinfo) => {
        const row = new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageButton()
                    .setLabel(`Support Server`)
                    .setStyle(`LINK`)
                    .setURL(global.bot.config.support_server)
            )
        if (!userinfo.developer) return await interaction.editReply({ content: `This is not for you!`, components: [row] });
        const value = interaction.data.options[0].value;
        console.log(value)
        if (value) {
            let pull = require(`./eval`);
            bot.api.applications(`775055776854441985`).guilds(interaction.guild.id).commands.post(
                {
                    data: {
                        name: pull.name,
                        description: pull.description,
                        options: pull.commandOptions,
                        default_permission: true

                    }
                }
            );
            /*
            fs.readdirSync(`./commands/developer`).map((cmd) => {
                if (cmd != `devcommands.js`) {
                    let pull = require(`./${cmd}`);
                    bot.api.applications(`775055776854441985`).guilds(interaction.guild.id).commands.post(
                        {
                            data: {
                                name: pull.name,
                                description: pull.description,
                                options: pull.commandOptions,
                                default_permission: true

                            }
                        }
                    );

                }

            });
            */
            await interaction.editReply(`Enabled developer commands!`);



        } else if (!value) {
            let commands = await interaction.guild.commands.fetch();
            commands.forEach(async (command) => {
                console.log(command)
                //bot.api.applications(`775055776854441985`).guilds(interaction.guild.id).commands(command.permissions.commandId).delete();
            }).catch(() => { });
            await interaction.editReply(`Disabled developer commands!`);

        }
    },
};
