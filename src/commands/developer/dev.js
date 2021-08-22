const Discord = require('discord.js');
const evallog = new Discord.WebhookClient({ id: global.bot.config.webhooks['eval-log'][0], token: global.bot.config.webhooks['eval-log'][1] });

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
        }
    },
};
