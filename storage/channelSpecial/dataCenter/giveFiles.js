const Discord = require("discord.js");
const config = require('../../config.json');
const fs = require("fs");
let request = require(`request`);
const pathToAdd = config.location + "storage/data/";


module.exports.run = async (bot, message, args) => {
    const teamData = await bot.basicFunctions.get("teamData").open(message.channel.id);
    const realpwd = pathToAdd + teamData.data.pwd;

    var attachmentsKeys = Array.from(message.attachments.keys());

    for (let index = 0; index < attachmentsKeys.length; index++) {
        const url = message.attachments.get(attachmentsKeys[0]).url;
        const name = message.attachments.get(attachmentsKeys[0]).name;


        request.get(url)
            .on('error', console.error)
            .pipe(fs.createWriteStream(realpwd + name));

        await bot.basicFunctions.get("wait").run(1000);
    }

    await bot.basicFunctions.get("wait").run(100);
    bot.specialChannel.dataCenter.get("ls").run(bot, message, args);
};

module.exports.help = {
    name: "giveFiles"
};