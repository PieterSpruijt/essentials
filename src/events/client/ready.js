const { AutoPoster } = require('topgg-autoposter')

module.exports = async function (bot) {

    //Top.gg poster
    AutoPoster(bot.config.topggToken, bot);
    setInterval(() => {
        AutoPoster(global.config.topggToken, bot);
    }, 1800000) // post every 30 minutes

    //refreshing invites
    try {
        global.functions.refreshInvites(bot, `859137745812586506`);
    } catch (e) {
        //error
    }
}