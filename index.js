const Discord = require("discord.js");
const mineflayer = require("mineflayer");
const client = new Discord.Client();
const helper = require("./helper.js");
const { handler } = require("./commands");
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
  pointstop: require("./plugins/isPointsTop"),
  help: require("./plugins/helpCommand"),
  istop: require("./plugins/isTop"),
  puntop: require("./plugins/punishmentsTop.js"),
};

client.on("message", (msg) => {
  const acc = accounts.find((x) => !x[1].busy);
  if (msg.content.startsWith(">bal")) {
    if (!acc) {
      msg.channel.send(createBotBusyEmbed());
    } else {
      handleCooldown(msg, "bal").then(
        () => {
          acc[1].busy = true;
          startBalanceCommand(acc, msg);
        },
        () => {}
      );
    }
  } else if (msg.content.startsWith(">a bal")) {
    if (!acc) {
      msg.channel.send(createBotBusyEmbed());
    } else {
      handleCooldown(msg, "abal").then(
        () => {
          acc[1].busy = true;
          startAllianceBalanceCommand(acc, msg);
        },
        () => {}
      );
    }
  } else if (
    (msg.content.startsWith(">pun") && !msg.content.includes("top")) ||
    (msg.content.startsWith(">puns") && !msg.content.includes("top")) ||
    (msg.content.startsWith(">punishments") && !msg.content.includes("top"))
  ) {
    startPunsCommand(acc, msg);
  } else if (msg.content === ">is points top") {
    if (!acc) {
      msg.channel.send(createBotBusyEmbed());
    } else {
      handleCooldown(msg, "ispointstop").then(
        () => {
          acc[1].busy = true;
          startPointsTopCommand(acc, msg);
        },
        () => {}
      );
    }
  } else if (msg.content === ">help") {
    startHelpCommand(msg);
  } else if (msg.content.startsWith(">is top")) {
    if (!acc) {
      msg.channel.send(createBotBusyEmbed());
    } else {
      handleCooldown(msg, "istop").then(
        () => {
          acc[1].busy = true;
          startIsTop(acc, msg);
        },
        () => {}
      );
    }
  } else if (
    msg.content.startsWith(">puntop") ||
    msg.content.startsWith(">punstop") ||
    msg.content.startsWith(">punishmentstop")
  ) {
    startPunsTopCommand(acc, msg);
  } else if (
    msg.content.startsWith(">activity") &&
    msg.author.id === "424969732932894721"
  ) {
    startActivityCommand(accounts, msg);
  }
});

function handleCooldown(msg, type) {
  return new Promise(function (resolve, reject) {
    handler(msg, type, resolve, reject);
  });
}

function createBotBusyEmbed() {
  return new Discord.MessageEmbed().setTitle(
    "The bot is currently busy, please wait a few moments and try again."
  );
}

function startIsTop(acc, msg) {
  return new Promise((resolve, reject) => {
    const args = msg.content.substring(">is top".length).trim();
    plugins.istop.start(acc, args, Discord, resolve);
  }).then((embed) => {
    acc[1].busy = false;
    msg.channel.send(embed);
  });
}

function startHelpCommand(msg) {
  return new Promise((resolve, reject) => {
    plugins.help.start(Discord, resolve);
  }).then((embed) => msg.channel.send(embed));
}

function startPointsTopCommand(acc, msg) {
  const args = msg.content.split(" ");
  return new Promise((resolve, reject) => {
    plugins.pointstop.start(acc, args, Discord, resolve);
  }).then((embed) => {
    acc[1].busy = false;
    msg.channel.send(embed);
  });
}

function startPunsCommand(acc, msg) {
  const args = msg.content.split(" ");
  return new Promise((resolve, reject) => {
    plugins.punishments.start(args, Discord, resolve);
  }).then((embed) => msg.channel.send(embed));
}
function startPunsTopCommand(acc, msg) {
  const args = msg.content.split(" ")[1];
  return new Promise((resolve, reject) => {
    plugins.puntop.start(args, Discord, resolve);
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
    plugins.abal.start(acc, args, Discord, msg, resolve)
  ).then((embed) => {
    acc[1].busy = false;
    msg.channel.send(embed);
  });
}
