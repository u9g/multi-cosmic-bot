function sendJoin(bot) {
  bot.once("spawn", () => {
    console.log(`${bot.username} has logged in.`);
    bot.chat("/join");
  });
}

module.exports = { sendJoin };
