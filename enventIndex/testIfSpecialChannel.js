const config = require("../storage/config.json");
const fs = require("fs")

module.exports.run = async (bot,message)=>{
    try{
        fichiers = fs.readFileSync(config.location+"/storage/data/specialChannelList/"+message.channel.id+".json");
        let dataSpecialChannel = JSON.parse(fichiers);

        bot["specialTextChannel"][dataSpecialChannel.type].get("index").run(bot,message,dataSpecialChannel);
        return true
    }catch(e){
        return false
    }



    fichiers = fs.readFileSync(config.location+"/storage/data/specialChannelList.json");
    let dataSpecialChannel = JSON.parse(fichiers);

    //console.log(dataSpecialChannel)

    for (let i = 0; i < dataSpecialChannel.channelsSpeciaux.length; i++) {
        if(dataSpecialChannel.channelsSpeciaux[i].id===message.channel.id){
            let args = message.content.split(" ");
            bot["specialChannel"][dataSpecialChannel.channelsSpeciaux[i].type].get("index").run(bot,message,args);
            return true
        }
    }

    return false
};


module.exports.help = {
    name: "testIfSpecialChannel"
};