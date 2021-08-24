const userdb = require(`../../models/userdb`);
const Discord = require('discord.js');
const GuildSettings = require('../../models/settings');
const Timeout = new Set();
const ms = require('ms');

module.exports = async function (bot, interaction) {
    var storedSettings = await GuildSettings.findOne({ gid: interaction.guild.id });
    if (!storedSettings) {
        // If there are no settings stored for this guild, we create them and try to retrive them again.
        const newSettings = new GuildSettings({
            gid: interaction.guild.id,
            levels: true,
            economy: false,
        });
        await newSettings.save().catch(() => { });
        storedSettings = await GuildSettings.findOne({ gid: interaction.guild.id });
    }

    if (interaction.isButton()) {
        //code
    } else if (interaction.isCommand()) {
        // Check if user is in the db
        let user = await userdb.findOne({ userid: interaction.member.user.id });
        let hasAccepted = user ? user.rules : false;
        if (!hasAccepted) {
            await interaction.deferReply();
            const { /* registerFont, */ createCanvas } = require('canvas');
            const create = () => {
                var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
                var string_length = 6;
                var randomstring = '';
                for (var i = 0; i < string_length; i++) {
                    var rnum = Math.floor(Math.random() * chars.length);
                    randomstring += chars.substring(rnum, rnum + 1);
                }
                return randomstring;
            }
            const choises = [create(), create(), create()];
            const width = 400
            const height = 125
            const canvas = createCanvas(width, height)
            const context = canvas.getContext('2d')
            //await registerFont('src/fonts/font.ttf', { family: 'Captcha' })
            context.fillRect(0, 0, width, height)
            context.font = 'bold 60pt Sans'
            context.textAlign = 'center'
            context.fillStyle = '#fff'
            let correctAnswer = choises[Math.floor(Math.random() * choises.length)];
            context.fillText(correctAnswer, 200, 90)
            const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'captcha.png');
            const row = new Discord.MessageActionRow()
                .addComponents(
                    new Discord.MessageButton()
                        .setCustomId(`rules_captcha_` + choises[0])
                        .setLabel(choises[0])
                        .setStyle('PRIMARY'),
                    new Discord.MessageButton()
                        .setCustomId(`rules_captcha_` + choises[1])
                        .setLabel(choises[1])
                        .setStyle('PRIMARY'),
                    new Discord.MessageButton()
                        .setCustomId(`rules_captcha_` + choises[2])
                        .setLabel(choises[2])
                        .setStyle('PRIMARY'),
                    new Discord.MessageButton()
                        .setURL(`https://www.essentialsbot.ga/terms-of-service/`)
                        .setLabel('visit rules')
                        .setStyle('LINK'),
                );
            const locked = new Discord.MessageActionRow()
                .addComponents(
                    new Discord.MessageButton()
                        .setCustomId(`rules_captcha_` + choises[0])
                        .setLabel(choises[0])
                        .setDisabled()
                        .setStyle('PRIMARY'),
                    new Discord.MessageButton()
                        .setCustomId(`rules_captcha_` + choises[1])
                        .setLabel(choises[1])
                        .setDisabled()
                        .setStyle('PRIMARY'),
                    new Discord.MessageButton()
                        .setCustomId(`rules_captcha_` + choises[2])
                        .setLabel(choises[2])
                        .setDisabled()
                        .setStyle('PRIMARY'),
                    new Discord.MessageButton()
                        .setURL(`https://www.essentialsbot.ga/terms-of-service/`)
                        .setLabel('visit rules')
                        .setStyle('LINK'),
                );
            let embed = new Discord.MessageEmbed()
                .setTitle(`Accept ToS`)
                .setDescription(`You need to agree the Essentials ToS to use commands!`)
                .setColor(`#e91e63`)
                .setImage('attachment://captcha.png');

            await interaction.editReply({ embeds: [embed], files: [attachment], components: [row] }).then(async (data) => {
                const filter = i => {
                    return i.user.id === interaction.user.id;
                };
                data.awaitMessageComponent({ filter, componentType: 'BUTTON', time: 60000 })
                    .then(async (i) => {
                        if (i.customId.replace(`rules_captcha_`, ``) != correctAnswer) {
                            const canvas1 = createCanvas(width, height)
                            const context1 = canvas1.getContext('2d')
                            //await registerFont('src/fonts/font.ttf', { family: 'Captcha' })
                            context1.fillStyle = `#8B0000`;
                            context1.fillRect(0, 0, width, height);
                            context1.font = 'bold 60pt Sans';
                            context1.textAlign = 'center';
                            context1.fillStyle = '#fff';
                            context1.fillText(`Error`, 200, 90);
                            const newAttachment = new Discord.MessageAttachment(canvas1.toBuffer(), 'error.png');
                            let newEmbed = new Discord.MessageEmbed()
                                .setTitle(`ToS not accepted!`)
                                .setDescription(`You clicked the wrong captcha button!`)
                                .setImage('attachment://error.png')
                                .setColor(`#e91e63`);
                            await interaction.followUp({ embeds: [newEmbed], files: [newAttachment], components: [locked] });
                            await i.deferReply({ ephemeral: true });
                            await i.editReply({ content: `You didn't accept the ToS!`, ephemeral: true });
                            await interaction.deleteReply();


                        } else {
                            const canvas1 = createCanvas(width, height)
                            const context1 = canvas1.getContext('2d')
                            //await registerFont('src/fonts/font.ttf', { family: 'Captcha' })
                            context1.fillStyle = `#52c900`;
                            context1.fillRect(0, 0, width, height);
                            context1.font = 'bold 60pt Sans';
                            context1.textAlign = 'center';
                            context1.fillStyle = '#fff';
                            context1.fillText(`Success`, 200, 90);
                            const newAttachment = new Discord.MessageAttachment(canvas1.toBuffer(), 'success.png');
                            let newEmbed = new Discord.MessageEmbed()
                                .setTitle(`ToS accepted!`)
                                .setDescription(`You have successfully accepted the Essentials ToS! You can now use all commands without problems make sure to still follow the ToS, have a great day!`)
                                .setImage('attachment://success.png')
                                .setColor(`#e91e63`);
                            await interaction.followUp({ embeds: [newEmbed], files: [newAttachment], components: [locked] });
                            await i.deferReply({ ephemeral: true });
                            await i.editReply({ content: `You accepted the ToS!`, ephemeral: true });
                            await interaction.deleteReply();
                            if (user) {
                                userdb.findOne(
                                    { userid: interaction.member.user.id },
                                    async (err, data) => {
                                        if (err) console.log(err);
                                        data.rules = true;
                                        data.save();
                                    }
                                );
                            } else {
                                const newUser = new userdb({
                                    userid: interaction.member.user.id,
                                    developer: false,
                                    banned: false,
                                    color: `#e91e63`,
                                    snipe: true,
                                    rules: true
                                });
                                await newUser.save().catch(() => { });
                            }

                        }



                    })
                    .catch(async (e) => {
                        console.log(e)
                        const canvas1 = createCanvas(width, height)
                        const context1 = canvas1.getContext('2d')
                        //await registerFont('src/fonts/font.ttf', { family: 'Captcha' })
                        context1.fillStyle = `#8B0000`;
                        context1.fillRect(0, 0, width, height);
                        context1.font = 'bold 60pt Sans';
                        context1.textAlign = 'center';
                        context1.fillStyle = '#fff';
                        context1.fillText(`Error`, 200, 90);
                        const newAttachment = new Discord.MessageAttachment(canvas1.toBuffer(), 'error.png');
                        let newEmbed = new Discord.MessageEmbed()
                            .setTitle(`ToS not accepted!`)
                            .setDescription(`You didn't click a captcha button!`)
                            .setImage('attachment://error.png')
                            .setColor(`#e91e63`);
                        await interaction.followUp({ embeds: [newEmbed], files: [newAttachment], components: [locked] });
                        await interaction.deleteReply();
                    });
            });
        }
        if (!hasAccepted) return;
        //bot.api.applications(`775055776854441985`).guilds(`846707934040948776`).commands(interaction.commandId).delete();

        let userinfo = await userdb.findOne({ userid: interaction.user.id });
        if (!userinfo) {
            userinfo = {
                userid: interaction.member.user.id,
                developer: false,
                banned: false,
                color: `#e91e63`,
                snipe: true,
                rules: true
            }
        }
        if (userinfo.banned) {
            return interaction.editReply({ embeds: [{ description: `${bot.emojis.normal.alert} | ooh ooh, You are banned by the developers of this bot!!`, color: "#e91e63" }], ephemeral: true });
        }
        const errorlog = new Discord.WebhookClient({ id: bot.config.webhooks["error-log"][0], token: bot.config.webhooks["error-log"][1] });
        const command = bot.commands.get(interaction.commandName);
        if (!command) {
            await interaction.deferReply({ ephemeral: true });
            return await interaction.editReply({ content: `This is not a valid command!`, ephemeral: true });
        }
        interaction.data = [];
        interaction.data.options = interaction.options._hoistedOptions
        if (command.timeout) {
            if (Timeout.has(`${interaction.user.id}_${command.name}`)) {
                await interaction.deferReply({ ephemeral: true });
                await interaction.editReply({ embeds: [{ color: userinfo.color, title: `Take a break`, description: `Ooh Ooh, You are on cooldown\nThe default cooldown of this command is \`${ms(command.timeout)}\`` }], ephemeral: true });
                return;
            } else {
                Timeout.add(`${interaction.user.id}_${command.name}`);
                setTimeout(() => {
                    Timeout.delete(`${interaction.user.id}_${command.name}`);
                }, command.timeout);
            }
        }
        if (command.private) {
            await interaction.deferReply({ ephemeral: true });
        } else {
            await interaction.deferReply({ ephemeral: false });
        }
        command.run(bot, interaction, userinfo).catch(err => {
            var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
            var string_length = 10;
            var password = '';
            for (var i = 0; i < string_length; i++) {
                var rnum = Math.floor(Math.random() * chars.length);
                password += chars.substring(rnum, rnum + 1);
            }
            let embed = new Discord.MessageEmbed()
                .setTitle(password)
                .addField(`Member:`, interaction.member.user.id + `in` + interaction.guild.id)
                .addField(`Command`, interaction.commandName)
                .addField(`ERROR`, `\`\`\`${err}\`\`\``)
                .addField(`STACK`, `\`\`\`${err.stack}\`\`\``);
            console.log(err)
            errorlog.send({ embeds: [embed] }).catch(() => { })
            interaction.editReply({ embeds: [{ color: userinfo.color, title: `ERROR`, description: `An error has occurred\nSend this to the developers: \`${password}\`You can contact the developers [by joining the support server](${bot.config.support_server})` }], ephemeral: true });
        });

    }


}