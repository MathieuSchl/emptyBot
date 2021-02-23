async function getVoiceChannelData(bot, oldVoiceChannelId, newVoiceChannelId, callback) {
    bot.basicFunctions.get("dbDataSpecialVoiceChannel").select(bot, oldVoiceChannelId, (error, results, fields) => {
        if (error) throw error;

        const oldDatavoiceChannel = results[0];

        bot.basicFunctions.get("dbDataSpecialVoiceChannel").select(bot, newVoiceChannelId, (error, results, fields) => {
            if (error) throw error;

            const newDatavoiceChannel = results[0];
            callback(oldDatavoiceChannel, newDatavoiceChannel);
            return;
        })
        return;
    })
    return;
}

module.exports.run = async (bot, oldState, newState) => {
    getVoiceChannelData(bot, oldState.channelID, newState.channelID, (oldDatavoiceChannel, newDatavoiceChannel) => {
        if (oldDatavoiceChannel) {
            try {
                bot.specialVoiceChannels[oldDatavoiceChannel.type].get("index").leave(bot, oldState, oldDatavoiceChannel, newState, newDatavoiceChannel);
            } catch {
                console.log("The specialVoiceChannels '" + oldDatavoiceChannel.type + "'does not exist");
            }
        }

        if (newDatavoiceChannel) {
            try {
                bot.specialVoiceChannels[newDatavoiceChannel.type].get("index").join(bot, oldState, oldDatavoiceChannel, newState, newDatavoiceChannel);
            } catch {
                console.log("The specialVoiceChannels '" + newDatavoiceChannel.type + "'does not exist");
            }
        }
    });
};


module.exports.help = {
    name: "voiceStateUpdate"
};