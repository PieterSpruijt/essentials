const model = require('./models/settings');
const lang = require('./lang.json');
const fs = require('fs');

// { 'guildId': 'language' }
const guildLanguages = {}

const newLanguage = (language, textID, translation) => {
    let translations = require('./lang.json');
    if (!translations.translations[textID]) translations.translations[textID] = {};
    translations.translations[textID][language] = translation;
    fs.writeFile('./lang.json', JSON.stringify(translations, null, 2), (err) => {
        if (err) console.log(err)
      });
}

const loadLanguages = async (bot) => {
    try {
        for (const guild of bot.guilds.cache) {
            const guildId = guild[0]

            const result = await model.findOne({
                gid: guildId
            })

            guildLanguages[guildId] = result ? result.language : 'english' 
        }
    } finally {
    }
}

const setLanguage = (guild, language) => {
    guildLanguages[guild.id] = language.toLowerCase()
}

module.exports = (guild, textId) => {
    if (!lang.translations[textId]) {
        throw new Error(`Unknown text ID "${textId}"`)
    }

    const selectedLanguage = guildLanguages[guild.id].toLowerCase()

    return lang.translations[textId][selectedLanguage]
}

module.exports.loadLanguages = loadLanguages
module.exports.setLanguage = setLanguage
module.exports.newLanguage = newLanguage