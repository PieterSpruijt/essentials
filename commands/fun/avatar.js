const { MessageEmbed, UserFlags } = require("discord.js");
const { formatDate } = require("../../functions");
const userdb = require("../../models/userdb");

module.exports = {
  name: "avatar",
  description: "Get your own or someone else's avatar",
  usage: "avatar <mention/id>",
  category: "fun",
  aliases: ["userinfo", "my-info", "profile", "user"],
  run: async (bot, message, args, userinfo) => {
    let Embed = new MessageEmbed();
    let User = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
    let userinfo2 = await userdb.findOne({ userid: User.id });
    if (!userinfo2) {
      userinfo2 = {
        userid: User.id,
        developer: false,
        banned: false,
        snipe: true,
        color: `#e91e63`
      }
    }

    let inserver = bot.guilds.cache.get(`792753972255260702`).members.cache.get(User.id)

    let supportbadge = ``;
    let inserverbadge = ``;
    let SupportBoostbadge = ``;
    let pogbadge = ``;
    let snowybadge = ``;
    let beerbadge = ``;

    let support = false
    let SupportBoost = false;

    if (userinfo2.developer) support = true
    let botbadges = `None`

    if (inserver) {
      inserverbadge = bot.info.emojis.botbadges.SupportMember;
      SupportBoost = bot.guilds.cache.get(`792753972255260702`).members.cache.get(User.id).premiumSince;
      if (SupportBoost) SupportBoostbadge = bot.info.emojis.botbadges.SupportBoost;
    }
    support = userinfo2.developer;
    if (support) supportbadge = bot.info.emojis.botbadges.team + ` ` + bot.info.emojis.botbadges.developer;


    if (User.id === `412696023237132308`) beerbadge = bot.info.emojis.botbadges.beertjespecial;
    if (User.id === `628205772509151240`) pogbadge = `<:pog:808395058729713715>`;
    if (User.id === `792354566774980638`) snowybadge = `<:snowybadge:833335373378879558>`;

    botbadges = inserverbadge + supportbadge + SupportBoostbadge + pogbadge + snowybadge + beerbadge;
    if (!userinfo2.developer && !inserver && !SupportBoost) {
      botbadges = `None`
    }

    let roles = [];
    User.roles.cache.forEach((role) => {
      roles.push(`<@&${role.id}>`);
    });

    const flags = bot.info.emojis.badges
    const userFlags = User.user.flags.toArray() || null;
    Embed.setTitle(`${bot.users.cache.get(User.id).tag}'s Profile!`);
    Embed.setThumbnail(bot.users.cache.get(User.id).displayAvatarURL({ dynamic: true }));
    Embed.setColor(userinfo.color);
    Embed.addField(`:pencil2: Display Name`, message.guild.members.cache.get(User.id).displayName, true)
    Embed.addField(`🥇 Badges:`, userFlags.length ? userFlags.map(flag => flags[flag]).join(' ') : 'No badges', true)
    Embed.addField(`🥇 BotBadges:`, botbadges, true)
    Embed.addField(`:arrow_up: Highest role:`, `<@&${message.guild.members.cache.get(User.id).roles.highest.id}>`, true)
    Embed.addField(`📆Joined:`, formatDate(User.joinedAt), true)
    Embed.addField(`:id: ID`, User.id, true)
    Embed.addField(`👮‍♂️ Roles`, roles, true)
    message.channel.send(Embed)
  },
};
