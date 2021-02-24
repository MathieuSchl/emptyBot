const config = require('../config.json');
const fs = require("fs");
const path = config.location + "/storage/data/specialChannelList/";

module.exports.select = async (bot, idChannel, callback) => {
    const dbPrefix = await bot.basicFunctions.get("DbConfiguration").getDbPrefix(bot);
    bot.dataBase.get("connection").exec('SELECT * FROM ?? WHERE id = ?', [dbPrefix + "specialMessage", idChannel], (error, results, fields) => {
        for (let index = 0; index < results.length; index++) {
            const element = results[index];
            element.emoji = JSON.parse(element.emoji);
            element.type = JSON.parse(element.type);
            element.data = JSON.parse(element.data);
        }
        callback(error, results, fields);
        return;
    });
};

module.exports.update = async (bot, data, callback) => {
    const dbPrefix = await bot.basicFunctions.get("DbConfiguration").getDbPrefix(bot);
    bot.dataBase.get("connection").exec("UPDATE ?? SET `emoji` = ?, `type` = ?, `data` = ? WHERE `id` = ?", [dbPrefix + "specialMessage", JSON.stringify(data.emoji), JSON.stringify(data.type), JSON.stringify(data.data), data.id], (error, results, fields) => {
        callback(error, results, fields);
        return;
    });
};

module.exports.insert = async (bot, data, callback) => {
    const dbPrefix = await bot.basicFunctions.get("DbConfiguration").getDbPrefix(bot);
    bot.dataBase.get("connection").exec("INSERT INTO ?? (`id`, `channel`, `emoji`, `type`, `data`) VALUES (?, ?, ?, ?, ?)", [dbPrefix + "specialMessage", data.id, data.channel, JSON.stringify(data.emoji), JSON.stringify(data.type), JSON.stringify(data.data)], (error, results, fields) => {
        callback(error, results, fields);
        return;
    });
};

module.exports.delete = async (bot, idChannel, callback) => {
    const dbPrefix = await bot.basicFunctions.get("DbConfiguration").getDbPrefix(bot);
    bot.dataBase.get("connection").exec("DELETE FROM ?? WHERE `id` = ?", [dbPrefix + "specialMessage", idChannel], (error, results, fields) => {
        callback(error, results, fields);
        return;
    });
};

module.exports.help = {
    name: "dbDataSpecialMessage"
};