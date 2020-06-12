const Discord = require("discord.js");
const mineflayer = require("mineflayer");
const client = new Discord.Client();
const helper = require("./helper.js");
const activity = require("./plugins/activity.js");
const { start } = require("./plugins/balance.js");
const logins = Object.entries(require("./configs/login.json").logins).map(
  (x) => x[1]
);
let accounts = [];

function startBots() {
  for (const login of logins) {
    accounts.push([
      new mineflayer.createBot({
        host: "cosmicsky.com",
        port: 25565,
        username: login[0],
        password: login[1],
      }),
      { busy: false },
    ]);
  }
}

function join(accounts) {
  accounts.forEach((account) => {
    const bot = account[0];
    helper.sendJoin(bot);
  });
}

startBots();
join(accounts);
client.login(require("./configs/login.json")["discord-token"]);

const plugins = {
  bal: require("./plugins/balance.js"),
  abal: require("./plugins/allianceBalance.js"),
  activity: require("./plugins/activity"),
};

client.on("message", (msg) => {
  if (msg.content.startsWith(">bal")) {
    const acc = accounts.find((x) => !x[1].busy);
    acc[1].busy = true;
    startBalanceCommand(acc, msg);
  } else if (msg.content.startsWith(">a bal")) {
    const acc = accounts.find((x) => !x[1].busy);
    acc[1].busy = true;
    startAllianceBalanceCommand(acc, msg);
  } else if (
    msg.content.startsWith(">activity") &&
    msg.author.id === "424969732932894721"
  ) {
    startActivityCommand(accounts, Discord, msg);
  }
});

function startActivityCommand(bots, Discord, msg) {
  return new Promise((resolve, reject) =>
    activity.start(bots, Discord, resolve)
  ).then((embed) => {
    msg.channel.send(embed);
  });
}

function startBalanceCommand(acc, msg) {
  const args = msg.content.substring(">bal".length + 1);
  return new Promise((resolve, reject) =>
    plugins.bal.start(acc, args, Discord, resolve)
  ).then((embed) => {
    acc[1].busy = false;
    msg.channel.send(embed);
  });
}

function startAllianceBalanceCommand(acc, msg) {
  const args = msg.content.substring(">a bal".length + 1);
  return new Promise((resolve, reject) =>
    plugins.abal.start(acc, args, Discord, msg, resolve, reject)
  ).then(
    (embed) => {
      acc[1].busy = false;
      msg.channel.send(embed);
    },
    function error(embed) {
      acc[1].busy = false;
      msg.channel.send(embed);
    }
  );
}
