const { readdirSync } = require("fs");

module.exports = async function (bot) {
  readdirSync("./commands/").map((dir) => {
    const commands = readdirSync(`./commands/${dir}/`).map((cmd) => {
      let pull = require(`../commands/${dir}/${cmd}`);

      let command = pull;
      bot.commands.set(pull.name, pull);

      bot.api.applications(`775055776854441985`).guilds(`846707934040948776`).commands.post({
        data: {
          name: command.name,
          description: command.description,
          options: command.commandOptions,
          default_permission: true
          
        }
      }).then(console.log(`Loaded command ${command.name}`))
    });
  });
};
