const axios = require("axios");

module.exports = {
  name: "docs",
  description: "Get discord.js docs",
  category: "info",
  usage: "`docs [arg]`",
  run: async (bot, message, args) => {
    let url = `http://djsdocs.sorta.moe/v2/embed?src=stable&q=${encodeURIComponent(
      args[0]
      )}`;

    axios
    .get(url)
    .then((embed) => {
      const { data } = embed;
      if (data && !data.error) {
        message.channel.send({embed: data});
      } else {
        message.channel.send({embed: {description: `Could not find that documentation!`, color: `#7289da`}})
      }
    })
    .catch(err => {
      console.log(err)
    })
  },
};
