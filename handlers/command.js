const fs = require("fs");

module.exports = async function (bot) {
  fs.readdirSync("./commands/").map(async (dir) => {
    const commands = fs.readdirSync(`./commands/${dir}/`).map((cmd) => {
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
      }).then(console.log(`Loaded command ${command.name}`));
    });



  });

  /*
  fs.readdirSync("./commands/").map(async (dir) => {
    if (dir === `botinfo`) {
      const commands = fs.readdirSync(`./commands/${dir}/`).map((cmd) => {
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

    } else {
      let pull = require(`../commands/${dir}/index.js`);
      let command = pull;
      bot.commands.set(pull.name, pull);
      bot.api.applications(`775055776854441985`).guilds(`846707934040948776`).commands.post({
        data: {
          name: pull.name,
          description: pull.description,
          options: pull.commandOptions,
          default_permission: true

        }
      }).then(console.log(`Loaded command ${pull.name}`))
    }

  });
  */
};
