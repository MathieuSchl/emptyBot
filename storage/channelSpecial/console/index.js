const config = require("../../config.json");
const path = config.location+"";
const system = "console";


module.exports.run = async (bot, message, args) => {
    bot.specialChannel[system].get("reloadConsole").run(bot);
}

module.exports.help = {
    name: "index"
};