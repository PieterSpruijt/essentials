const Timeout = new Set();
const xpTimeout = new Set();
const { Message, Client } = require("discord.js");
const Discord = require("discord.js");
const ms = require("ms");
const custom = require("../../models/custom");
const GuildSettings = require("../../models/settings");
const userdb = require("../../models/userdb");
const xpdb = require("../../models/xpdb");
const config = require("../../config.json");
const generator = require('generate-password');
const emoji = require("../../emojis.json");
const embed2 = require("../../embed.json");
const token = require("../../token.json");
const errorlog = new Discord.WebhookClient(token.webhooks["error-log"][0], token.webhooks["error-log"][1]);
const password = generator.generate({
  length: 10,
  numbers: true
});
/**
 * @param {Client} bot
 * @param {Message} message
 
 **/
module.exports = async (bot, message) => {
  if (message.author.bot) return;

  if (message.channel.type == `DM`) {
    let embed2 = new Discord.MessageEmbed()
      .setColor(`#e91e63`)
      .setDescription(`Message send to Developers!`);
    message.reply({embeds: [embed2]});

    let logs = new Discord.WebhookClient(token.webhooks["dm-logs"][0], token.webhooks["dm-logs"][1]);
    let embed = new Discord.MessageEmbed()
      .setTitle(`New DM to ${bot.user.tag}`)
      .setColor(`#e91e63`)
      .addField(`Author:`, message.author.tag)
      .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
      .addField(`Message:`, message.content)
      .addField(`Attatchment:`, message.attachments || `None`);
    logs.send({embeds: [embed]});
    return;
  }

  message.channel.messages.fetch();

  const afkmodel = require("../../models/afk");
  let isafk = await afkmodel.findOne({ gid: message.guild.id, userid: message.author.id });
  if (isafk) {
    await afkmodel.deleteOne({ gid: message.guild.id, userid: message.author.id });
    message.channel.send(`<@${message.author.id}>, Welcome back! I removed you afk.`).then(async (m) => {
      setTimeout(() => {
        m.delete().catch(e => {});  
      }, 5000);
    })
    if (message.member.displayName.startsWith(`[AFK] `)) {
      let name = message.member.displayName.replace(`[AFK] `, ``);
      message.member.setNickname(name).catch(e => {});
    }
  }
  message.mentions.users.forEach(async (u) => {
    if (
      !message.content.includes('@here') &&
      !message.content.includes('@everyone')
     ) {
       let isafk = await afkmodel.findOne({gid: message.guild.id, userid: u.id});
       if (isafk) {
         message.channel.send({embeds: [{description: `**${u.tag}** is afk: ${isafk.message}`, color: `RED`}]});
       }
     }
  })

  var storedSettings = await GuildSettings.findOne({ gid: message.guild.id });
  if (!storedSettings) {
    // If there are no settings stored for this guild, we create them and try to retrive them again.
    const newSettings = new GuildSettings({
      gid: message.guild.id,
      prefix: config.prefix,
      levels: true,
      economy: false,
    });
    await newSettings.save().catch(() => { });
    storedSettings = await GuildSettings.findOne({ gid: message.guild.id });
  }

  if (storedSettings.levels) {
    let randomxp = Math.floor(Math.random() * 15) + 10;
    var xp = await xpdb.findOne({ id: `${message.guild.id}_${message.author.id}` });
    if (!xp) {
      // If there are no settings stored for this guild, we create them and try to retrive them again.
      const newUser = new xpdb({
        id: `${message.guild.id}_${message.author.id}`,
        level: 0,
        xp: 0 + randomxp,
        reqXP: 100,
      });
      await newUser.save().catch(() => { });
      xpTimeout.add(`${message.guild.id}_${message.author.id}`);
      xp = await xpdb.findOne({ id: `${message.guild.id}_${message.author.id}` });
      setTimeout(() => {
        Timeout.delete(`${message.guild.id}_${message.author.id}`);
      }, 60000);
    } else {
      if (!xpTimeout.has(`${message.guild.id}_${message.author.id}`)) {
        xp = await xpdb.findOne({ id: `${message.guild.id}_${message.author.id}` });
        xpdb.findOne(
          { id: `${message.guild.id}_${message.author.id}` },
          async (err, data) => {
            if (err) throw err;
            data.xp = xp.xp + randomxp
            data.save();
          }
        );
        xpTimeout.add(`${message.guild.id}_${message.author.id}`);
        setTimeout(() => {
          xpTimeout.delete(`${message.guild.id}_${message.author.id}`);
        }, 60000);
      }
      if (xp.xp >= xp.reqXP) {
        xpdb.findOne(
          { id: `${message.guild.id}_${message.author.id}` },
          async (err, data) => {
            if (err) throw err;
            data.xp = 0,
              data.reqXP = xp.reqXP + 100,
              data.level = xp.level + 1
            data.save();
          }
        ).then(async () => {
          message.channel.send(`**GG** <@${message.author.id}>, you are now level **${xp.level + 1}**`).catch(err => { })
          const rewards = require("../../models/lvlreward");
          var rewardlist = await rewards.find({ gid: message.guild.id, level: xp.level + 1 });
          if (rewardlist) {
            rewardlist.forEach(r => {
              let role = message.guild.roles.cache.get(r.role);
              if (role) {
                message.member.roles.add(role).catch(e => { });
              }

            })
          }
        }
        )
      }
    }
  }







  if (!message.channel.permissionsFor(message.guild.me).has("SEND_MESSAGES")) return;
  const escapeRegex = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const prefixRegex = new RegExp(`^(<@!?${bot.user.id}>|${escapeRegex(storedSettings.prefix)})\\s*`);
  if (!prefixRegex.test(message.content.toLowerCase())) return;
  const [, matchedPrefix] = message.content.toLowerCase().match(prefixRegex);
  /*
  if (message.content.toLowerCase().indexOf(storedSettings.prefix) !== 0) return;
    /*message.member = await message.guild.fetchMember(message);
    */

  if (!message.guild) return;
  const args = message.content.slice(matchedPrefix.length).trim().split(/ +/g);
  const cmd = args.shift().toLowerCase();

  if (cmd.length === 0) {
    let InfoEmbed = new Discord.MessageEmbed()
      .setColor(`GREEN`)
      .setDescription(`My prefix in this server is \`${storedSettings.prefix}\` or <@${bot.user.id}>`)
      .addFields(
        { name: `Support`, value: `[Support server](${config.support_server})`, inline: true },
      )
    return message.channel.send({embeds: [infoEmbed]});
  }

  let command = bot.commands.get(cmd);
  if (!command) command = bot.commands.get(bot.aliases.get(cmd));

  if (command) {
    let userinfo = await userdb.findOne({ userid: message.author.id });
    if (!userinfo) {
      userinfo = {
        userid: message.author.id,
        developer: false,
        banned: false,
        color: `#e91e63`,
        snipe: true,
      }
    }
    if (userinfo.banned) {
      return message.channel.send({ embeds: [{ description: `${emoji.normal.alert} | ooh ooh, You are banned by the developers of this bot!!`, color: "#e91e63" } ]});
    }
    if (command.timeout) {
      if (Timeout.has(`${message.author.id}${command.name}`)) {
        message.reply({ embed: { title: `Take a break`, description: `Ooh Ooh, You are on cooldown\nThe default cooldown of this command is \`${ms(command.timeout)}\`` } });
      } else {
        message.userinfo = userinfo;
        command.run(bot, message, args, userinfo).catch(err => {
          let embed = new Discord.MessageEmbed()
            .setTitle(password)
            .addField(`Member:`, message.author.tag + `(${message.author.id})`)
            .addField(`Message`, message.content)
            .addField(`ERROR`, `\`\`\`${err}\`\`\``)
            .addField(`STACK`, `\`\`\`${err.stack}\`\`\``);
          errorlog.send({embeds: [embed]}).catch(error => { })
          message.channel.send({ embeds: [{ title: `ERROR`, description: `an error has occurred\nSend this to the developers: \`${password}\`You can contact the developers [by joining the support server](${config.support_server})` } ]});
        });
        Timeout.add(`${message.author.id}${command.name}`);
        setTimeout(() => {
          Timeout.delete(`${message.author.id}${command.name}`);
        }, command.timeout);
      }
    } else {
      message.userinfo = userinfo;
      command.run(bot, message, args, userinfo).catch(err => {
        let embed = new Discord.MessageEmbed()
            .setTitle(password)
            .addField(`Member:`, message.author.tag + `(${message.author.id})`)
            .addField(`Message`, message.content)
            .addField(`ERROR`, `\`\`\`${err}\`\`\``)
            .addField(`STACK`, `\`\`\`${err.stack}\`\`\``);
        errorlog.send({embeds: [embed]}).catch(error => { })
        message.channel.send({ embeds: [{ title: `ERROR`, description: `an error has occurred\nSend this to the developers: \`${password}\`You can contact the developers [by joining the support server](${config.support_server})` } ]});
      });
    }
  } else {
    custom.findOne(
      { Guild: message.guild.id, Command: cmd },
      async (err, data) => {
        if (err) throw err;
        if (data) return message.channel.send(data.Content);
        else return;
      }
    );
  }
};