const Discord = require(`discord.js`);
const fs = require(`fs`);
const config = require(`./config`);
const mongoose = require(`mongoose`);

const otherIntents = [
    Discord.Intents.FLAGS.DIRECT_MESSAGES,
    Discord.Intents.FLAGS.GUILDS,
    Discord.Intents.FLAGS.GUILD_MESSAGES,
    Discord.Intents.FLAGS.GUILD_VOICE_STATES,
    Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS
];
const bot = new Discord.Client({
    allowedMentions: { parse: [`users`, `roles`], repliedUser: true },
    partials: [`MESSAGE`, `CHANNEL`, `REACTION`],
    intents: otherIntents
});

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

bot.perms = Discord.Permissions.FLAGS;
bot.error = require(`./events/client/error`);
bot.giveawaysManager = manager;
bot.config = config;
bot.commands = new Discord.Collection();
bot.aliases = new Discord.Collection();
bot.events = new Discord.Collection();
bot.snipes = new Discord.Collection();
bot.editsnipes = new Discord.Collection();
bot.queue = new Map();
bot.categories = fs.readdirSync(`src/commands/`);
global.bot = bot;
global.package = require('../package.json');

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