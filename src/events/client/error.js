const { MessageEmbed } = require("discord.js")
/** 
 * Easy to send errors because im lazy to do the same things :p
 * @param {String} text - Message which is need to send
 * @param {Client} bot 
 * @param {Interaction} interaction 
 **/
module.exports = async function (text, bot, interaction) {
    if (!interaction) return;
    const { emojis } = global.bot.config;
    //interaction.channel.send(emojis.normal.cross + "`" + emojis.normal.cross + "`")
    let embed = new MessageEmbed()
        .setColor(`RED`)
        .setDescription(emojis.normal.cross + ` | ` + text);
    await interaction.editReply({ ephemeral: true, embeds: [embed] }).catch(async () => {
        let errorEmbed = new MessageEmbed()
            .setColor(`RED`)
            .setDescription(emojis.normal.cross + ` | ` + `Something went wrong with sending the error message!`);
        await interaction.editReply({ ephemeral: true, emebds: [errorEmbed] }).catch(() => { });
    })
}
