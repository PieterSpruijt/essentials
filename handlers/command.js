const moment = require("moment");
const timestamp = `[${moment().format("YYYY-MM-DD HH:mm:ss")}]`;
const ids = require('../ids.json')
const embed2 = require('../embed.json');
const Discord = require('discord.js');
const { readdirSync } = require("fs");
module.exports = (bot) => {
  readdirSync("./commands/").map((dir) => {
    const commands = readdirSync(`./commands/${dir}/`).map((cmd) => {
      let pull = require(`../commands/${dir}/${cmd}`);
      //console.log(`${timestamp} Loaded command ${pull.name}`);
      bot.commands.set(pull.name, pull);
      if (pull.aliases) {
        pull.aliases.map((p) => bot.commands.set(p, pull));
      }
    });
  });
};
