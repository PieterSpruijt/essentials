const Discord = require('discord.js');
const fs = require('fs');
//const model = global.models.settings;

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
        if (value) {
            fs.readdirSync(`src/commands/developer`).map(async (cmd) => {
                if (cmd.toString() != `devcommands.js`) {
                    let pull = require(`./${cmd.split(`.`)[0]}`);

                    bot.api.applications(bot.application.id).guilds(interaction.guild.id).commands.post(
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


            await interaction.editReply(`Enabled developer commands!`);



        } else if (!value) {
            bot.api.applications(`775055776854441985`).guilds(interaction.guild.id).commands(`875345421424275456`).delete();
            /*
            let commands = await interaction.guild.commands.fetch();
            commands.forEach(async (command) => {
                console.log(command)
                //bot.api.applications(`775055776854441985`).guilds(interaction.guild.id).commands(command.permissions.commandId).delete();
            }).catch(() => { });
            */
            await interaction.editReply(`Disabled developer commands!`);

        }
    },
};
