const refreshInvites = async (bot, id) => {
    if (!id) {
        await bot.guilds.cache.forEach(g => {
            g.invites.fetch().then(guildInvites => {
                Array.from(guildInvites).forEach(i => {
                    bot.invites.push({
                        uses: i[1].uses,
                        code: i[1].code
                    });
                })
            }).catch(() => { });
        });
    } else {
        let g = await bot.guilds.fetch(id);
        if (!g) return;
        g.invites.fetch().then(guildInvites => {
            Array.from(guildInvites).forEach(i => {
                bot.invites.push({
                    uses: i[1].uses,
                    code: i[1].code
                });
            })
        }).catch(() => { });
        return;
    }
    await refreshInvites(bot, `859137745812586506`);
}

module.exports = {
    refreshInvites,
}