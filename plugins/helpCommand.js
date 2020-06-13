const cmds = require("../disc_commands.json");

function start(Discord, resolve) {
  const plugins = Object.entries(cmds).map((x) => x[1]);
  const description = createDescription(plugins);
  const embed = createEmbed(Discord, description);
  resolve(embed);
}

function createDescription(plugins) {
  let description = "";
  for (const plugin of plugins) {
    if (plugin.cmd_name !== "") {
      if (typeof plugin.cmd_name !== "string") {
        description += `**${plugin.cmd_name[0]}**: ${plugin.description}\n`;
      } else {
        description += `**${plugin.cmd_name}**: ${plugin.description}\n`;
      }
    }
  }
  return description;
}

function createEmbed(Discord, description) {
  return new Discord.MessageEmbed()
    .setTitle("**Commands Menu**")
    .setDescription(description)
    .setColor("PURPLE")
    .setTimestamp()
    .setFooter("Bot made by U9G", "https://minotar.net/avatar/U9G");
}

module.exports = { start };
