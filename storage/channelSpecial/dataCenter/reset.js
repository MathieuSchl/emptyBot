


module.exports.run = async (bot, message, args) => {
    
    let teamData = await bot.basicFunctions.get("teamData").open(message.channel.id);
    teamData.data.pwd = "/";
    await bot.basicFunctions.get("teamData").write(message.channel.id,teamData);

    await bot.basicFunctions.get("wait").run(250);
    bot.specialChannel.dataCenter.get("ls").run(bot, message, args);
};

module.exports.help = {
    name: "reset"
};