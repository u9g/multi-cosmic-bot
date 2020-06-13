const Discord = require("discord.js");
const mineflayer = require("mineflayer");
const client = new Discord.Client();
const helper = require("./helper.js");
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
  bal: require("./plugins/balance"),
  abal: require("./plugins/allianceBalance"),
  activity: require("./plugins/activity"),
  punishments: require("./plugins/getPunishments"),
};

client.on("message", (msg) => {
  const acc = accounts.find((x) => !x[1].busy);
  if (msg.content.startsWith(">bal")) {
    acc[1].busy = true;
    startBalanceCommand(acc, msg);
  } else if (msg.content.startsWith(">a bal")) {
    acc[1].busy = true;
    startAllianceBalanceCommand(acc, msg);
  } else if (
    msg.content.startsWith(">pun") ||
    msg.content.startsWith(">puns") ||
    msg.content.startsWith(">punishments")
  ) {
    startPunishmentsCommand(acc, msg);
  } else if (
    msg.content.startsWith(">activity") &&
    msg.author.id === "424969732932894721"
  ) {
    startActivityCommand(accounts, msg);
  }
});

function startPunishmentsCommand(acc, msg) {
  const args = msg.content.split(" ");
  return new Promise((resolve, reject) => {
    plugins.punishments.start(acc, args, Discord, resolve);
  }).then((embed) => msg.channel.send(embed));
}

function startActivityCommand(bots, msg) {
  return new Promise((resolve, reject) =>
    plugins.activity.start(bots, Discord, resolve)
  ).then((embed) => msg.channel.send(embed));
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
