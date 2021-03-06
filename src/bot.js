const Discord = require(`discord.js`);
const fs = require(`fs`);
const config = require(`./config`);
const mongoose = require(`mongoose`);

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

/*
const { GiveawaysManager } = require(`discord-giveaways`);
const manager = new GiveawaysManager(bot, {
    storage: `./giveaways.json`,
    updateCountdownEvery: 5000,
    default: {
        botsCanWin: false,
        exemptPermissions: [`MANAGE_MESSAGES`, `ADMINISTRATOR`],
        embedColor: `YELLOW`,
        reaction: `🎉`
    }
});
bot.giveawaysManager = manager;
*/

bot.perms = Discord.Permissions.FLAGS;
bot.error = require(`./events/client/error`);
bot.config = config;
bot.commands = new Discord.Collection();
bot.aliases = new Discord.Collection();
bot.events = new Discord.Collection();
bot.snipes = new Discord.Collection();
bot.editsnipes = new Discord.Collection();
bot.queue = new Map();
bot.invites = [];
bot.categories = fs.readdirSync(`src/commands/`);

global.bot = bot;
global.functions = require('./functions');
global.package = require('../package.json');
global.models = require('./models/index.js');

mongoose.connect(config.mongoToken, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
});

require(`./handlers/command`)(bot);

const eventsDir = `src/` + `/events`;
if (!fs.existsSync(eventsDir) || !fs.lstatSync(eventsDir).isDirectory())
    throw new Error(`Could not find events directory! (should be in "./events")`);

for (const category of fs.readdirSync(`src/` + `/events`)) {
    const categoryPath = `src/` + `/events/` + category;
    if (!fs.lstatSync(categoryPath).isDirectory()) continue;
    for (const eventName of fs.readdirSync(categoryPath)) {
        if (!eventName.endsWith(`.js`)) continue;
        const eventHandler = require(`./events/` + category + `/` + eventName);

        bot.on(eventName.split(`.`)[0], eventHandler.bind(null, bot));
    }
}

bot.login(config.botToken);