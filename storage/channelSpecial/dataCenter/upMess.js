const {
    exec
} = require('child_process');
const config = require('../../config.json');


module.exports.run = async (bot, message, args) => {
    await bot.basicFunctions.get("rulesUpdate").run(bot);

    try{
        const channel = await bot.channels.fetch("791708217863307264");
        await bot.specialChannel.documents.get("nuke").run(bot, channel.lastMessage, null);
    }catch{
        console.log("Channel documentation is deleted");
    }

    try{
        const channel = await bot.channels.fetch("788867019289788457");
        await bot.specialChannel.createGame.get("nuke").run(bot, channel.lastMessage, null);
    }catch{
        console.log("Channel CreateNew game is deleted");
    }
};

module.exports.help = {
    name: "upMess"
};