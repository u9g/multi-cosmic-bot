const Discord = require("discord.js");
const { client, accounts } = require("./index");
const plugins = {
  bal: require("./plugins/balance"),
  abal: require("./plugins/allianceBalance"),
  activity: require("./plugins/activity"),
  punishments: require("./plugins/getPunishments"),
  pointstop: require("./plugins/isPointsTop"),
  help: require("./plugins/helpCommand"),
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
    startPunsCommand(acc, msg);
  } else if (msg.content === ">is points top") {
    acc[1].busy = true;
    startPointsTopCommand(acc, msg);
  } else if (msg.content === ">help") {
    startHelpCommand(msg);
  } else if (
    msg.content.startsWith(">activity") &&
    msg.author.id === "424969732932894721"
  ) {
    startActivityCommand(accounts, msg);
  }
});

function startHelpCommand(msg) {
  return new Promise((resolve, reject) => {
    plugins.help.start(Discord, resolve);
  }).then((embed) => msg.channel.send(embed));
}

function startPointsTopCommand(acc, msg) {
  const args = msg.content.split(" ");
  return new Promise((resolve, reject) => {
    plugins.pointstop.start(Discord, resolve);
  }).then((embed) => {
    acc[1].busy = false;
    msg.channel.send(embed);
  });
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
