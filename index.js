var setTitle = require('console-title');
setTitle('Essentials | Stable');
const Discord = require('discord.js');
const config = require('./config');


const startlogs = new Discord.WebhookClient({ id: config.webhooks['start-logs'][0], token: config.webhooks['start-logs'][1] });
const shardlogs = new Discord.WebhookClient({ id: config.webhooks['shard-logs'][0], token: config.webhooks['shard-logs'][1] });


const manager = new Discord.ShardingManager('./bot.js', {
    totalShards: 1,
    token: config.botToken,
    respawn: true
});
console.log(`© Pieter Spruijt Development ${new Date().getFullYear()}`)

manager.on('shardCreate', shard => {
    let embed = new Discord.MessageEmbed()
        .setTitle(`Launched shard ${shard.id}/${manager.totalShards - 1}`)
        .setColor('BLUE')
        .setFooter(config.embeds.footer_name)
        .setTimestamp();
    startlogs.send({ embeds: [embed] });
    shard.on('ready', () => {
        let embed = new Discord.MessageEmbed()
            .setTitle(`Shard ${shard.id} ready`)
            .setColor('GREEN')
            .setFooter(config.embeds.footer_name)
            .setTimestamp();
        startlogs.send({ embeds: [embed] });
        console.log(`Shard ${shard.id}/${manager.totalShards - 1} is online!`);
    })
    shard.on('disconnect', () => {

        let embed = new Discord.MessageEmbed()
            .setTitle(`Shard ${shard.id} disconnected`)
            .setColor('ORANGE')
            .setFooter(config.embeds.footer_name)
            .setTimestamp();
        shardlogs.send({ embeds: [embed] });
    })
    shard.on('reconnecting', () => {
        let embed = new Discord.MessageEmbed()
            .setTitle(`Shard ${shard.id} reconnecting`)
            .setColor('GREEN')
            .setFooter(config.embeds.footer_name)
            .setTimestamp();
        shardlogs.send({ embeds: [embed] });
    })
    shard.on("death", (process) => {
        let embed = new Discord.MessageEmbed()
            .setTitle(`Shard ${shard.id} died`)
            .addField(`PID:`, process.pid.toString())
            .addField(`Exitcode:`, process.exitCode.toString())
            .setColor('RED')
            .setFooter(config.embeds.footer_name)
            .setTimestamp();
        shardlogs.send({ embeds: [embed] });
    });
});

manager.spawn()
