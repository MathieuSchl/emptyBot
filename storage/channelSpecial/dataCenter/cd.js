const config = require('../../config.json');
const fs = require("fs");
const pathToAdd = config.location + "storage/data/"


function go(path,folder){
    return new Promise((resolve, reject) => {
        if(folder==="."){
            resolve(path);
        }
        else if(folder===".."){
            var folderPath = path.split("/");
            if (folderPath.length===2){
                resolve(null);
            }
            folderPath.splice(folderPath.length-2,2)
            path = "";
            for (var i = 0; i < folderPath.length; i++) {
                path = path + folderPath[i] + "/";
            }
            resolve(path);
        }else {
            path = path+folder+"/";
            fs.readdir(pathToAdd + path, (err, theFolder) =>{
                if (theFolder==null){
                    resolve(undefined);
                }else{
                    resolve(path);
                }
            });
        }
    });
}


module.exports.run = async (bot, message, args)=>{
    if(args.length===1){
        bot.specialChannel.game.get("ls").run(bot,message,args);
        return
    }

    let teamData = await bot.basicFunctions.get("teamData").open(message.channel.id);
    let pwd = teamData.data.pwd;

    args.splice(0, 1);
    var pathChange = "";
    for (var i = 0; i < args.length; i++) {
        if(i===0){
            pathChange = args[i];
        }else {
            pathChange = pathChange +" "+ args[i];
        }
    }

    pathChange = pathChange.split("/");

    for (var i = 0; i < pathChange.length; i++) {
        if(pathChange[i]!==""){
            var res = await go(pwd,pathChange[i]);
            pwd = res;
            if (pwd===undefined){
                bot.specialChannel.dataCenter.get("ls").run(bot,message,args);
                await bot.basicFunctions.get("wait").run(500);
                message.channel.send("`"+pathChange[i]+"` n'est pas un dossier valide");
                return ;
            }
            if (pwd===null){
                bot.specialChannel.dataCenter.get("ls").run(bot,message,args);
                await bot.basicFunctions.get("wait").run(500);
                message.channel.send("Vous êtes à la racine");
                return ;
            }

            
            teamData.data.pwd = pwd; 
            await bot.basicFunctions.get("teamData").write(message.channel.id,teamData);
        }
    }
    await bot.basicFunctions.get("wait").run(250);
    bot.specialChannel.dataCenter.get("ls").run(bot,message,args);
};

module.exports.help = {
    name: "cd"
};

