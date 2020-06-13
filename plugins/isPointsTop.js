const util = require("./util.js");

function start(acc, args, Discord, resolve) {
  let bot = acc[0];
  let counter = 0;
  let info = [];
  let showingPeople = false;
  requestAllIsTops(5, bot);
  bot.on("message", (msg) => {
    const fullText = msg.toString();
    if (fullText.includes("Top Player Islands")) {
      showingPeople = true;
    } else if (showingPeople) {
      const ign = getIgn(fullText);
      const points = getIslandPoints(msg);
      info.push([ign, points]);
      counter++;
    }
    if (counter === 15) {
      showingPeople = false;
      counter = 0;
    }
    if (info.length === 75) {
      const sorted = sortArr(info);
      const embed = createEmbed(Discord, sorted, util);
      resolve(embed);
      info = [];
    }
  });
}

function getIgn(fullText) {
  let ign = fullText
    .substring(0, fullText.indexOf("("))
    .substring(0, fullText.lastIndexOf(" "))
    .trim();
  ign = ign.substring(ign.lastIndexOf(" ")).trim();
  return ign;
}

function getIslandPoints(msg) {
  let value = msg.extra[0].hoverEvent.value.text;
  value = value.substring(value.indexOf("Island Points"));
  value = value.substring(value.indexOf("§b") + 2, value.indexOf("\n"));
  return value;
}

function createEmbed(Discord, info) {
  const desc = createDescription(info);
  return new Discord.MessageEmbed()
    .setTitle("**>is points top**")
    .setDescription(desc)
    .setColor("PURPLE")
    .setTimestamp();
}

function requestAllIsTops(count, bot) {
  for (let i = 1; i <= count; i++) {
    setTimeout(() => {
      bot.chat("/is top " + i);
    }, 100 * i);
  }
}

function createDescription(info) {
  let desc = "";
  for (let i = 0; i < 10; i++) {
    const ign = util.EscapeMarkdown(info[i][0]);
    const points = info[i][1];
    desc += `${i + 1}. **${ign}**: ${points}\n`;
  }
  return desc;
}

function sortArr(info) {
  let sort = info;
  sort.sort(
    (a, b) => parseInt(removeCommas(a[1])) - parseInt(removeCommas(b[1]))
  );
  return sort.reverse();
}

function removeCommas(x) {
  return x.replace(/,/g, "");
}

module.exports = { start };
