var CronJob = require('cron').CronJob;


module.exports.run = async (bot) => {

    //modify tour cron here

    const name = "pullRealod";
    const job = new CronJob('0 */10 8-23,00 * * *', async function () {
        bot.specialTextChannel.git.get("pull").ready(bot);
        await bot.basicFunctions.get("wait").run(1000);
        bot.specialTextChannel["console"].get("reloadConsole").run(bot);
    });

    //Stop


    return {
        "name": name,
        "job": job
    };
};


module.exports.help = {
    name: name
};