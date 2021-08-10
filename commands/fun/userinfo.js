const { MessageEmbed } = require("discord.js");
const formatDate = function (date) {
  return new Intl.DateTimeFormat("en-US").format(date);
}
const userdb = require("../../models/userdb");

module.exports = {
  name: "userinfo",
  description: "Get your own or someone else's avatar",
  private: false,
  commandOptions: [
    {
      type: 6,
      name: `user`,
      description: `The user`,
      required: false
    }
  ],
  run: async (bot, interaction, userinfo) => {
    let Embed = new MessageEmbed();
    let User = interaction.data.options[0] ? interaction.data.options[0].member : interaction.members.user;
    let userinfo2 = await userdb.findOne({ userid: User.user.id });
    if (!userinfo2) {
      userinfo2 = {
        userid: User.user.id,
        developer: false,
        banned: false,
        snipe: true,
        color: `#e91e63`
      }
    }

    let inserver = await bot.guilds.cache.get(`792753972255260702`).members.fetch(User.user.id);

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
      inserverbadge = bot.config.emojis.botbadges.SupportMember;
      SupportBoost = bot.guilds.cache.get(`792753972255260702`).members.cache.get(User.id).premiumSince;
      if (SupportBoost) SupportBoostbadge = bot.config.emojis.botbadges.SupportBoost;
    }
    support = userinfo2.developer;
    if (support) supportbadge = bot.config.emojis.botbadges.team + ` ` + bot.config.emojis.botbadges.developer;


    if (User.user.id === `412696023237132308`) beerbadge = bot.config.emojis.botbadges.beertjespecial;
    if (User.user.id === `628205772509151240`) pogbadge = `<:pog:808395058729713715>`;
    if (User.user.id === `792354566774980638`) snowybadge = `<:snowybadge:833335373378879558>`;

    botbadges = inserverbadge + supportbadge + SupportBoostbadge + pogbadge + snowybadge + beerbadge;
    if (!userinfo2.developer && !inserver && !SupportBoost) {
      botbadges = `None`
    }

    let roles = [];
    User.roles.cache.forEach((role) => {
      roles.push(`<@&${role.id}>`);
    });

    const flags = bot.config.emojis.badges
    const userFlags = User.user.flags.toArray() || null;
    Embed.setTitle(`${User.user.tag}'s Profile!`);
    Embed.setThumbnail(User.displayAvatarURL({ dynamic: true }));
    Embed.setColor(userinfo.color);
    Embed.addField(`:pencil2: Display Name`, User.displayName, true)
    Embed.addField(`🥇 Badges:`, userFlags.length ? userFlags.map(flag => flags[flag]).join(' ') : 'No badges', true)
    Embed.addField(`🥇 BotBadges:`, botbadges, true)
    Embed.addField(`:arrow_up: Highest role:`, `<@&${User.roles.highest.id}>`, true)
    Embed.addField(`📆Joined:`, formatDate(User.joinedAt), true)
    Embed.addField(`:id: ID`, User.user.id, true)
    Embed.addField(`👮‍♂️ Roles`, roles, true)
    await interaction.editReply({ embeds: [Embed] })
  },
};
