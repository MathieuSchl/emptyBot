var CronJob = require('cron').CronJob;

module.exports.run = async (bot) => {
    new CronJob('0 */10 8-23,00 * * *', function () {
        bot.specialTextChannel.dataCenter.get("pull").ready(bot);
        await bot.basicFunctions.get("wait").run(1000);
        bot.specialTextChannel["console"].get("reloadConsole").run(bot);
    }).start();
};


module.exports.help = {
    name: "ex"
};