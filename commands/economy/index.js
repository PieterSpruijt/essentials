module.exports = {
  name: `economy`,
  description: "Economy games!",
  private: false,
  commandOptions: [
    {
      "name": "balance",
      "description": "Coin balance!",
      "type": 1,
      options: [
        {
          type: 6,
          name: "user",
          description: "The User",
          required: false
        },
      ],
    },
    {
      "name": "addbal",
      "description": "Give someone money!",
      "type": 1,
      options: [
        {
          type: 6,
          name: `user`,
          description: `The User`,
          required: true,
        },
        {
          type: 10,
          name: `amount`,
          description: `Amount of coins`,
          required: true,
        }
      ]
    },
    {
      "name": "beg",
      "description": "Beg for money",
      "type": 1,
    },
    {
      "name": "deposit",
      "description": "Deposit money to the bank",
      "type": 1,

      options: [
        {
          type: 10,
          name: `amount`,
          description: `Amount of coins`,
          required: true
        }
      ]
    },
    {
      "name": "pay",
      "description": "Pay someone money",
      "type": 1,
      options: [
        {
          type: 6,
          name: `user`,
          description: `The user to pay`,
          required: true
        },
        {
          type: 10,
          name: `amount`,
          description: `Amount of coins`,
          required: true
        }
      ]
    },
    {
      "name": "removebal",
      "description": "Remove someones user balance!",
      "type": 1,
      options: [
        {
          type: 6,
          name: `user`,
          description: `The User`,
          required: true,
        },
        {
          type: 10,
          name: `amount`,
          description: `Amount of coins`,
          required: true,
        }
      ]
    },
    {
      "name": "rob",
      "description": "Rob someone",
      "type": 1,
      options: [
        {
          type: 6,
          name: `user`,
          description: `The user to rob`,
          required: true
        }
      ]
    },
    {
      "name": "slots",
      "description": "Play a game slots and earn/lose coins",
      "type": 1,
      options: [
        {
          type: 10,
          name: `amount`,
          description: `Amount of coints to use`,
          required: true
        }
      ]
    },
    {
      "name": "withdraw",
      "description": "Withdraw money from the bank",
      "type": 1,
      options: [
        {
          type: 10,
          name: `amount`,
          description: `Amount of coints to withdraw`,
          required: true
        }
      ]
    },
    {
      "name": "work",
      "description": "Work and earn coins",
      "type": 1,
    },

  ],
  run: async (bot, interaction, userinfo) => {
    let command = interaction.options._subcommand;
    require(`./${command}.js`).run(bot, interaction, userinfo);
  },
}