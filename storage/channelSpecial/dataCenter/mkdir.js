const config = require('../../config.json');
const fs = require("fs");
const pathToAdd = config.location + "storage/data/"


module.exports.run = async (bot, message, args)=>{
    const teamData = await bot.basicFunctions.get("teamData").open(message.channel.id);
    const realpwd = pathToAdd + teamData.data.pwd;

    require('child_process').exec('mkdir '+realpwd+args[1], function (msg) { console.log(msg) });

    await bot.basicFunctions.get("wait").run(100);
    bot.specialChannel.dataCenter.get("ls").run(bot,message,args);
};

module.exports.help = {
    name: "mkdir"
};