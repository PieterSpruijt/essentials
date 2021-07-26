const Discord = require("discord.js");

module.exports = {
  name: "serverinfo",
  category: "utility",
  description: "Get serverinfo!",
  usage: "`serverinfo`",
  run: async (bot, message, args, userinfo) => {
    function checkDays(date) {
      let now = new Date();
      let diff = now.getTime() - date.getTime();
      let days = Math.floor(diff / 86400000);
      return days + (days == 1 ? " day" : " days") + " ago";
  };
  let verifLevels = {
    "NONE": "None", 
    "LOW": "Low", 
    "MEDIUM" :"Medium", 
    "HIGH": "(╯°□°）╯︵  ┻━┻", 
    "VERY_HIGH": "┻━┻ミヽ(ಠ益ಠ)ノ彡┻━┻"
}
let region = {
    "brazil": `:flag_br: `,
    "eu-central": `:flag_eu: `,
    "singapore": `:flag_sg: `,
    "us-central": `:flag_us: `,
    "sydney": `:flag_au: `,
    "us-east": `:flag_us: `,
    "us-south": `:flag_us: `,
    "us-west": `:flag_us: `,
    "eu-west": `:flag_eu: `,
    "vip-us-east": `:flag_us: `,
    "europe": `:flag_gb:`,
    "amsterdam": `:flag_nl:`,
    "hongkong": `:flag_hk: `,
    "russia": `:flag_ru: `,
    "southafrica": `:flag_za: `
}

  const embed = new Discord.MessageEmbed()
  .setThumbnail(message.guild.iconURL({ dynamic: true }))
            .setColor(userinfo.color)
            .setTitle(`${message.guild.name} server information`)
            .addFields(
                {
                    name: "Server name: ",
                    value: message.guild.name,
                    inline: true,
                },
                {
                    name: "Server id: ",
                    value: message.guild.id,
                    inline: true,
                },
                {
                    name: "Owner: ",
                    value: `<@!${message.guild.ownerID}>`,
                    inline: true
                },
                {
                    name: "Region: ",
                    value: region[message.guild.region],
                    inline: true
                },
                {
                    name: "Verify level: ",
                    value: verifLevels[message.guild.verificationLevel],
                    inline: true
                },
                {
                    name: "Boost tier: ",
                    value: `${message.guild.premiumTier ? `Tier ${message.guild.premiumTier}` : 'None'}`,
                    inline: true
                },
                {
                    name: "Created on: ",
                    value: `${message.channel.guild.createdAt.toUTCString().substr(0, 16)} (${checkDays(message.channel.guild.createdAt)}) \n\n`,
                    inline: false
                },

                {
                    name: "Members: ",
                    value: `${message.guild.memberCount} members!`,
                    inline: true
                },
                {
                    name: "Bots: ",
                    value: `${message.guild.members.cache.filter(member => !member.user.bot).size} bots!`,
                    inline: true
                },
                {
                    name: "Text Channels: ",
                    value: `${message.guild.channels.cache.filter(channel => channel.type === 'text').size} channels!`,
                    inline: true
                },
                {
                    name: "Voice Channels: ",
                    value: `${message.guild.channels.cache.filter(channel => channel.type === 'voice').size} channels!`,
                    inline: true
                },
                {
                    name: "Roles: ",
                    value: `${message.guild.roles.cache.size} roles!`,
                    inline: true
                },
                {
                    name: "Emoji count: ",
                    value: message.guild.emojis.cache.size,
                    inline: true
                },
                {
                    name: "Boost count: ",
                    value: message.guild.premiumSubscriptionCount || '0',
                    inline: true
                },)
        message.channel.send({embeds: [embed]});
  },
};
