const config = require("../storage/config.json");
const fs = require("fs")


async function getVoiceChannelData(bot, voiceChannelId) {
    try {
        fichiers = fs.readFileSync(config.location + "/storage/data/specialVoiceChannelList/" + voiceChannelId + ".json");
        let datavoiceChannel = JSON.parse(fichiers);

        return datavoiceChannel;
    } catch (e) {
        return false;
    }
}

module.exports.run = async (bot, oldState, newState) => {
    const oldDatavoiceChannel = await getVoiceChannelData(bot, oldState.channelID);
    const newDatavoiceChannel = await getVoiceChannelData(bot, newState.channelID);


    if (oldDatavoiceChannel) {
        try {
            bot.specialVoiceChannels[oldDatavoiceChannel.type].get("index").leave(bot, oldState, oldDatavoiceChannel, newState, newDatavoiceChannel);
        } catch {
            console.log("The specialVoiceChannels '"+oldDatavoiceChannel.type+"'does not exist");
        }
    }

    if (newDatavoiceChannel) {
        try {
            bot.specialVoiceChannels[newDatavoiceChannel.type].get("index").join(bot, oldState, oldDatavoiceChannel, newState, newDatavoiceChannel);
        } catch {
            console.log("The specialVoiceChannels '"+newDatavoiceChannel.type+"'does not exist");
        }
    }
};


module.exports.help = {
    name: "voiceStateUpdate"
};