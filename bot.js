const Discord = require("discord.js");
const fs = require("fs");
const config = require("./config.json");
const prefix = config.prefix;
const otherIntents = [
  Discord.Intents.FLAGS.DIRECT_MESSAGES,
  Discord.Intents.FLAGS.GUILDS,
  Discord.Intents.FLAGS.GUILD_MESSAGES,
  Discord.Intents.FLAGS.GUILD_VOICE_STATES,
  Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS
]
const bot = new Discord.Client({
  allowedMentions: { parse: ['users', 'roles'], repliedUser: true },
  partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
   intents: otherIntents
});
const mongoose = require("mongoose");


bot.info = [];
bot.config = config;
bot.error = require("./models/error");
bot.info.emojis = require("./emojis.json");
bot.info.ids = require("./ids.json");
bot.info.embed = require("./embed.json");
//bot.x = require('./language');
bot.perms = Discord.Permissions.FLAGS;


bot.prefix = prefix;
bot.commands = new Discord.Collection();
bot.aliases = new Discord.Collection();
bot.events = new Discord.Collection();
bot.snipes = new Discord.Collection();
bot.editsnipes = new Discord.Collection();
bot.queue = new Map();
bot.categories = fs.readdirSync("./commands/");
const token = require(`./token.json`);

mongoose.connect(token.Mongo, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});
["command"].forEach((handler) => {
  require(`./handlers/${handler}`)(bot);
});
const { GiveawaysManager } = require("discord-giveaways");

const manager = new GiveawaysManager(bot, {
  storage: "./giveaways.json",
  updateCountdownEvery: 5000,
  default: {
    botsCanWin: false,
    exemptPermissions: ["MANAGE_MESSAGES", "ADMINISTRATOR"],
    embedColor: `YELLOW`,
    reaction: "🎉"
  }
});

bot.giveawaysManager = manager;

const DB = require("disbots.net");
const dblist = new DB("O4D1nKhMqWZX1hpLj0RdbIiLnYeU3xaH8aXHT9fnA6N8CoxZt6XYuwD5WtPyl6vp", bot);
dblist.on("postServers", () => {
  console.log("Server count posted! (disbots.net)");
});
dblist.on("postShards", () => {
  console.log("Shards count posted! (disbots.net)");
});

for (const category of fs.readdirSync(__dirname + '/events')) {
  const categoryPath = __dirname + '/events/' + category;
  if (!fs.lstatSync(categoryPath).isDirectory()) continue;
  for (const eventName of fs.readdirSync(categoryPath)) {
    if (!eventName.endsWith('.js')) continue;
    const eventHandler = require('./events/' + category + '/' + eventName);

    bot.on(eventName.split('.')[0], eventHandler.bind(bot));
  }
}

bot.login(token.Token);
