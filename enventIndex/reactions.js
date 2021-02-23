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

async function getMessageData(bot, reaction, callback) {
    bot.basicFunctions.get("dbDataSpecialMessage").select(bot, reaction.id, (error, results, fields) => {
        if (error) throw error;

        const dataSpecialMessage = results[0];
        callback(dataSpecialMessage);
        return;
    })
}

module.exports.addReaction = async (bot, reaction, user) => {
    if (await check(bot, reaction, user)) return;
    getMessageData(bot, reaction, (messageData) => {
        if (!messageData) return;

        const index = messageData.emoji.indexOf(reaction["_emoji"].name);
        if (index === -1) return false;
        bot.messageSpecial[messageData.type[index]].get("index").addReaction(bot, reaction, user, messageData, index);
    });
};

module.exports.removeReaction = async (bot, reaction, user) => {
    if (await check(bot, reaction, user)) return;
    getMessageData(bot, reaction, (messageData) => {
        if (!messageData) return;

        const index = messageData.emoji.indexOf(reaction["_emoji"].name);
        if (index === -1) return false;
        bot.messageSpecial[messageData.type[index]].get("index").removeReaction(bot, reaction, user, messageData, index);
    });
};


module.exports.help = {
    name: "reactions"
};