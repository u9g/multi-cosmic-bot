const util = require("../util.js");
function start(acc, args, Discord, discord_msg, resolve, reject) {
  let data = {};
  let showingAllianceMembers = false;
  if (args === "") {
    reject(CreateHelpEmbed(Discord));
  } else {
    let bot = acc[0];
    bot.chat("/a who " + args);
    bot.on("message", (msg) => {
      const fullText = msg.toString();
      if (fullText.includes("----------- [ ")) {
        data.name = getAllianceName(fullText);
        showingAllianceMembers = true;
        data.members = [];
      } else if (fullText.includes("Enemies: ")) {
        showingAllianceMembers = false;
        data.balances = {};
        discord_msg.channel.send(createWaitEmbed(Discord, data.name));
        requestAllBalances(data.members, bot);
      } else if (showingAllianceMembers) {
        if (fullText.includes("Online Members: ")) {
          data.members = data.members.concat(
            fullText.substring("Online Members: ".length).split(", ")
          );
        } else if (fullText.includes("Offline Members: ")) {
          data.members = data.members.concat(
            fullText.substring("Offline Members: ".length).split(", ")
          );
        }
      } else if (fullText.includes("'s Balance")) {
        //showing a person's balance in chat
        const info = compileBalance(fullText);
        data.balances[info.ign] = info.balance;
        if (Object.entries(data.balances).length === data.members.length) {
          //IF ALL BALANCES ARE GRABBED
          bot.removeAllListeners(["message"]);
          resolve(makeEmbed(Discord, data));
        }
      } else if (
        fullText.startsWith("(!) Unable to find alliance from") ||
        fullText === "Usage: /alliance info <alliance/player>"
      ) {
        const embed = createNotAllianceEmbed(Discord);
        resolve(embed);
      }
    });
  }
}

function makeEmbed(Discord, data) {
  const name = data.name;
  const balances = Object.entries(data.balances);
  const description = createDescription(balances);

  return new Discord.MessageEmbed()
    .setTitle("**>a bal " + name + "**")
    .setDescription(description)
    .setTimestamp()
    .setColor("DARK_PURPLE");
}

function createDescription(balances) {
  let description = "";
  let counter = 1;
  const bals = sortBalancesArr(balances);
  bals.forEach((memberEntry) => {
    description += `${counter}. **${util.EscapeMarkdown(
      memberEntry[0]
    )}** has $${numberWithCommas(memberEntry[1])}\n`;
    counter++;
  });
  const total = createTotal(balances);
  description += `\n**Total**: **__$${numberWithCommas(total)}__**`;
  return description;
}

function sortBalancesArr(balances) {
  var sortable = [];
  for (const member of Object.entries(balances)) {
    let number = parseInt(removeCommas(member[1][1]));
    sortable.push([member[1][0], number]);
  }
  sortable.sort(function (a, b) {
    return a[1] - b[1];
  });
  return sortable.reverse();
}

function numberWithCommas(x) {
  return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}

function createTotal(balances) {
  let total = 0;
  balances.forEach(
    (memberEntry) => (total += parseInt(removeCommas(memberEntry[1])))
  );
  return total;
}

function removeCommas(x) {
  return x.replace(/,/g, "");
}

function compileBalance(fullText) {
  return {
    ign: fullText.substring(0, fullText.indexOf("'")),
    balance: fullText.substring(fullText.indexOf(":") + 3),
  };
}

function createNotAllianceEmbed(Discord) {
  return new Discord.MessageEmbed()
    .setColor("PURPLE")
    .setTitle(
      "Either the alliance requested doesn't exist or the user doesn't have an alliance."
    );
}

function getAllianceName(fullText) {
  return fullText.substring(
    fullText.indexOf("[") + 2,
    fullText.indexOf("]") - 1
  );
}

function requestAllBalances(users, bot) {
  for (const ix in users) {
    setTimeout(() => {
      bot.chat("/bal " + users[ix]);
    }, 75 * (ix + 1));
  }
}

function CreateHelpEmbed(Discord) {
  return new Discord.MessageEmbed()
    .setColor("PURPLE")
    .setTitle(">a bal [alliance / username]");
}

function createWaitEmbed(Discord, allianceName) {
  return new Discord.MessageEmbed()
    .setColor("PURPLE")
    .setTitle(
      `Please wait while balances are checked for ${allianceName} (~ 10 seconds)`
    );
}

module.exports = { start };
