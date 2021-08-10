const { AutoPoster } = require('topgg-autoposter')

module.exports = async function (bot) {
    let poster = AutoPoster(bot.config.topggToken, bot);
    poster.start()

    setInterval(() => {
        let poster = AutoPoster(bot.config.topggToken, bot);
        poster.start()
    }, 1800000) // post every 30 minutes
}