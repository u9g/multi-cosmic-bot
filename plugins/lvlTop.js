const util = require("./util.js");

function start(acc, args, Discord, resolve) {
  if (args === "") {
    startListener(1);
  } else if (isNaN(args) || parseInt(args) > 333) {
    resolve(createHelpEmbed(Discord));
  } else {
    startListener(parseInt(args));
  }

  function startListener(number) {
    let bot = acc[0];
    let counter = 0;
    let info = [];
    let showingPeople = false;
    bot.chat("/level top " + number);
    bot.on("message", (msg) => {
      const fullText = msg.toString();
      if (fullText.includes("Top Player Levels")) {
        showingPeople = true;
      } else if (showingPeople) {
        const ign = getIgn(fullText);
        const level = getLevel(fullText);
        const number = fullText.substring(0, fullText.indexOf("."));
        info.push([ign, level, number]);
        counter++;
      }
      if (counter === 15) {
        showingPeople = false;
        const embed = createEmbed(Discord, info, args);
        bot.removeAllListeners(["message"]);
        resolve(embed);
      }
    });
  }
}

function getLevel(fullText) {
  return fullText.substring(
    fullText.indexOf("Level") + "Level".length + 1,
    fullText.indexOf(")")
  );
}

function getIgn(fullText) {
  let ign = fullText
    .substring(0, fullText.indexOf("("))
    .substring(0, fullText.lastIndexOf(" "))
    .trim();
  ign = ign.substring(ign.lastIndexOf(" ")).trim();
  return ign;
}

function createEmbed(Discord, info, args) {
  const desc = createDescription(info);
  let title = "";
  if (!isNaN(args) && parseInt(args) !== 1 && args !== "") {
    title = `**>lvl top ${parseInt(args)}**`;
  } else if (args === "") {
    title = `**>lvl top**`;
  } else {
    title = `**>lvl top**`;
  }
  return new Discord.MessageEmbed()
    .setTitle(title)
    .setDescription(desc)
    .setColor("PURPLE")
    .setTimestamp();
}
function createHelpEmbed(Discord) {
  return new Discord.MessageEmbed()
    .setTitle(">lvl top [optional number <= 20]")
    .setColor("PURPLE");
}

function createDescription(info) {
  let desc = "";
  for (const user of info) {
    const ign = util.EscapeMarkdown(user[0]);
    const lvl = user[1];
    const num = user[2];
    desc += `${num}. **${ign}** has player level **${lvl}**\n`;
  }
  return desc;
}

module.exports = { start };
