var CronJob = require('cron').CronJob;
const name = "pullRealod";

module.exports.run = async (bot) => {
    const job = new CronJob('0 */10 8-23,00 * * *', async function () {
        bot.specialTextChannel.git.get("pull").ready(bot);
        await bot.basicFunctions.get("wait").run(1000);
        bot.specialTextChannel["console"].get("reloadConsole").run(bot);
    });
    bot.cronTab.set(name, job);
    bot.cronTab.get(name).start();
};


module.exports.help = {
    name: name
};