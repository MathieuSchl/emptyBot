const Discord = require("discord.js");


module.exports.run = async (bot) => {
    let listCron = Array.from(bot.cronTable);
    if (listCron.length !== 0) bot["cronTab"] = new Discord.Collection();

    for (let cron of listCron) {
        cron[1].run(bot);
    }
};

module.exports.stop = async (bot) => {
    try {
        let listCron = Array.from(bot.cronTable);

        for (let cron of listCron) {
            bot.cronTab.get(cron[0]).stop();
        }
    } catch {}
};


module.exports.help = {
    name: "cronTab"
};