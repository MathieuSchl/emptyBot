const config = require("../storage/config.json");

async function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
};

module.exports.run = async (bot) => {
    console.log(" ");
    console.log("Logged in as : " + bot.user.tag);
    console.log(" ");

    try {
        bot.basicFunctions.get("activity").run(bot);

        bot.enventIndex.get("cronTab").run(bot);
        bot.enventIndex.get("catchMessageInSpecialChannels").run(bot);

        bot.specialTextChannel.git.get("pull").ready(bot);

        bot.specialTextChannel["console"].get("reloadConsole").run(bot);
    } catch (e) {
        const disk = config.location.split("")[0];
        if (["C", "D", "E"].includes(disk)) {
            console.log("Error in ready.js")
            console.log(e)
        } else {
            await wait(10000);
            require("./cronTab.js").stop(bot);
            bot.destroy();
            await wait(5000);
            require('child_process').exec(`node ${config.location}/index.js`, function (msg) {
                console.log(msg)
            });
        }
    }
};


module.exports.help = {
    name: "ready"
};