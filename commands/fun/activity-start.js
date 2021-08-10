const fetch = require("node-fetch");

module.exports = {
    name: "activity",
    description: "Start a discord activity!",
    private: false,
    commandOptions: [
        {
            type: 3,
            name: `activity`,
            description: `The activity to start`,
            required: true,
            choices: [
                {
                    "name": "YouTube Together",
                    "value": "755600276941176913"
                },
                {
                    "name": "PokerNight",
                    "value": "755827207812677713"
                },
                {
                    "name": "Fishington",
                    "value": "814288819477020702"
                },
                {
                    "name": "Betrayal.io",
                    "value": "773336526917861400"
                }
            ]
        }
    ],
    run: async (bot, interaction) => {
        const channel = interaction.member.voice.channel;
        if (!channel) return bot.error(`You are not in a voice channel!`, bot, interaction);
        if (!channel.permissionsFor(interaction.guild.me).has(bot.perms.CREATE_INSTANT_INVITE)) return bot.error('I need `CREATE_INSTANT_INVITE` permission', bot, interaction);

        fetch(`https://discord.com/api/v8/channels/${channel.id}/invites`, {
            method: "POST",
            body: JSON.stringify({
                max_age: 86400,
                max_uses: 0,
                target_application_id: interaction.data.options[0].value,
                target_type: 2,
                temporary: false,
                validate: null
            }),
            headers: {
                "Authorization": `Bot ${bot.token}`,
                "Content-Type": "application/json"
            }
        })
            .then(res => res.json())
            .then(async (invite) => {
                if (invite.error || !invite.code) return bot.error("Could not start the activity!", bot, interaction);
                await interaction.editReply(`[Click here to start ${interaction.data.options[0].name} in ${channel.name}](https://discord.gg/${invite.code})`);
            })
            .catch(() => {
                return bot.error("Could not start the activity!", bot, interaction);
            })

    },
};