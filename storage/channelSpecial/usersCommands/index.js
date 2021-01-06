const prefix = "!"

async function changeCharFromSting(index, char, sting) {
    return sting.substr(0, index) + char + sting.substr(index + char.length);
}

module.exports.run = async (bot, message, args) => {
    if (message.content[0] !== prefix) {
        return;
    }
    try {
        let command = message.content.split(" ")[0].substr(1);
        bot.specialChannel.usersCommands.get(command).run(bot, message, args);
    } catch (e) {
        //console.log(e);
        //console.log("connais pas")
    }
}

module.exports.help = {
    name: "index"
};