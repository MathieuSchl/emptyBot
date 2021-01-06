const config = require("../storage/config.json");
const fs = require("fs");
const path = config.location + "storage/soundFunctions/data/";


module.exports.run = async (bot) => {
    console.log(" ");
    console.log("Logged in as : " + bot.user.tag);
    console.log(" ");

    bot.basicFunctions.get("activity").run(bot);

    bot.enventIndex.get("runCronTables").run(bot);
    bot.enventIndex.get("catchMessageInSpecialChannels").run(bot);

    bot.specialChannel.dataCenter.get("pull").ready(bot);

    bot.specialChannel["console"].get("reloadConsole").run(bot);
};


module.exports.help = {
    name: "ready"
};