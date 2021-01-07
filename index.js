const Discord = require("discord.js");
const config = require("./storage/config.json");
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


async function start() {
    try {
        await require("./enventIndex/scanCommands.js").run(bot);
    } catch (e) {
        console.log(e)
    }
    try {
        bot.login(config.token);
    } catch (e) {}

}

start();