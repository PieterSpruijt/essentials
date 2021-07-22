var setTitle = require('console-title');
setTitle('Essentials | Stable');
const { ShardingManager } = require('discord.js');
const Discord = require('discord.js');
const token = require('./token.json');
const startlogs = new Discord.WebhookClient(token.webhooks['start-logs'][0], token.webhooks['start-logs'][1]);
const shardlogs = new Discord.WebhookClient(token.webhooks['shard-logs'][0], token.webhooks['shard-logs'][1]);
let embed2 = require('./embed.json');

const manager = new ShardingManager('./bot.js', {
    totalShards: 1,
    token: token.Token,
    respawn: true
});
console.log(`© Pieter Spruijt Development ${new Date().getFullYear()}`)
manager.on('shardCreate', shard => {
    let embed = new Discord.MessageEmbed()
        .setTitle(`Launched shard ${shard.id}/${manager.totalShards - 1}`)
        .setColor('BLUE')
        .setFooter(embed2.footer_name)
        .setTimestamp();
    startlogs.send(embed);
    shard.on('ready', () => {
        let embed = new Discord.MessageEmbed()
        .setTitle(`Shard ${shard.id} ready`)
        .setColor('GREEN')
        .setFooter(embed2.footer_name)
        .setTimestamp();
    startlogs.send(embed);
    console.log(`Shard ${shard.id}/${manager.totalShards -1} is online!`);
    })
    shard.on('disconnect', (a, b) => {

        let embed = new Discord.MessageEmbed()
            .setTitle(`Shard ${shard.id} disconnected`)
            .setColor('ORANGE')
            .setFooter(embed2.footer_name)
            .setTimestamp();
        shardlogs.send(embed);
    })
    shard.on('reconnecting', (a, b) => {
        let embed = new Discord.MessageEmbed()
            .setTitle(`Shard ${shard.id} reconnecting`)
            .setColor('GREEN')
            .setFooter(embed2.footer_name)
            .setTimestamp();
        shardlogs.send(embed);
    })
    shard.on("death", (process) => {
        let embed = new Discord.MessageEmbed()
            .setTitle(`Shard ${shard.id} died`)
            .addField(`PID:`, process.pid)
            .addField(`Exitcode:`, process.exitCode)
            .setColor('RED')
            .setFooter(embed2.footer_name)
            .setTimestamp();
        shardlogs.send(embed);
    });
});
manager.spawn()