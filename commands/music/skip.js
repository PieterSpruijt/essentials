const {createAudioResource, StreamType } = require('@discordjs/voice');
const ytdl = require('ytdl-core-discord');

module.exports = {
  name: `skip`,
  description: `Skip the current song!`,
  private: false,
  commandOptions: [

    {
      type: 10,
      name: "tosong",
      description: "Queue number of song",
      required: false
    },

  ],
  run: async (bot, interaction) => {
    if (interaction.data.options[0]) {
      const queue = bot.queue.get(interaction.guild.id);
      if (!queue) return bot.error("There is no queue.", bot, interaction);
      if (interaction.data.options[0].value > queue.songs.length)
        return bot.error(`The queue is only ${queue.songs.length} songs long!`, bot, interaction);

      queue.playing = true;

      if (queue.loop) {
        for (let i = 0; i < interaction.data.options[0].value - 2; i++) {
          queue.songs.push(queue.songs.shift());
        }
      } else {
        queue.songs = queue.songs.slice(interaction.data.options[0].value - 2);
      }
      try {
        const resource = createAudioResource(await ytdl(`https://www.youtube.com/watch?v=${queue.songs[0].id}`), { inputType: StreamType.Opus, inlineVolume: true });
        resource.volume.setVolume(queue.volume / 5)
        queue.songs[0].resource = resource
        queue.player.play(resource)
      } catch (error) {
        console.log(error)
        queue.connection.destroy()
        bot.queue.delete(interaction.guild.id);
        await interaction.editRely({ content: `No songs left, ended queue` });
      }

      await interaction.editRely({ content: `${interaction.member.user.tag} ⏭ skipped \`${interaction.data.options[0].value - 1}\` songs` });
      return
    }
    const channel = interaction.member.voice.channel;
    if (!channel) return bot.error('You should join a voice channel before using this command!', bot, interaction);
    let queue = bot.queue.get(interaction.guild.id)
    if (!queue) return bot.error(`There is nothing in the queue right now!`, bot, interaction);

    if (!queue.songs[0]) {
      queue.connection.destroy()
      bot.queue.delete(interaction.guild.id);
      await interaction.editRely({ content: `No songs left, ended queue` });
    } else {
      queue.songs.shift()
      const resource = createAudioResource(await ytdl(`https://www.youtube.com/watch?v=${queue.songs[0].id}`), { inputType: StreamType.Opus, inlineVolume: true });
      resource.volume.setVolume(queue.volume / 5)
      queue.songs[0].resource = resource
      queue.player.play(resource)
    }
  },
};

