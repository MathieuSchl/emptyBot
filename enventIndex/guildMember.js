const config = require("../storage/config.json");
const fs = require("fs")


async function getGuildData(bot, guildId, callback) {
    try {
        fichiers = fs.readFileSync(config.location + "/storage/data/specialGuild/" + guildId + ".json");
        let guildData = JSON.parse(fichiers);
        callback(guildData);
    } catch (e) {
        callback(null);
    }
    return;
}

module.exports.add = async (bot, member) => {
    getGuildData(bot, member.guild.id, (guildData) => {
        if (!guildData) return;

        for (let index = 0; index < guildData.actionAdd.length; index++) {
            const element = guildData.actionAdd[index];

            bot.specialGuilds[element].get("index").add(bot, member, guildData);
        }
    });
};

module.exports.remove = async (bot, member) => {
    getGuildData(bot, member.guild.id, (guildData) => {
        if (!guildData) return;

        for (let index = 0; index < guildData.actionRemove.length; index++) {
            const element = guildData.actionRemove[index];

            bot.specialGuilds[element].get("index").remove(bot, member, guildData);
        }
    });
};


module.exports.help = {
    name: "guildMember"
};