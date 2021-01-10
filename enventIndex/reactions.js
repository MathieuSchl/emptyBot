const config = require("../storage/config.json");
const fs = require("fs")


async function check(bot, reaction, user) {
    try {
        if (user.id === bot.user.id) return true;
        if (reaction.message.author.id !== bot.user.id) return true;

        let usersFromTheReactions;
        try {
            usersFromTheReactions = await reaction.message.reactions.cache.get(reaction._emoji.name).users.fetch();
        } catch (e) {
            usersFromTheReactions = await reaction.message.reactions.cache.get(reaction._emoji.id).users.fetch();
        }

        let users = Array.from(usersFromTheReactions);
        for (let i = 0; i < users.length; i++) {
            if (users[i][0] === bot.user.id) {
                return false;
            }
        }

        return true;
    } catch (e) {
        return false;
    }
}

async function getMessageData(bot, reaction, user) {
    try {
        fichiers = fs.readFileSync(config.location + "/storage/data/specialMessageList/" + reaction.message.id + ".json");
        let dataSpecialMessage = JSON.parse(fichiers);
        return dataSpecialMessage;
    } catch (e) {
        return false;
    }
}

module.exports.addReaction = async (bot, reaction, user) => {
    if (await check(bot, reaction, user)) return;
    const messageData = await bot.basicFunctions.get("specialMessageFiles").open(reaction.message.id);
    if (!messageData) return;

    const index = messageData.emoji.indexOf(reaction["_emoji"].name);
    if (index === -1) return false;
    bot.messageSpecial[messageData.type[index]].get("index").addReaction(bot, reaction, user, messageData, index);
};

module.exports.removeReaction = async (bot, reaction, user) => {
    if (await check(bot, reaction, user)) return;
    const messageData = await getMessageData(bot, reaction, user);
    if (!messageData) return;

    const index = messageData.emoji.indexOf(reaction["_emoji"].name);
    if (index === -1) return false;
    bot.messageSpecial[messageData.type[index]].get("index").removeReaction(bot, reaction, user, messageData, index);
};


module.exports.help = {
    name: "reactions"
};