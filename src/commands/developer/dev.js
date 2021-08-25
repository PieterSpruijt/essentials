const Discord = require('discord.js');
const evallog = new Discord.WebhookClient({ id: global.bot.config.webhooks['eval-log'][0], token: global.bot.config.webhooks['eval-log'][1] });
const fs = require('fs');

const clean = text => {
    if (typeof (text) === "string")
        return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    else
        return text;
}

module.exports = {
    name: "dev",
    description: "Developer commands!",
    private: false,
    commandOptions: [
        {
            "name": "eval",
            "description": "Evaluate code!",
            "type": 1,
            options: [
                {
                    type: 3,
                    name: `code`,
                    description: `Code to evaluate`,
                    required: true
                }
            ]
        },
        {
            name: `test`,
            description: `Run test code!`,
            type: 1,
        },
        {
            name: `reload`,
            description: `reload a command or shard!`,
            type: 1,
            options: [
                {
                    type: 3,
                    name: `command`,
                    description: `The command to reload`,
                    required: false,
                },
                {
                    type: 10,
                    name: `shard`,
                    description: `The shard id to reload`,
                    required: false,
                }
            ]
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
        let command = interaction.options._subcommand;
        if (command === `eval`) {
            const code = interaction.data.options[0].value;
            try {
                let evaled = eval(code);

                if (typeof evaled !== "string")
                    evaled = require("util").inspect(evaled);
                await interaction.editReply({
                    embeds: [{
                        fields: [
                            { name: "📥 Input code", value: `\`\`\`js\n${code}\`\`\`` },
                            { name: "📤 Output code", value: `\`\`\`powershell\n${clean(evaled)}\`\`\`` }
                        ],
                        color: `GREEN`
                    }], code: "xl"
                }).catch(async (err) => {
                    await interaction.editReply({
                        embeds: [{
                            fields: [
                                { name: "📥 Input code", value: `\`\`\`js\n${code}\`\`\`` },
                                { name: "📤 Output code", value: `Error:\n\`\`\`powershell\n${err}\n${err.stack}\`\`\`` }
                            ],
                            color: `GREEN`
                        }], code: "xl"
                    }).catch(() => { });
                });
                evallog.send({
                    embeds: [{
                        fields: [
                            { name: "New code", value: `${interaction.user.id} (${interaction.user.tag})` },
                            { name: "📥 Input code", value: `\`\`\`js\n${code}\`\`\`` },
                            { name: "📤 Output code", value: `\`\`\`powershell\n${clean(evaled)}\`\`\`` }
                        ],
                        color: `GREEN`
                    }], code: "xl"
                }).catch((err) => {
                    evallog.send({
                        embeds: [{
                            fields: [
                                { name: "New code", value: `${interaction.user.id} (${interaction.user.tag})` },
                                { name: "📥 Input code", value: `\`\`\`js\n${code}\`\`\`` },
                                { name: "📤 Output code", value: `Error:\n\`\`\`powershell\n${err}\n${err.stack}\`\`\`` }
                            ],
                            color: `GREEN`
                        }], code: "xl"
                    }).catch(() => { });
                });
            } catch (err) {
                await interaction.editReply({
                    embeds: [{
                        fields: [
                            { name: "📥 Input code", value: `\`\`\`js\n${code}\`\`\`` },
                            { name: "📤 Output code", value: `Error:\n\`\`\`powershell\n${err}\n${err.stack}\`\`\`` }
                        ],
                        color: `GREEN`
                    }], code: "xl"
                }).catch(() => { });
                evallog.send({
                    embeds: [{
                        fields: [
                            { name: "New code", value: `${interaction.user.id} (${interaction.user.tag})` },
                            { name: "📥 Input code", value: `\`\`\`js\n${code}\`\`\`` },
                            { name: "📤 Output code", value: `Error:\n\`\`\`powershell\n${err}\n${err.stack}\`\`\`` }
                        ],
                        color: `GREEN`
                    }], code: "xl"
                }).catch(() => { });
            }
        } else if (command === `test`) {
            return await interaction.editReply(`Not in use`);
        } else if (command === `reload`) {
            let type = interaction.data.options[0] ? interaction.data.options[0].name : false;
            if (!type) return bot.error(`You did not specify a command or shard!`, bot, interaction);
            if (type === `command`) {
                const name = interaction.data.options[0].value;
                const command = bot.commands.get(name);
                if (!command) return bot.error(`I can't find that command!`, bot, interaction);
                for (const category of fs.readdirSync(`src/` + `/commands`)) {
                    const categoryPath = `src/` + `/commands/` + category;
                    if (!fs.lstatSync(categoryPath).isDirectory()) continue;
                    for (const commandName of fs.readdirSync(categoryPath)) {
                        if (!commandName.endsWith(`.js`)) continue;
                        if (commandName === command.name + `.js`) {
                            delete require.cache[require.resolve(`../${category}/${command.name}.js`)];
                            const newCommand = require(`../${category}/${command.name}.js`);
                            bot.commands.set(newCommand.name, newCommand);

                            bot.api.applications(`775055776854441985`).guilds(interaction.guild.id).commands.post({
                                data: {
                                    name: command.name,
                                    description: command.description,
                                    options: command.commandOptions,
                                    default_permission: true

                                }
                            });
                            await interaction.editReply(`Command \`${command.name}\` was reloaded!`);
                        }
                    }
                }
            } else if (type === `shard`) {
                const shard = interaction.data.options[0].value;
                await interaction.editReply(`Reloaded shard ${shard}!`);
                process.exit();
            }
        }
    },
};
