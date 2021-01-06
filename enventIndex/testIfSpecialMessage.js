const config = require("../storage/config.json");
const fs = require("fs")

module.exports.run = async (bot, reaction, user, action) => {
    try {
        fichiers = fs.readFileSync(config.location + "/storage/data/specialMessageList/" + reaction.message.id + ".json");
        let dataSpecialMessage = JSON.parse(fichiers);

        try{
            const index = dataSpecialMessage.emoji.indexOf(reaction["_emoji"].name);
            if(index===-1) return false;
            bot.messageSpecial[dataSpecialMessage.type[index]].get("index").run(bot, reaction, user, action, dataSpecialMessage);

        }catch(e){
            console.log(e);
        }
        //bot.messageSpecial.get(dataSpecialMessage.type).run(bot, reaction, user, action);
        return true;
    } catch (e) {
        return false;
    }



    fichiers = fs.readFileSync(config.location + "/storage/data/specialChannelList.json");
    let dataSpecialChannel = JSON.parse(fichiers);

    //console.log(dataSpecialChannel)

    for (let i = 0; i < dataSpecialChannel.channelsSpeciaux.length; i++) {
        if (dataSpecialChannel.channelsSpeciaux[i].id === message.channel.id) {
            let args = message.content.split(" ");
            bot["specialChannel"][dataSpecialChannel.channelsSpeciaux[i].type].get("index").run(bot, message, args);
            return true
        }
    }
    return false
};


module.exports.help = {
    name: "testIfSpecialMessage"
};