const util = require("./util.js");
function start(accs, Discord, resolve) {
  let desc = "";
  for (const acc of accs) {
    desc += `ign: **${util.EscapeMarkdown(acc[0].username)}** busy: **${
      acc[1].busy
    }**\n`;
  }
  resolve(makeEmbed(Discord, desc));
}

module.exports = { start };

function makeEmbed(Discord, desc) {
  return new Discord.MessageEmbed()
    .setTitle("**Activity**")
    .setDescription(desc)
    .setTimestamp();
}
