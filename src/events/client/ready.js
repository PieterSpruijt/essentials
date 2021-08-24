const { AutoPoster } = require('topgg-autoposter')

module.exports = async function (bot) {
    AutoPoster(bot.config.topggToken, bot);

    setInterval(() => {
        AutoPoster(global.config.topggToken, bot);
    }, 1800000) // post every 30 minutes
    const refreshInvites = async (bot, id) => {
        if (!id) {
            await bot.guilds.cache.forEach(g => {
                g.invites.fetch().then(guildInvites => {
                    bot.invites[g.id] = Array.prototype(guildInvites);
                }).catch(() => { });
            });
        } else {
            await bot.guilds.cache.get(id).invites.fetch().then(guildInvites => {
                bot.invites[id] = Array.prototype(guildInvites);
            }).catch(() => { }).then((data) => {
                console.log(data);
            })
        }
        return;
    }
    await refreshInvites(bot, `859137745812586506`);
}