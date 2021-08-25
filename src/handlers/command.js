const fs = require("fs");

module.exports = async function (bot) {
  fs.readdirSync("src/commands/").map(async (dir) => {
    //const commands = 
    fs.readdirSync(`src/commands/${dir}/`).map((cmd) => {
      let pull = require(`../commands/${dir}/${cmd}`);

      let command = pull;
      bot.commands.set(pull.name, pull)
      console.log(`Loaded command ${command.name}`);


    });



  });
  /*
  let command = require(`../commands/config/setup.js`);
  let allguilds = await bot.guilds.fetch();
  allguilds.forEach(g => {
    bot.api.applications(`775055776854441985`).guilds(g.id).commands.post({
      data: {
        name: command.name,
        description: command.description,
        options: command.commandOptions,
        default_permission: true

      }
    }).catch(() => {}}).then(console.log(`Loaded setup command in guild ${g.id}`));
  });
  */
  /*
  fs.readdirSync("src/commands/").map(async (dir) => {
    //const commands = 
    fs.readdirSync(`src/commands/${dir}/`).map((cmd) => {
      let pull = require(`../commands/${dir}/${cmd}`);

      let command = pull;
      bot.commands.set(pull.name, pull);
      if (command.developer) {
        console.log(`Loaded command ${command.name}`);
      } else {
        bot.api.applications(`775055776854441985`).guilds(`859137745812586506`).commands.post({
          data: {
            name: command.name,
            description: command.description,
            options: command.commandOptions,
            default_permission: true

          }
        }).then(console.log(`Loaded command ${command.name}`));
      }


    });



  });
  */
};
