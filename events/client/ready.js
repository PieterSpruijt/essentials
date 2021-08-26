const config = require('../../config.json');
const Discord = require('discord.js');
const model = require("../../models/reminder");
const userdb = require("../../models/userdb");

module.exports = async (bot) => {
  const {loadLanguages} = require('../../language');
  loadLanguages(bot);
  require('../../functions').refreshInvites(bot);
  const Topgg = require('@top-gg/sdk')
  const api = new Topgg.Api(require('../../token.json').dbltoken);
  api.postStats({
    serverCount: bot.guilds.cache.size,
    shardId: bot.shard.ids[0], // if you're sharding
    shardCount: bot.options.shardCount
  });
  setInterval(() => {
    api.postStats({
      serverCount: bot.guilds.cache.size,
      shardId: bot.shard.ids[0], // if you're sharding
      shardCount: bot.options.shardCount
    });
  }, 1800000) // post every 30 minutes
    let all = await model.find();
    if (all) {
      all.forEach((reminder) => {
        let endtime = reminder.endtime;
        setTimeout(async () => {
          let channel = ``;
          if (reminder.channel === `dm`) {
            channel = bot.users.cache.get(reminder.userid);
          } else {
            channel = bot.channels.cache.get(reminder.channel);
          }
          var userinfo = await userdb.findOne({ userid: reminder.userid });
          if (!userinfo) {
            userinfo = {
              userid: userid,
              developer: false,
              vip: false,
              banned: false,
              serverstaff: false,
              premiumgiver: false,
              premium: false,
              color: `#e91e63`,
              snipe: true,
            }
          }
    
          let embed = new Discord.MessageEmbed()
            .setTitle(`Reminder 🔔`)
            .addFields(
              { name: `Message:`, value: reminder.text }
            )
            .setColor(userinfo.color);
          channel.send(`<@${reminder.userid}>`, embed).catch(e => { });
          let deleted = await model.findOneAndDelete({ text: reminder.text, userid: reminder.userid, endtime: reminder.endtime, channel: reminder.channel });
        }, endtime - new Date().getTime());
      });
    }
  

  setInterval(() => {
    const index = Math.floor(Math.random() * (StatusList.length - 1) + 1);
    bot.user.setActivity(StatusList[index]);
  }, 30000); // Runs this every 30 seconds.
  const StatusList = [
    `${config.prefix}help`,
    `dsc.gg/essentialscanery`,
    `dsc.gg/essentials`,
    `dsc.gg/essentialshelp`,
  ];
};

