


module.exports.select = async (bot, idGuild, callback) => {
    const dbPrefix = await bot.basicFunctions.get("DbConfiguration").getDbPrefix(bot);
    bot.dataBase.get("connection").exec('SELECT * FROM ?? WHERE id = ?', [dbPrefix + "specialGuild", idGuild], (error, results, fields) => {
        for (let index = 0; index < results.length; index++) {
            results[index].actionAdd=JSON.parse(results[index].actionAdd);
            results[index].actionRemove=JSON.parse(results[index].actionRemove);
            results[index].data=JSON.parse(results[index].data);
        }

        callback(error, results, fields);
        return;
    });
};

module.exports.update = async (bot, data, callback) => {
    const dbPrefix = await bot.basicFunctions.get("DbConfiguration").getDbPrefix(bot);
    bot.dataBase.get("connection").exec("UPDATE ?? SET `actionAdd` = ?, `actionRemove` = ?, `data` = ? WHERE `id` = ?", [dbPrefix + "specialGuild",  data.id, JSON.stringify(data.actionAdd), JSON.stringify(data.actionRemove), JSON.stringify(data.data), data.id], (error, results, fields) => {
        callback(error, results, fields);
        return;
    });
};

module.exports.insert = async (bot, data, callback) => {
    const dbPrefix = await bot.basicFunctions.get("DbConfiguration").getDbPrefix(bot);
    bot.dataBase.get("connection").exec("INSERT INTO ?? (`id`, `actionAdd`, `actionRemove`, `data`) VALUES (?, ?, ?, ?)", [dbPrefix + "specialGuild", data.id, JSON.stringify(data.actionAdd), JSON.stringify(data.actionRemove), JSON.stringify(data.data)], (error, results, fields) => {
        callback(error, results, fields);
        return;
    });
};

module.exports.delete = async (bot, idGuild, callback) => {
    const dbPrefix = await bot.basicFunctions.get("DbConfiguration").getDbPrefix(bot);
    bot.dataBase.get("connection").exec("DELETE FROM ?? WHERE `id` = ?", [dbPrefix + "specialGuild", idGuild], (error, results, fields) => {
        callback(error, results, fields);
        return;
    });
};

module.exports.help = {
    name: "dbDataSpecialGuild"
};