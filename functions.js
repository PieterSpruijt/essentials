const  refreshInvites = async (bot, id) => {
  if (!id) {
    bot.guilds.cache.forEach(g => {
      g.invites.fetch().then(guildInvites => {
        invites[g.id] = guildInvites;
      }).catch(e => { });
    });
  } else {
    bot.guilds.cache.get(id).invites.fetch().then(guildInvites => {
      invites[id] = guildInvites;
    }).catch(e => { });
  }
  return;
}
module.exports.refreshInvites = refreshInvites