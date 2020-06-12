const userDoesntExist = /(\(\!\)\s+(\w+)\s+(\w+)\s+(\w+)\s+(\w+)\s+(\w+)\s+(\w+)\!)/;

function start(acc, args, Discord, resolve) {
  if (args === "") {
    resolve(CreateHelpEmbed(Discord));
  } else {
    let bot = acc[0];
    bot.chat("/bal " + args);
    bot.on("message", (msg) => {
      if (msg.toString().includes("'s Balance")) {
        const info = createInfo(msg);
        bot.removeAllListeners(["message"]);
        resolve(CreateEmbed(Discord, info));
      } else if (userDoesntExist.test(msg.toString())) {
        bot.removeAllListeners(["message"]);
        resolve(CreateNotBalanceEmbed(Discord));
      }
    });
  }
}

function createInfo(msg) {
  const fullText = msg.toString();
  const info = {
    ign: fullText.substring(0, fullText.indexOf("'")),
    balance: fullText.substring(fullText.indexOf(":") + 3),
  };
  return info;
}

function CreateNotBalanceEmbed(Discord) {
  return new Discord.MessageEmbed()
    .setColor("PURPLE")
    .setTitle("The user either doesn't exist or doesn't have a ballance.");
}
function CreateHelpEmbed(Discord) {
  return new Discord.MessageEmbed()
    .setColor("PURPLE")
    .setTitle(">bal [username]");
}
function CreateEmbed(Discord, info) {
  return new Discord.MessageEmbed()
    .setColor("PURPLE")
    .setTitle("`" + info.ign + "`" + " has $" + info.balance);
}

module.exports = { start };
