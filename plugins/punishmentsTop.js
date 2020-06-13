function start(args, Discord, resolve) {
  if (!args[1] || args[1] === "") {
    resolve(createHelpEmbed(Discord));
  }
  let arr, desc;
  switch (args) {
    case "ban":
      arr = require(`./lbs/banTop.json`);
      desc = createDescription(arr, args);
      resolve(createEmbed(Discord, desc, args));
      break;
    case "mute":
      arr = require(`./lbs/muteTop.json`);
      desc = createDescription(arr, args);
      resolve(createEmbed(Discord, desc, args));
      break;
    case "warn":
      arr = require(`./lbs/warnTop.json`);
      desc = createDescription(arr, args);
      resolve(createEmbed(Discord, desc, args));
      break;
    case "kick":
      arr = require(`./lbs/kickTop.json`);
      desc = createDescription(arr, args);
      resolve(createEmbed(Discord, desc, args));
      break;
    default:
      resolve(createHelpEmbed(Discord));
      break;
  }
}

function createDescription(arr, arg) {
  let description = "";
  for (let i = 0; i < 10; i++) {
    description += `${i + 1}. **${arr[i][0]} has ${arr[i][1]} ${arg[0]}(s)**\n`;
  }
  return description;
}

function createEmbed(Discord, description, type) {
  return new Discord.MessageEmbed()
    .setColor("PURPLE")
    .setTitle(">puntop " + type)
    .setDescription(description)
    .setFooter("Last updated: probably not yesterday");
}

function createHelpEmbed(Discord) {
  return new Discord.MessageEmbed()
    .setColor("PURPLE")
    .setTitle(">puntop [ban/mute/warn/kick]");
}

module.exports = { start };
