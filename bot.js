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

bot.on("guildCreate", async (guild) => {
  require("./events/guild/guildCreate")(guild, bot);
});
const DB = require("disbots.net");
const dblist = new DB("O4D1nKhMqWZX1hpLj0RdbIiLnYeU3xaH8aXHT9fnA6N8CoxZt6XYuwD5WtPyl6vp", bot);
dblist.on("postServers", () => {
  console.log("Server count posted! (disbots.net)");
});
dblist.on("postShards", () => {
  console.log("Shards count posted! (disbots.net)");
});
bot.on("debug", console.log)
bot.on("ready", () => {
  require("./events/client/ready")(bot);
  const Topgg = require('@top-gg/sdk')
  const api = new Topgg.Api(require('./token.json').dbltoken);
  api.postStats({
    serverCount: bot.guilds.cache.size,
    shardId: bot.shard.ids[0], // if you're sharding
    shardCount: bot.options.shardCount
  });
  setInterval(() => {
    api.postStats({
      serverCount: bot.guilds.cache.size,
      shardId: bot.shard.ids[0], // if you're sharding
      shardCount: bot.options.shardCount
    });
  }, 1800000) // post every 30 minutes
});
bot.on("messageCreate", async (message) => {

  if (message.channel.type === 'GUILD_TEXT') {
    message.member; //-- GuildMember based
    message.author; //-- User based
    require("./events/guild/message")(bot, message)
  } else if (message.channel.type == `DM`) {
    let embed2 = new Discord.MessageEmbed()
      .setColor(`#e91e63`)
      .setDescription(`Message send to Developers!`);
    message.reply({embeds: [embed2]});

    let logs = new Discord.WebhookClient(token.webhooks["dm-logs"][0], token.webhooks["dm-logs"][1]);
    let embed = new Discord.MessageEmbed()
      .setTitle(`New DM to ${bot.user.tag}`)
      .setColor(`#e91e63`)
      .addField(`Author:`, message.author.tag)
      .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
      .addField(`Message:`, message.content)
      .addField(`Attatchment:`, message.attachments || `None`);
    logs.send({embeds: [embed]});
  }
});
bot.on("messageDelete", async (message) => {
  require("./events/guild/messageDelete")(message);
});
bot.on("messageReactionAdd", (reaction, user) => {
  require("./events/guild/messageReactionAdd")(reaction, user);
});
bot.on("messageReactionRemove", (reaction, user) => {
  require("./events/guild/messageReactionRemove")(reaction, user);
});

//bot events
bot.on("channelCreate", async (channel) => {
  require("./events/guild/channelCreate")(channel);
});
bot.on("channelDelete", async (channel) => {
  require("./events/guild/channelDelete")(channel);
});
bot.on("channelUpdate", async (oldChannel, newChannel) => {
  require("./events/guild/channelUpdate")(oldChannel, newChannel);
});
bot.on("emojiDelete", async (emoji) => {
  require("./events/guild/emojiDelete")(emoji);
});
bot.on("emojiCreate", async (emoji) => {
  require("./events/guild/emojiCreate")(emoji);
});
bot.on("messageUpdate", async (oldMessage, newMessage) => {
  require("./events/guild/messageUpdate")(oldMessage, newMessage);
});
bot.on("channelPinsUpdate", async (channel) => {
  require("./events/guild/channelPinsUpdate")(channel);
});
bot.on("guildBanAdd", async (guild, user) => {
  require("./events/guild/guildBanAdd")(guild, user);
});
bot.on("guildBanRemove", async (guild, user) => {
  require("./events/guild/guildBanRemove")(guild, user);
});
bot.on("roleDelete", async (role) => {
  require("./events/guild/roleDelete")(role);
});
bot.on("roleCreate", async (role) => {
  require("./events/guild/roleCreate")(role);
});
bot.on("guildDelete", async (guild) => {
  require("./events/guild/guildDelete")(guild, bot);
});

bot.login(token.Token);
