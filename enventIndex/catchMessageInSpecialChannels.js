const config = require("../storage/config.json");
const fs = require("fs");
const pathSpecialMessages = config.location + "/storage/data/specialMessageList/";
const pathSpecialGuilds = config.location + "/storage/data/specialGuild/";
const pathSpecialVoiceChannels = config.location + "/storage/data/specialVoiceChannelList/";

module.exports.run = async (bot) => {
    const allGuilds = bot.guilds.cache.array();

    for (let index = 0; index < allGuilds.length; index++) {
        const element = allGuilds[index];
        if (element.rulesChannelID != null) {
            channel = await bot.channels.fetch(element.rulesChannelID);
            channel.messages.fetch();
        }
    }

    const dbPrefix = await bot.basicFunctions.get("DbConfiguration").getDbPrefix(bot);
    await bot.basicFunctions.get("wait").run(3000);

    bot.dataBase.get("connection").exec('SELECT * FROM ??', [dbPrefix + "specialTextChannel"], async (error, results, fields) => {
        if (error) throw error;

        for (let index = 0; index < results.length; index++) {
            const element = results[index];

            try{
                await bot.channels.fetch(element.id);
            }catch{
                bot.basicFunctions.get("dataSpecialTextChannel").delete(bot, element.id, (error, results, fields)=>{});
            }
            await bot.basicFunctions.get("wait").run(1000);
        }
        return;
    });

    await bot.basicFunctions.get("wait").run(10000);

    await fs.readdir(pathSpecialMessages, async function (err, files) {
        if (err) {
            console.log(err);
            return;
        }
        for (let i = 0; i < files.length; i++) {
            fichiers = fs.readFileSync(pathSpecialMessages + files[i]);
            let dataSpecialMessage = JSON.parse(fichiers);

            try {
                let channel = await bot.channels.fetch(dataSpecialMessage.channel);
                channel.messages.fetch(dataSpecialMessage.id).catch(() => {
                    fs.unlinkSync(pathSpecialMessages + files[i]);
                });
            } catch {
                fs.unlinkSync(pathSpecialMessages + files[i]);
            }
        }
    });

    await fs.readdir(pathSpecialGuilds, async function (err, files) {
        if (err) {
            console.log(err);
            return;
        }

        for (let i = 0; i < files.length; i++) {
            files[i] = files[i].split(".")[0];
        }
        for (let i = 0; i < files.length; i++) {
            try {
                await bot.guilds.fetch(files[i]);
            } catch (e) {
                fs.unlinkSync(pathSpecialGuilds + files[i] + ".json");
            }
        }
    });

    await fs.readdir(pathSpecialVoiceChannels, async function (err, files) {
        if (err) {
            console.log(err);
            return;
        }

        for (let i = 0; i < files.length; i++) {
            files[i] = files[i].split(".")[0];
        }
        for (let i = 0; i < files.length; i++) {
            try {
                await bot.channels.fetch(files[i]);
            } catch (e) {
                fs.unlinkSync(pathSpecialVoiceChannels + files[i] + ".json");
            }
        }
    });

    const channelsToFetch = require("../storage/data/generalData.json").channelsToFetch;
    channelsToFetch.forEach(async (element) => {
        const channel = await bot.channels.fetch(element);
        channel.messages.fetch();
    });
};


module.exports.help = {
    name: "catchMessageInSpecialChannels"
};