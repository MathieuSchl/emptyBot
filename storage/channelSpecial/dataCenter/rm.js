const config = require('../../config.json');
const fs = require("fs");
const pathToAdd = config.location + "storage/data/"


module.exports.run = async (bot, message, args) => {
    const teamData = await bot.basicFunctions.get("teamData").open(message.channel.id);
    const realpwd = pathToAdd + teamData.data.pwd;

    args.splice(0, 1);
    for (var i = 0; i < args.length; i++) {
        try {
            if (fs.existsSync(realpwd + args[i])) {
                fs.unlinkSync(realpwd + args[i])
                message.channel.send("Le fichier \"" + args[i] + "\" a été suprimé")
            } else {
                message.channel.send("Le fichier \"" + args[i] + "\" n'est pas valide")
            }
        } catch (err) {
            try {
                require('child_process').exec('rmdir ' + realpwd + args[i], function (msg) {
                    console.log(msg)
                    message.channel.send("Le dossier \"" + args[i] + "\" a été suprimé")
                });
            } catch (err) {
                console.log("err")
            }
        }
    }
};

module.exports.help = {
    name: "rm"
};