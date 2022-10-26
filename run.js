const Discord = require('discord.js');

const otherIntents = [
    // Guild message Intents
    Discord.Intents.FLAGS.GUILD_MESSAGES,
    Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,

    // Direct message Intents
    Discord.Intents.FLAGS.DIRECT_MESSAGES,
    Discord.Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,


    //Guild Intents
    Discord.Intents.FLAGS.GUILDS,
    Discord.Intents.FLAGS.GUILD_VOICE_STATES,
    Discord.Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
    Discord.Intents.FLAGS.GUILD_BANS,
    Discord.Intents.FLAGS.GUILD_INVITES,
    Discord.Intents.FLAGS.GUILD_MEMBERS,    
];
const bot = new Discord.Client({
    allowedMentions: { parse: ["users", "roles"], repliedUser: true },
    partials: ["MESSAGE", "CHANNEL", "REACTION"],
    intents: otherIntents
});
bot.on('ready', async () => {
    console.log(`${bot.user.username} is online!`);
    bot.guilds.cache.get(`707021383288488047`).leave();
})

bot.login(`OTA3OTk3ODI1ODI3MjMzOTI0.YYvU3w.gtSYMf8qwX2L2JhZBQN0-gq0awk`);