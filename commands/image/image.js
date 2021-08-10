const Discord = require('discord.js');
const { MessageEmbed } = require('discord.js');
const axios = require('axios');

module.exports = {
    name: "image",
    description: "Cool images!",
    category: "image",
    private: false,
    commandOptions: [
        {
            type: 1,
            name: `ascii`,
            description: `Text to ascii!`,
            options: [
                {
                    type: 3,
                    name: `text`,
                    description: `Text`,
                    required: true
                }
            ]
        },
        {
            type: 1,
            name: `cat`,
            description: `Get a cat image!`
        },
        {
            type: 1,
            name: `dog`,
            description: `Get a dog image!`

        },
        {
            type: 1,
            name: `duck`,
            description: `Get a duck image!`
        },
        {
            type: 1,
            name: `fox`,
            description: `Get a fox image!`
        },
        {
            type: 1,
            name: `kiss`,
            description: `Kiss an user!`,
            options: [
                {
                    type: 6,
                    name: `user`,
                    description: `The user`,
                    required: true
                }
            ]
        },
        {
            type: 1,
            name: `panda`,
            description: `Get a panda image!`
        },
        {
            type: 1,
            name: `podium`,
            description: `Make a podium with three users!`,
            options: [
                {
                    type: 6,
                    name: `user1`,
                    description: `The first user`,
                    required: true
                },
                {
                    type: 6,
                    name: `user2`,
                    description: `The second user`,
                    required: true
                },
                {
                    type: 6,
                    name: `user3`,
                    description: `The third user`,
                    required: true
                }
            ]
        },
        {
            type: 1,
            name: `red-panda`,
            description: `Get a red-panda image!`
        },
        {
            type: 1,
            name: `spank`,
            description: `Spank an user!`,
            options: [
                {
                    type: 6,
                    name: `user`,
                    description: `The user`,
                    required: true
                }
            ]
        },
        {
            type: 1,
            name: `wanted`,
            description: `Create a wanted poster of an user!`,
            options: [
                {
                    type: 6,
                    name: `user`,
                    description: `The user`,
                    required: true
                }
            ]
        },
        {
            type: 1,
            name: `gif`,
            description: `Search for gift on giphy!`,
            options: [
                {
                    type: 3,
                    name: `text`,
                    description: `Text to search for`,
                    required: true
                }
            ]
        },
        {
            type: 1,
            name: `meme`,
            description: `Show a random meme!`
        },
    ],
    run: async (bot, interaction, userinfo) => {
        let command = interaction.options._subcommand;

        if (command === `cat`) {
            let url = `https://aws.random.cat/meow`;
            axios
                .get(url)
                .then(async (embed) => {
                    let { data } = embed;
                    let embed2 = new MessageEmbed()
                        .setTitle(`Random cat`)
                        .setImage(data.file)
                        .setColor(userinfo.color);
                    await interaction.editReply({ embeds: [embed2] });
                });
        } else if (command === `ascii`) {

            const figlet = require('figlet');
            const jsp = require('jspaste')
            let text = interaction.data.options[0].value;
            figlet(text, async function (err, ascii) {
                if (err) {
                    interaction.editReply(`Something went wrong!`);
                    return;
                }
                const link = await jsp.publicar(ascii)
                let Embed3 = new MessageEmbed()
                    .setAuthor(bot.config.botName, bot.config.embeds.footer_photo, bot.config.website)
                    .addField('Download', `[Direct](${link.url})`)
                    .addField('Preview', `\`\`\`${ascii}\`\`\``)
                    .setColor(userinfo.color)
                    .setFooter(bot.config.embeds.footer_name, bot.config.embeds.footer_photo);
                await interaction.editReply({ embeds: [Embed3] });
            });
        } else if (command === `dog`) {
            let url = `https://dog.ceo/api/breeds/image/random`;
            axios
                .get(url)
                .then(async (embed) => {
                    let { data } = embed;
                    let embed2 = new MessageEmbed()
                        .setTitle(`Random dog`)
                        .setImage(data.message)
                        .setColor(userinfo.color);
                    await interaction.editReply({ embeds: [embed2] });
                });
        }
        else if (command === `duck`) {
            let url = `https://random-d.uk/api/v2/random`;
            axios
                .get(url)
                .then(async (embed) => {
                    let { data } = embed;
                    let embed2 = new MessageEmbed()
                        .setTitle(`Random duck`)
                        .setImage(data.url)
                        .setColor(userinfo.color);
                    await interaction.editReply({ embeds: [embed2] });

                });
        } else if (command === `fox`) {
            let url = `https://some-random-api.ml/img/fox`;
            axios
                .get(url)
                .then(async (embed) => {
                    let { data } = embed;
                    let embed2 = new MessageEmbed()
                        .setTitle(`Random fox`)
                        .setImage(data.link)
                        .setColor(userinfo.color);
                    await interaction.editReply({ embeds: [embed2] });
                });

        } else if (command === `kiss`) {
            const DIG = require("discord-image-generation");
            let avatar = interaction.member.user.displayAvatarURL({ dynamic: false, format: 'png' });
            let User = interaction.data.options[0].user;
            let UserAvatar = User.displayAvatarURL({ dynamic: false, format: 'png' });
            let img = await new DIG.Kiss().getImage(avatar, UserAvatar);
            let attach = new Discord.MessageAttachment(img, "kiss.png");
            await interaction.editReply({ files: [attach] })

        } else if (command === `panda`) {
            let url = `https://some-random-api.ml/img/panda`;
            axios
                .get(url)
                .then(async (embed) => {
                    let { data } = embed;
                    let embed2 = new MessageEmbed()
                        .setTitle(`Random panda`)
                        .setImage(data.link)
                        .setColor(userinfo.color);
                    await interaction.editReply({ embeds: [embed2] });
                });
        } else if (command === `podium`) {
            const DIG = require("discord-image-generation");
            let User1 = interaction.data.options[0].user;
            let User2 = interaction.data.options[1].user;
            let User3 = interaction.data.options[2].user;


            let User1Avatar = User1.displayAvatarURL({ dynamic: false, format: 'png' });
            let User2Avatar = User2.displayAvatarURL({ dynamic: false, format: 'png' });
            let User3Avatar = User3.displayAvatarURL({ dynamic: false, format: 'png' });



            let img = await new DIG.Podium().getImage(User1Avatar, User2Avatar, User3Avatar, User1.tag, User2.tag, User3.tag);
            let attach = new Discord.MessageAttachment(img, "podium.png");
            await interaction.editReply({ files: [attach] })
        } else if (command === `red-panda`) {
            let url = `https://some-random-api.ml/img/red_panda`;
            axios
                .get(url)
                .then(async (embed) => {
                    let { data } = embed;
                    let embed2 = new MessageEmbed()
                        .setTitle(`Random red panda`)
                        .setImage(data.link)
                        .setColor(userinfo.color);
                    await interaction.editReply({ embeds: [embed2] });
                })
        } else if (command === `spank`) {
            const DIG = require("discord-image-generation");
            let avatar = interaction.member.user.displayAvatarURL({ dynamic: false, format: 'png' });
            let User = interaction.data.options[0].user;
            let UserAvatar = User.displayAvatarURL({ dynamic: false, format: 'png' });
            let img = await new DIG.Spank().getImage(avatar, UserAvatar);
            let attach = new Discord.MessageAttachment(img, "spank.png");
            await interaction.editReply({ files: [attach] });
        } else if (command === `wanted`) {
            const DIG = require("discord-image-generation");
            let User = interaction.data.options[0].user;
            let UserAvatar = User.displayAvatarURL({ dynamic: false, format: 'png' });
            let img = await new DIG.Wanted().getImage(UserAvatar, `€`);
            let attach = new Discord.MessageAttachment(img, "wanted.png");
            await interaction.editReply({ files: [attach] });
        } else if (command === `gif`) {
            var giphy = require('giphy-api')(bot.config.giphyToken);
            giphy.random(interaction.data.options[0].value, async function (err, res) {
                const textembed = new MessageEmbed()
                    .setTitle(`First Result for "${interaction.data.options[0].value}" on GIPHY`)
                    .setColor(userinfo.color)
                    .setURL(res.data.url)
                    .setImage(`https://media1.giphy.com/media/${res.data.id}/giphy.gif`)
                    .setThumbnail(`https://i.imgur.com/Qf3OBCD.gif`);
                await interaction.editReply({ embeds: [textembed] });
            });

        } else if (command === `meme`) {
            const url = 'https://www.reddit.com/r/meme/hot/.json?limit=100'
            const https = require('https');
            https.get(url, (result) => {
                var body = ''
                result.on('data', async (chunk) => {
                    body += chunk
                })

                result.on('end', async () => {
                    var response = JSON.parse(body)
                    var index = response.data.children[Math.floor(Math.random() * 99) + 1].data

                    if (index.post_hint !== 'image') {
                        const textembed = new Discord.MessageEmbed()
                            .setTitle(title)
                            .setColor(userinfo.color)
                            .setURL(`https://reddit.com/${link}`)
                            .setFooter(`👍${ups} | 💬${coms}`)

                        await interaction.editReply({ embeds: [textembed] })
                    }

                    var image = index.preview.images[0].source.url.replace('&amp;', '&')
                    var title = index.title
                    var ups = index.ups
                    var coms = index.num_comments
                    var link = 'https://reddit.com' + index.permalink

                    if (index.post_hint !== 'image') {
                        const textembed = new Discord.MessageEmbed()
                            .setTitle(title)
                            .setColor(userinfo.color)
                            .setURL(`https://reddit.com/${link}`)
                            .setFooter(`👍${ups} | 💬${coms}`)

                        https.get(url, (result) => {
                            var body = ''
                            result.on('data', (chunk) => {
                                body += chunk
                            })

                            result.on('end', async () => {
                                var response = JSON.parse(body)
                                var index = response.data.children[Math.floor(Math.random() * 99) + 1].data

                                if (index.post_hint !== 'image') {

                                    const textembed = new Discord.MessageEmbed()
                                        .setTitle(title)
                                        .setColor(userinfo.color)
                                        .setURL(`https://reddit.com/${link}`)
                                        .setFooter(`👍${ups} | 💬${coms}`)

                                    await interaction.editReply({ embeds: [textembed] })
                                }

                                var image = index.preview.images[0].source.url.replace('&amp;', '&')
                                var title = index.title
                                var ups = index.ups
                                var coms = index.num_comments
                                var link = 'https://reddit.com' + index.permalink

                                if (index.post_hint !== 'image') {
                                    const textembed = new Discord.MessageEmbed()
                                        .setTitle(title)
                                        .setColor(userinfo.color)
                                        .setURL(`https://reddit.com/${link}`)
                                        .setFooter(`👍${ups} | 💬${coms}`)

                                    await interaction.editReply({ embeds: [textembed] })
                                }
                                const imageembed = new Discord.MessageEmbed()
                                    .setTitle(title)
                                    .setImage(image)
                                    .setColor(userinfo.color)
                                    .setURL(`https://reddit.com/${link}`)
                                    .setFooter(`👍${ups} | 💬${coms}`)
                                await interaction.editReply({ embeds: [imageembed] })
                            }).on('error', function () { })
                        })({ embeds: [textembed] })
                    }
                    const imageembed = new Discord.MessageEmbed()
                        .setTitle(title)
                        .setImage(image)
                        .setColor(userinfo.color)
                        .setURL(`https://reddit.com/${link}`)
                        .setFooter(`👍${ups} | 💬${coms}`)
                    await interaction.editReply({ embeds: [imageembed] })
                }).on('error', function () { })
            })

        }

    },
}