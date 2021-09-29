//const { AutoPoster } = require('topgg-autoposter')

module.exports = async function (bot) {
    bot.user.setActivity('essentialsbot.ga/donate', { type: 'WATCHING', shardId: 0 });
    setInterval(() => {
        bot.user.setActivity('essentialsbot.ga/donate', { type: 'WATCHING', shardId: 0 });
    }, 600000);
/*
    //Top.gg poster
    AutoPoster(bot.config.topggToken, bot);
    setInterval(() => {
        AutoPoster(global.config.topggToken, bot);
    }, 1800000) // post every 30 minutes
*/
    //refreshing invites
    try {
        global.functions.refreshInvites(bot);
    } catch (e) {
        //error
    }
}