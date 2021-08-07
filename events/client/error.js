const { MessageEmbed } = require("discord.js")
/** 
 * Easy to send errors because im lazy to do the same things :p
 * @param {String} text - Message which is need to send
 * @param {Client} bot 
 * @param {Interaction} interaction 
 **/
module.exports = async function (text, bot, interaction) {
    const { emojis } = this.config;
    let embed = new MessageEmbed()
        .setColor(`RED`)
        .setDescription(emojis.normal.cross + ` | ` + text);
        await interaction.editReply({ephemeral: true, embeds: [embed]});
}
