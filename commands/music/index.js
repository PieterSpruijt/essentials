module.exports = {
    name: `music`,
    description: "Play music!",
    private: false,
    commandOptions: [
        {
          "name": "play",
          "description": "Play Music",
          "type": 1,
          options: [
            {
              type: 3,
              name: "name",
              description: "Name of the song or youtube url",
              required: true
            },
          ],
        },
        {
          "name": "loop",
          "description": "Disable/enable loop!",
          "type": 1,
        },
        {
          "name": "lyrics",
          "description": "Get lyrics of now playing music!",
          "type": 1,
          options: [
            {
              type: 3,
              name: "song",
              description: "song name or yt url",
              required: false
            },
          ],
        },
        {
          "name": "nowplaying",
          "description": "Get current song!",
          "type": 1,
        },
        {
          "name": "pause",
          "description": "Pause music!",
          "type": 1,
        },
        {
          "name": "queue",
          "description": "get music queue!",
          "type": 1,
        },
        {
          "name": "remove",
          "description": "Remove music from queue!",
          "type": 1,
          options: [
            {
              type: 10,
              name: "number",
              description: "Number in queue to remove",
              required: true
            },
          ],
        },
        {
          "name": "resume",
          "description": "Resume music!",
          "type": 1,
        },
        {
          "name": "shuffle",
          "description": "Shuffle the queue!",
          "type": 1,
        },
        {
          "name": "skip",
          "description": "Skip the current song!",
          "type": 1,
        },
        {
          "name": "skipto",
          "description": "Skip to song in queue!",
          "type": 1,
          options: [
            {
              type: 10,
              name: "number",
              description: "Queue number of song",
              required: true
            },
          ],
        },
        {
          "name": "stop",
          "description": "Stop the queue!",
          "type": 1,
        },
        {
          "name": "volume",
          "description": "Set the volume of the music music!",
          "type": 1,
          options: [
            {
              type: 10,
              name: "number",
              description: "Volume to set to",
              required: false
            }
          ],
        },
      ],
      run: async (bot, interaction, userinfo)  => {
        let command = interaction.options._subcommand;
        require(`./${command}.js`).run(bot, interaction, userinfo);
      }
}