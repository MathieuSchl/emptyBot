const fs = require("fs");
const config = require("../config.json");

async function getEveryoneId(bot, guildId) {
    let roles = Array.from(await bot.guilds.cache.get(guildId).roles.cache);
    for (let i = 0; i < roles.length; i++) {
        if (roles[i][1].name === "@everyone") {
            return roles[i][1].id;
        }
    }
    return null;
}

module.exports.run = async (bot, message, dataSpecialChannel) => {
    if (!config.idBotAdmins.includes(message.author.id)) return;

    if (config.idConsoleChannel != null || config.idPullChannel != null) {
        message.delete();
        return;
    };

    //Create category
    const guild = message.guild;
    let options = {
        "type": "category",
        permissionOverwrites: [{
            id: await getEveryoneId(bot, message.guild.id),
            deny: ['VIEW_CHANNEL'],
        }, ]
    }
    const category = await guild.channels.create(bot.user.username, options).then((channel) => {
        return channel;
    })

    //Create all channel needed
    options = {
        "type": "text",
        "parent": category.id
    }

    const gitChannel = await guild.channels.create("git", options).then((channel) => {
        return channel;
    })

    const dataCenterChannel = await guild.channels.create("dataCenter", options).then((channel) => {
        return channel;
    })

    const consoleChannel = await guild.channels.create("console", options).then((channel) => {
        return channel;
    })

    //Create all data Files
    const gitChannelData = {
        "id": gitChannel.id,
        "type": "git"
    };
    donnees = JSON.stringify(gitChannelData);
    fs.writeFileSync(config.location + "/storage/data/specialChannelList/" + gitChannel.id + ".json", donnees);

    const dataCenterChannelData = {
        "id": dataCenterChannel.id,
        "type": "dataCenter",
        "data": {
            "pwd": "/"
        }
    };
    donnees = JSON.stringify(dataCenterChannelData);
    fs.writeFileSync(config.location + "/storage/data/specialChannelList/" + dataCenterChannel.id + ".json", donnees);
    await bot.basicFunctions.get("wait").run(1000);
    dataCenterChannel.send("startChannel").then((msg)=>{
        bot.specialTextChannel.dataCenter.get("ls").run(bot, msg, dataCenterChannelData);
    })


    const consoleChannelData = {
        "id": consoleChannel.id,
        "type": "console"
    };
    donnees = JSON.stringify(consoleChannelData);
    fs.writeFileSync(config.location + "/storage/data/specialChannelList/" + consoleChannel.id + ".json", donnees);



    //Update config
    config.idConsoleChannel=consoleChannel.id;
    config.idGitChannel=gitChannel.id;

    donnees = JSON.stringify(config);
    fs.writeFileSync(config.location + "/storage/config.json", donnees);

    //Reboot
    await bot.basicFunctions.get("wait").run(1000);
    bot.specialTextChannel.dataCenter.get("reboot").run(bot, message, dataSpecialChannel);
};


module.exports.help = {
    name: "init"
};