
module.exports.run = async (bot)=>{
    let listCron = Array.from(bot.cronTable);
    for (let cron of listCron){
        cron[1].run(bot);
    }
};


module.exports.help = {
    name: "runCronTables"
};