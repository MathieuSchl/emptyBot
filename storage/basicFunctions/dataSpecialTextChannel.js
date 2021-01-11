const config = require('../config.json');
const fs = require("fs");
const path = config.location + "/storage/data/specialChannelList/";

module.exports.open = async (idChannel)=>{
    try{
        fichiers = fs.readFileSync(path+idChannel+".json");
        let dataSpecialChannel = JSON.parse(fichiers);

        return dataSpecialChannel;
    }catch(e){
        return null;
    }
};

module.exports.write = async (idChannel,data)=>{
    try{
        let donnees = JSON.stringify(data);
        fs.writeFileSync(path+idChannel+".json", donnees);
        return;
    }catch(e){
        return;
    }
};

module.exports.help = {
    name: "dataSpecialTextChannel"
};