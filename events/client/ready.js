const { AutoPoster } = require('topgg-autoposter')

module.exports = async function (bot) {
    const poster = AutoPoster(bot.config.topggToken, bot);
    setInterval(() => {
        const poster = AutoPoster(bot.config.topggToken, bot);
    }, 1800000) // post every 30 minutes
}