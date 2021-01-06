const Discord = require("discord.js");
const fs = require("fs");
const config = require('../storage/config.json');
const banFolder = ["channelSpecial","messageSpecial"];

function scanFolder(bot, path) {
    let folderName = path.split("/");
    folderName = folderName[folderName.length - 2]


    bot[folderName] = new Discord.Collection();
    fs.readdir(path, (err, files) => {
        if (err) {
            console.log(err);
            return;
        }
        if (files == undefined) {
            console.log("This folder is undefined :\"" + folderName + "\"");
            return;
        }

        var jsFiles = files.filter(f => f.split(".").pop() === "js");
        if (jsFiles.length <= 0) {
            return;
        }
        let nbFile = 0;
        jsFiles.forEach((f, i) => {
            nbFile++;
            var fileGet = require(path + f);
            bot[folderName].set(fileGet.help.name, fileGet)
        });
        if (nbFile === 1) console.log(nbFile + " command file from the \"" + folderName + "\" folder have been added");
        else console.log(nbFile + " commands files from the \"" + folderName + "\" folder have been added");
    });
}

module.exports.run = async (bot) => {
    scanFolder(bot, config.location + "/enventIndex/");

    await fs.readdir(config.location + "/storage/", async(err, folders) => {
        for (let i = 0; i < folders.length; i++) {
            if (fs.lstatSync(config.location + "/storage/" + folders[i]).isDirectory()) {
                if(!banFolder.includes(folders[i])) await scanFolder(bot, config.location + "/storage/" + folders[i] + "/");
            }
        }
        return;
    });

    await fs.readdir(config.location + "/storage/channelSpecial", async(err, folders) => {
        if (folders.length !== 0) {
            bot["specialChannel"] = {};
            for (let i = 0; i < folders.length; i++) {
                if (fs.lstatSync(config.location + "/storage/channelSpecial/" + folders[i]).isDirectory()) {
                    await scanFolder(bot["specialChannel"], config.location + "/storage/channelSpecial/" + folders[i] + "/");
                }
            }
        }
        return;
    });

    await fs.readdir(config.location + "/storage/messageSpecial", async(err, folders) => {
        if (folders.length !== 0) {
            bot["messageSpecial"] = {};
            for (let i = 0; i < folders.length; i++) {
                if (fs.lstatSync(config.location + "/storage/messageSpecial/" + folders[i]).isDirectory()) {
                    await scanFolder(bot["messageSpecial"], config.location + "/storage/messageSpecial/" + folders[i] + "/");
                }
            }
        }
        return;
    });

    //scanFolder(bot,config.location+"/storage/commands/");
    //scanFolder(bot,config.location+"/storage/basicFunctions/");
    return bot;
};

module.exports.help = {
    name: "scanCommands"
};