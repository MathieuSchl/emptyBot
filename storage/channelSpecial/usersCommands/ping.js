

module.exports.run = async (bot, message, args) => {
    message.channel.send("pong");
    return;
}

module.exports.help = {
    name: "ping"
};