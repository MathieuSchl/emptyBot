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

    
    fichiers = fs.readFileSync(path);
    let donnePath = JSON.parse(fichiers);

    let pwd = ""
    for (let i = 0; i < donnePath.channelsSpeciaux.length; i++) {
        if (donnePath.channelsSpeciaux[i].id===idChannel){
            pwd = donnePath.channelsSpeciaux[i].data.pwd;
            if (pwd==""||pwd==null){
                pwd="/";

                donnePath.channelsSpeciaux[i].data.pwd = pwd;

                let donnees = JSON.stringify(donnePath);
                fs.writeFileSync(path, donnees);
            }
            return donnePath.channelsSpeciaux[i]
        }
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



    fichiers = fs.readFileSync(path);
    let donnePath = JSON.parse(fichiers);

    let pwd = ""
    for (let i = 0; i < donnePath.channelsSpeciaux.length; i++) {
        if (donnePath.channelsSpeciaux[i].id===idChannel){

            donnePath.channelsSpeciaux[i]=data;

            let donnees = JSON.stringify(donnePath);
            fs.writeFileSync(path, donnees);
        }
    }
};

module.exports.help = {
    name: "teamData"
};