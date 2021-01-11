


module.exports.run = async (bot, message, dataSpecialChannel) => {
    dataSpecialChannel.data.pwd = "/";
    await bot.basicFunctions.get("dataSpecialTextChannel").write(message.channel.id,dataSpecialChannel);

    await bot.basicFunctions.get("wait").run(250);
    bot.specialTextChannel.dataCenter.get("ls").run(bot, message, dataSpecialChannel);
};

module.exports.help = {
    name: "reset"
};