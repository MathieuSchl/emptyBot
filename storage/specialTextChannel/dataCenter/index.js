const config = require('../../config.json');
const fs = require("fs");

module.exports.run = async (bot, message, args) => {
    //console.log(bot.specialChannel.game)

    try {
        if (Array.from(message.attachments.keys()).length !== 0) {
            bot.specialTextChannel.dataCenter.get("giveFiles").run(bot, message, args);
        } else {
            bot.specialTextChannel.dataCenter.get(args[0]).run(bot, message, args);
        }
    } catch (error) {
        //console.log(error)
        bot.specialTextChannel.dataCenter.get("ls").run(bot, message, args);
    }
}

module.exports.help = {
    name: "index"
};