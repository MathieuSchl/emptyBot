const Discord = require("discord.js");
const fs = require("fs");
const bot = new Discord.Client();


bot.on("ready", async () => {
    try {
        bot.enventIndex.get("ready").run(bot);
    } catch (e) {
        console.log("Error in the ready event\n---------\n");
        console.log(e);
        console.log("\n\n")
    }
});

bot.on("message", message => {
    try {
        bot.enventIndex.get("messages").run(bot, message);
    } catch (e) {
        console.log("Error in the message event\n---------\n");
        console.log(e);
        console.log("\n\n")
    }
});

bot.on("messageReactionAdd", (reaction, user) => {
    try {
        bot.enventIndex.get("reactions").addReaction(bot, reaction, user);
    } catch (e) {
        console.log("Error in the messageReactionAdd event\n---------\n");
        console.log(e);
        console.log("\n\n")
    }
});

bot.on("messageReactionRemove", (reaction, user) => {
    try {
        bot.enventIndex.get("reactions").removeReaction(bot, reaction, user);
    } catch (e) {
        console.log("Error in the messageReactionRemove event\n---------\n");
        console.log(e);
        console.log("\n\n")
    }
});

bot.on('voiceStateUpdate', (oldState, newState) => {
    try {
        bot.enventIndex.get("voiceStateUpdate").run(bot, oldState, newState);
    } catch (e) {
        console.log("Error in the voiceStateUpdate event\n---------\n");
        console.log(e);
        console.log("\n\n")
    }
})

//guildMemberAdd

bot.on('guildMemberAdd', (member) => {
    try {
        bot.enventIndex.get("guildMember").add(bot, member);
    } catch (e) {
        console.log("Error in the guildMemberAdd event\n---------\n");
        console.log(e);
        console.log("\n\n")
    }
})

bot.on('guildMemberRemove', (member) => {
    try {
        bot.enventIndex.get("guildMember").remove(bot, member);
    } catch (e) {
        console.log("Error in the guildMemberRemove event\n---------\n");
        console.log(e);
        console.log("\n\n")
    }
})

bot.on('invalidated', () => {
    try {
        console.log("invalidated event");
        //bot.enventIndex.get("invalidated").run(bot);
    } catch (e) {
        console.log("Error in the invalidated event\n---------\n");
        console.log(e);
        console.log("\n\n")
    }
})

bot.on('error', (error) => {
    try {
        console.log("error event");
        console.log(error);
        //bot.enventIndex.get("invalidated").run(bot);
    } catch (e) {
        console.log("Error in the error event\n---------\n");
        console.log(e);
        console.log("\n\n")
    }
})

// Debug event
bot.on('debug', (info) => {
    try {
        if (info.split("ENOTFOUND").length != 1) {
            //La connexion à été perdu
            console.log("Error in debug");
            console.log(info);
            bot.specialTextChannel.dataCenter.get("raspReboot").run(bot, null, null);
        }
    } catch (e) {
        console.log("Error in the debug event\n---------\n");
        console.log(e);
        console.log("\n\n")
    }
})


async function start() {
    const whereAmI = __dirname + "\\";
    if (whereAmI !== require("./storage/config.json").location) {
        fichiers = fs.readFileSync(whereAmI + "/storage/config.json");
        const config = JSON.parse(fichiers);
        config.location = whereAmI;
        let donnees = JSON.stringify(config);
        fs.writeFileSync(whereAmI + "/storage/config.json", donnees);
        bot.destroy();
        console.log("The bot is ready you can restart it")
    } else {
        try {
            await require("./enventIndex/scanCommands.js").run(bot);
        } catch (e) {
            console.log(e)
        }

        try {
            setTimeout(() => {
                bot.login(require("./storage/config.json").token).catch((error) => {
                    if (error.name === "FetchError") bot.specialTextChannel.dataCenter.get("raspReboot").run(bot, null, null);
                    else console.log(error);
                })
            }, 2000);
        } catch (e) {}
    }
}

start();