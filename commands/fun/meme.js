const https = require('https');
const Discord = require('discord.js');
const url = 'https://www.reddit.com/r/meme/hot/.json?limit=100'

module.exports = {
  name: "meme",
  description: "Get a random meme!",
  category: "fun",
  usage: "`meme`",
  timeout: 5000,
  run: async (bot, message, args, userinfo) => {
    https.get(url, (result) => {
      var body = ''
      result.on('data', (chunk) => {
          body += chunk
      })

      result.on('end', () => {
          var response = JSON.parse(body)
          var index = response.data.children[Math.floor(Math.random() * 99) + 1].data

          if (index.post_hint !== 'image') {

              var text = index.selftext
              const textembed = new Discord.MessageEmbed()
                  .setTitle(title)
                  .setColor(userinfo.color)
                  .setURL(`https://reddit.com/${link}`)
                  .setFooter(`👍${ups} | 💬${coms}`)

              message.channel.send({embeds: [textembed]})
          }

          var image = index.preview.images[0].source.url.replace('&amp;', '&')
          var title = index.title
          var ups = index.ups
          var coms = index.num_comments
          var link = 'https://reddit.com' + index.permalink
          var subRedditName = index.subreddit_name_prefixed

          if (index.post_hint !== 'image') {
              const textembed = new Discord.MessageEmbed()
                  .setTitle(title)
                  .setColor(userinfo.color)
                  .setURL(`https://reddit.com/${link}`)
                  .setFooter(`👍${ups} | 💬${coms}`)

              message.channel.send({embeds: [textembed]})
          }
          const imageembed = new Discord.MessageEmbed()
              .setTitle(title)
              .setImage(image)
              .setColor(userinfo.color)
              .setURL(`https://reddit.com/${link}`)
              .setFooter(`👍${ups} | 💬${coms}`)
          message.channel.send({embeds: [imageembed]})
      }).on('error', function (e) {})
  })
  },
};
