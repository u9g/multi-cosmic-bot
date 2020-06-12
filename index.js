const Discord = require("discord.js");
const mineflayer = require("mineflayer");
const client = new Discord.Client();
const helper = require("./helper.js");
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
client.login(require("./login.json")["discord-token"]);

const plugins = {
  bal: require("./balance.js"),
  abal: require("./allianceBalance.js"),
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
  }
});

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
