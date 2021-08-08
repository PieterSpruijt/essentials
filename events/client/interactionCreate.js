const userdb = require(`../../models/userdb`);
const Discord = require('discord.js');
const generator = require('generate-password');

module.exports = async function (bot, interaction) {
    console.log(interaction)

    if (interaction.isButton()) {

    } else if (interaction.isCommand()) {
        interaction.data = [];
        interaction.data.options = interaction.options._hoistedOptions

        let userinfo = await userdb.findOne({ userid: interaction.member.user });
        if (!userinfo) {
            userinfo = {
                userid: interaction.member.user.id,
                developer: false,
                banned: false,
                color: `#e91e63`,
                snipe: true,
            }
        }
        if (userinfo.banned) {
            return interaction.editReply({ embeds: [{ description: `${bot.emojis.normal.alert} | ooh ooh, You are banned by the developers of this bot!!`, color: "#e91e63" }], ephemeral:true });
        }
        const errorlog = new Discord.WebhookClient({ id: bot.config.webhooks["error-log"][0], token: bot.config.webhooks["error-log"][1] });
        const command = bot.commands.get(interaction.commandName)
        if (command.private) {
            await interaction.deferReply({ephemeral: true});
        } else {
            await interaction.deferReply({ephemeral: false});
        }
        command.run(bot, interaction, userinfo).catch(err => {
            const password = generator.generate({
                length: 10,
                numbers: true
            });
            let embed = new Discord.MessageEmbed()
                .setTitle(password)
                .addField(`Member:`, interaction.member.user.id + `in` + interaction.guild.id)
                .addField(`Command`, interaction.commandName)
                .addField(`ERROR`, `\`\`\`${err}\`\`\``)
                .addField(`STACK`, `\`\`\`${err.stack}\`\`\``);
                console.log(err)
            errorlog.send({ embeds: [embed] }).catch(error => { })
            interaction.editReply({ embeds: [{ color: userinfo.color ,title: `ERROR`, description: `An error has occurred\nSend this to the developers: \`${password}\`You can contact the developers [by joining the support server](${bot.config.support_server})` }], ephemeral: true });
        });

    }


}