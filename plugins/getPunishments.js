const util = require("./util.js"); //util.EscapeMarkdown;
const helper = require("./getPunishmentsHelper.js");
function start(args, Discord, resolve) {
  if (!args[1] || args[1] === "") {
    resolve(createHelpEmbed(Discord));
  } else {
    const ign = args[1];
    helper.getPunishments(ign).then((punishments) => {
      const description = makeDescription(punishments);
      const embed = createEmbed(Discord, description, ign);
      resolve(embed);
    });
  }
}

function createEmbed(Discord, description, ign) {
  return new Discord.MessageEmbed()
    .setTitle(`${util.EscapeMarkdown(ign)}'s punishments`)
    .setColor("PURPLE")
    .setDescription(description)
    .setTimestamp();
}

function makeDescription(punishments) {
  let str = "";

  if (punishments["WARN"]) {
    str += "**- " + punishments["WARN"] + " warns**\n";
  } else if (!punishments["WARN"]) {
    str += "**- " + 0 + " warns**\n";
  }

  if (punishments["MUTE"]) {
    str += "**- " + punishments["MUTE"] + " mutes**\n";
  } else if (!punishments["MUTE"]) {
    str += "**- " + 0 + " mutes**\n";
  }

  if (punishments["BAN"]) {
    str += "**- " + punishments["BAN"] + " bans**\n";
  } else if (!punishments["BAN"]) {
    str += "**- " + 0 + " bans**\n";
  }

  if (punishments["KICK"]) {
    str += "**- " + punishments["KICK"] + " kicks**\n";
  } else if (!punishments["KICK"]) {
    str += "**- " + 0 + " kicks**\n";
  }

  return str;
}

function createHelpEmbed(Discord, util) {
  return new Discord.MessageEmbed()
    .setColor("PURPLE")
    .setTitle(">punishments [player name]");
}

module.exports = { start };
