const Discord = require('discord.js');
const evallog = new Discord.WebhookClient({ id: global.bot.config.webhooks['eval-log'][0], token: global.bot.config.webhooks['eval-log'][1] });

const clean = text => {
  if (typeof (text) === "string")
    return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
  else
    return text;
}

module.exports = {
  name: "eval",
  description: "Evaluate code",
  category: "developer",
  private: false,
  developer: true,
  commandOptions: [
    {
      type: 3,
      name: `code`,
      description: `Code to evaluate`,
      required: true
    }
  ],
  run: async (bot, interaction, userinfo) => {
    if (!userinfo.developer) return bot.error(`You are not allowed to use the eval (e) command\n This command is only for the Essentials developer team!`, bot, interaction);
    const code = interaction.data.options[0].value;
    try {
      let evaled = eval(code);

      if (typeof evaled !== "string")
        evaled = require("util").inspect(evaled);
      await interaction.editReply({
        embeds: [{
          fields: [
            { name: "📥 Input code", value: `\`\`\`js\n${code}\`\`\`` },
            { name: "📤 Output code", value: `\`\`\`powershell\n${clean(evaled)}\`\`\`` }
          ],
          color: `GREEN`
        }], code: "xl"
      }).catch(async (err) => {
        await interaction.editReply({
          embeds: [{
            fields: [
              { name: "📥 Input code", value: `\`\`\`js\n${code}\`\`\`` },
              { name: "📤 Output code", value: `Error:\n\`\`\`powershell\n${err}\n${err.stack}\`\`\`` }
            ],
            color: `GREEN`
          }], code: "xl"
        }).catch(() => { });
      });
      evallog.send({
        embeds: [{
          fields: [
            { name: "New code", value: `${interaction.user.id} (${interaction.user.tag})` },
            { name: "📥 Input code", value: `\`\`\`js\n${code}\`\`\`` },
            { name: "📤 Output code", value: `\`\`\`powershell\n${clean(evaled)}\`\`\`` }
          ],
          color: `GREEN`
        }], code: "xl"
      }).catch((err) => {
        evallog.send({
          embeds: [{
            fields: [
              { name: "New code", value: `${interaction.user.id} (${interaction.user.tag})` },
              { name: "📥 Input code", value: `\`\`\`js\n${code}\`\`\`` },
              { name: "📤 Output code", value: `Error:\n\`\`\`powershell\n${err}\n${err.stack}\`\`\`` }
            ],
            color: `GREEN`
          }], code: "xl"
        }).catch(() => { });
      });
    } catch (err) {
      await interaction.editReply({
        embeds: [{
          fields: [
            { name: "📥 Input code", value: `\`\`\`js\n${code}\`\`\`` },
            { name: "📤 Output code", value: `Error:\n\`\`\`powershell\n${err}\n${err.stack}\`\`\`` }
          ],
          color: `GREEN`
        }], code: "xl"
      }).catch(() => { });
      evallog.send({
        embeds: [{
          fields: [
            { name: "New code", value: `${interaction.user.id} (${interaction.user.tag})` },
            { name: "📥 Input code", value: `\`\`\`js\n${code}\`\`\`` },
            { name: "📤 Output code", value: `Error:\n\`\`\`powershell\n${err}\n${err.stack}\`\`\`` }
          ],
          color: `GREEN`
        }], code: "xl"
      }).catch(() => { });
    }
  },
};
