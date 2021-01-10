const config = require("../storage/config.json");
const fs = require("fs");
const path = config.location + "storage/soundFunctions/data/";


module.exports.run = async (bot) => {
    console.log(" ");
    console.log("Logged in as : " + bot.user.tag);
    console.log(" ");

    try {
        bot.basicFunctions.get("activity").run(bot);

        bot.enventIndex.get("cronTab").run(bot);
        bot.enventIndex.get("catchMessageInSpecialChannels").run(bot);

        bot.specialTextChannel.dataCenter.get("pull").ready(bot);

        bot.specialTextChannel["console"].get("reloadConsole").run(bot);
    } catch (e) {
        console.log(e);
        //bot.specialTextChannel.dataCenter.get("reboot").run(bot, message, args);
    }
};


module.exports.help = {
    name: "ready"
};