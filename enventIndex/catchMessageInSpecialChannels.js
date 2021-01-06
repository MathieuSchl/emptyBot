const config = require("../storage/config.json");
const fs = require("fs");
const pathSpecialChannels = config.location + "/storage/data/specialChannelList/";
const pathSpecialMessages = config.location + "/storage/data/specialMessageList/";

module.exports.run = async (bot) => {
    const allGuilds = bot.guilds.cache.array();

    for (let index = 0; index < allGuilds.length; index++) {
        const element = allGuilds[index];
        if(element.rulesChannelID!=null){
            channel = await bot.channels.fetch(element.rulesChannelID);
            channel.messages.fetch();
        }
    }

    await fs.readdir(pathSpecialChannels, async function (err, files) {
        if (err) {
            console.log(err);
            return;
        }
        for (let i = 0; i < files.length; i++) {
            files[i] = files[i].split(".")[0];
        }
        for (let i = 0; i < files.length; i++) {
            let channel = await bot.channels.fetch(files[i]);
            if(channel==null){
                console.log("Channel "+files[i]+" does not exist");
            }else{
                channel.messages.fetch();
            }
        }
    });

    await fs.readdir(pathSpecialMessages, async function (err, files) {
        if (err) {
            console.log(err);
            return;
        }
        for (let i = 0; i < files.length; i++) {
            fichiers = fs.readFileSync(config.location + "/storage/data/specialMessageList/" + files[i]);
            let dataSpecialMessage = JSON.parse(fichiers);

            let channel = await bot.channels.fetch(dataSpecialMessage.channel);
            if(channel==null){
                console.log("Message "+files[i].split(".")[0]+" does not exist");
            }else{
                channel.messages.fetch();
            }
        }
    });
};


module.exports.help = {
    name: "catchMessageInSpecialChannels"
};