const Discord = require("discord.js");
const fs = require("fs");
const config = require('../storage/config.json');
const pathSoundData = config.location + "storage/soundFunctions/data/";

const categoryMPName = "Escape game - MessagePrivé";
const buttonEmoji = ["white_button", "blue_button", "blueSky_button", "purple_button", "pink_button", "orange_button", "red_button", "green_button", "brun_button", "yellow_button"];

async function check(bot, reaction, user) {
    try {
        if (user.id === bot.user.id) return true;
        if (reaction.message.author.id !== bot.user.id) return true;

        let usersFromTheReactions;
        try {
            usersFromTheReactions = await reaction.message.reactions.cache.get(reaction._emoji.name).users.fetch();
        } catch (e) {
            usersFromTheReactions = await reaction.message.reactions.cache.get(reaction._emoji.id).users.fetch();
        }

        let users = Array.from(usersFromTheReactions);
        for (let i = 0; i < users.length; i++) {
            if (users[i][0] === bot.user.id) {
                return false;
            }
        }

        return true;
    } catch (e) {
        return false;
    }
}


async function reactionAction(bot, reaction, user, action) {
    let teamData = await bot.basicFunctions.get("teamData").open(reaction.message.channel.id);


    try {
        if (new Date() < new Date(new Date(teamData.lastAction).getTime() + 1500)) return;

        await bot.basicFunctions.get("wait").run(100);
        teamData.lastAction = new Date();
        await bot.basicFunctions.get("teamData").write(reaction.message.channel.id, teamData);
    } catch (e) {}

    if (await bot.enventIndex.get("testIfSpecialMessage").run(bot, reaction, user, action)) return;

    if (reaction._emoji.name === "↩️") {

        if (teamData.type === "Electrical" && teamData.data["Electrical"] != null && teamData.data["Electrical"]["systemActive"] !== "menu") {
            teamData.data["Electrical"]["userId"] = "";
            teamData.data["Electrical"]["systemActive"] = "menu";

            await bot.basicFunctions.get("teamData").write(reaction.message.channel.id, teamData);
            await bot.specialChannel["Electrical"].get("emptyDmChannels").run(bot, teamData);
            bot.specialChannel["Electrical"].get("index").run(bot, reaction.message, null);
            return;
        }

        if (teamData.data["Reactor_system"] != null && teamData.data["Reactor_system"]["sequenceMenu"] === true) {
            teamData.data["Reactor_system"]["userId"] = "";
            teamData.data["Reactor_system"]["sequence"] = [];
            teamData.data["Reactor_system"]["sequenceMenu"] = false;

            await bot.basicFunctions.get("teamData").write(reaction.message.channel.id, teamData);
            bot.specialChannel["Reactor_system"].get("index").run(bot, reaction.message, null);
            return;
        }

        try {
            if (teamData.type === "oxygen_system" && teamData.data.oxygen_system.statusActivation === 5) {
                teamData.data.oxygen_system.statusActivation = 0;
                await bot.basicFunctions.get("teamData").write(reaction.message.channel.id, teamData);
                bot.specialChannel.oxygen_system.get("index").run(bot, reaction.message, null);
                return;
            }
        } catch (e) {}

        teamData.type = "game";
        await bot.basicFunctions.get("teamData").write(reaction.message.channel.id, teamData);
        let args = [];
        bot.specialChannel.game.get("ls").run(bot, reaction.message, args);
        return;
    } else if (reaction._emoji.name === "🚨") {
        if (teamData.type === "oxygen_system") {
            bot.specialChannel.oxygen_system.get("changeData").start(bot, reaction.message.channel, teamData);
            return;
        }

    } else if (reaction._emoji.name === "✅") {
        if (teamData.type === "startMenu") {
            let channel;

            if (teamData.players.length < 2) {
                if (action === "remove") return;
                reaction.users.remove(user);
                reaction.message.channel.send("Désolé il faut être minimum 2 joueurs pour démarer la partie").then(msg => {
                    setTimeout(() => {
                        if (!msg.deleted) msg.delete()
                    }, 10000)
                })
                return;
            };

            const invitePlayerChannel = await bot.channels.fetch(teamData.invitePlayer)
            const allPermissionsInvite = invitePlayerChannel.permissionOverwrites.filter(o => o.id !== teamData.players[0]).array();
            invitePlayerChannel.overwritePermissions(allPermissionsInvite);

            const removePlayerChannel = await bot.channels.fetch(teamData.removePlayer)
            const allPermissionsDelete = removePlayerChannel.permissionOverwrites.filter(o => o.id !== teamData.players[0]).array();
            removePlayerChannel.overwritePermissions(allPermissionsDelete);

            teamData.type = "deleteAllMessage";
            await bot.basicFunctions.get("teamData").write(reaction.message.channel.id, teamData);

            fichiers = fs.readFileSync(pathSoundData + "soundData.json");
            soundData = JSON.parse(fichiers);

            let newEventSound = {
                "soundToPlay": "Intro_Hyperion.mp3",
                "idUser": user.id,
                "idGuild": reaction.message.guild.id,
                "idTextChannel": teamData.id,
                "idChannel": teamData.vocal,
                "command": "startGameAfterIntro",
                "actionStart": false
            }

            soundData.soundList.push(newEventSound);

            donnees = JSON.stringify(soundData);
            fs.writeFileSync(pathSoundData + "soundData.json", donnees);

            await bot.basicFunctions.get("wait").run(250);
            bot.soundFunctions.get("index").run(bot);
            reaction.message.channel.bulkDelete(20);
            reaction.message.channel.send("Introduction en cours");

            return;
        }
        if (teamData.type === "Electrical") {
            teamData.data["Electrical"]["userId"] = "";
            teamData.data["Electrical"]["systemActive"] = "menu";

            await bot.basicFunctions.get("teamData").write(reaction.message.channel.id, teamData);
            await bot.specialChannel["Electrical"].get("emptyDmChannels").run(bot, teamData);
            bot.specialChannel["Electrical"].get("index").run(bot, reaction.message, null);
            bot.basicFunctions.get("scoreBoard").reaload(bot);
            bot.basicFunctions.get("eventLuncher").run(bot, teamData, reaction.message);
            return;
        }
        if (teamData.type !== "oxygen_system") {
            //console.log("emoji " + reaction._emoji.name + " n'a pas d'action");
            return;
        }
        teamData.data.oxygen_system.oxygene_generator = true;
        teamData.data.oxygen_system.statusActivation = 0;
        teamData.data.oxygen_system.reserve++;
        await bot.basicFunctions.get("teamData").write(reaction.message.channel.id, teamData);

        bot.specialChannel.oxygen_system.get("index").run(bot, reaction.message, null);

        bot.basicFunctions.get("scoreBoard").reaload(bot);
        bot.basicFunctions.get("eventLuncher").run(bot, teamData, reaction.message);

        let chatChannel = await bot.channels.fetch(teamData.chat);
        chatChannel.send("",{files: [
            config.location+"/storage/channelSpecial/game/file/huitVert.png"
          ]})
        return;

    } else if (reaction._emoji.name === "▶️") {
        teamData.data.Reactor_system.sequenceMenu = true;
        await bot.basicFunctions.get("teamData").write(reaction.message.channel.id, teamData);
        bot.specialChannel.Reactor_system.get("index").run(bot, reaction.message, null);
        return;
    } else if (reaction._emoji.name === "1️⃣") {
        bot.specialChannel.Electrical.get("menuReactor").run(bot, reaction.message, teamData);
        return;
    } else if (reaction._emoji.name === "2️⃣") {
        bot.specialChannel.Electrical.get("menuNavigation").run(bot, reaction.message, teamData);
        return;
    } else if (reaction._emoji.name === "3️⃣") {
        bot.specialChannel.Electrical.get("menuOxygen").run(bot, reaction.message, teamData);
        return;
    } else if (reaction._emoji.name === "☑️") {
        if (reaction.message.channel.parent.name === categoryMPName) {
            if (action === "remove") return;
            reaction.users.remove(user);
            bot.specialChannel.Electrical.get("validation").run(bot, reaction.message);
            return;
        }

        if (action === "remove") return;
        if (teamData.endingTime != null && new Date() < new Date(new Date(teamData.lastAction).getTime() + 5000)) return;
        let finalWord = await bot.specialChannel.theEnd.get("validation").run(bot, reaction.message.channel.id);
        if (finalWord === true) {
            teamData.type = "deleteAllMessage";
            teamData = await bot.specialChannel["theEnd"].get("uptateDataForGame").run(bot, reaction.message, teamData);

            fichiers = fs.readFileSync(pathSoundData + "soundData.json");
            soundData = JSON.parse(fichiers);

            let newEventSound = {
                "soundToPlay": "end_message.mp3",
                "idUser": user.id,
                "idGuild": reaction.message.guild.id,
                "idTextChannel": teamData.id,
                "idChannel": teamData.vocal,
                "command": "theGameIsFinished",
                "actionStart": false
            }

            soundData.soundList.push(newEventSound);

            donnees = JSON.stringify(soundData);
            fs.writeFileSync(pathSoundData + "soundData.json", donnees);

            await bot.basicFunctions.get("wait").run(250);
            bot.soundFunctions.get("index").run(bot);
            reaction.message.channel.bulkDelete(20);
            reaction.message.channel.send("Transmission en cours");

            //bot.specialChannel.theEnd.get("index").run(bot, reaction.message, null);
            return;
        } else {
            reaction.users.remove(user);
            reaction.message.channel.send(finalWord);
        }
    } else {
        //console.log("emoji " + reaction._emoji.name + " n'a pas d'action");
    }
}




module.exports.addReaction = async (bot, reaction, user) => {
    //console.log(reaction);
    if (await check(bot, reaction, user)) return;

    //next
    if (buttonEmoji.includes(reaction._emoji.name)) {
        let teamData = await bot.basicFunctions.get("teamData").open(reaction.message.channel.id);

        teamData.lastAction = new Date();

        if (teamData.data["Reactor_system"]["userId"] === "") {
            teamData.data["Reactor_system"]["userId"] = user.id;
        } else if (teamData.data["Reactor_system"]["userId"] !== user.id) {
            let userActive;
            try {
                userActive = await bot.users.fetch(teamData.data["Reactor_system"]["userId"]).catch();
                userActive = userActive.username;
            } catch (e) {
                userActive = "Utilisateur inconnu";
            }
            user.send("Vous ne pouvez pas entrer la séquence. " + userActive + " est déjà en train de le faire.")
            reaction.users.remove(user);
            return;
        }

        teamData.data["Reactor_system"]["sequence"].push(reaction._emoji.name);
        await bot.basicFunctions.get("teamData").write(reaction.message.channel.id, teamData);

        if (teamData.data["Reactor_system"]["sequence"].length === 10) {

            let correct = true
            for (let i = 0; i < teamData.data["Reactor_system"]["sequence"].length; i++) {
                if (teamData.data["Reactor_system"]["sequence"][i] !== buttonEmoji[i]) {
                    correct = false
                    break;
                }
            }

            if (correct) {
                reaction.message.channel.send("Séquence de réactivation valide.\nActivation du réacteur imminente")
                await bot.basicFunctions.get("wait").run(5000);
                teamData.data["Reactor_system"]["sequenceMenu"] = false;
                teamData.data["Reactor_system"]["reactor"] = true;

                bot.basicFunctions.get("scoreBoard").reaload(bot);
                bot.basicFunctions.get("eventLuncher").run(bot, teamData, reaction.message);
            } else {
                reaction.message.channel.send("Séquence de réactivation incorrect.\nRéinitialisation en cours, veuillez patienter")
                await bot.basicFunctions.get("wait").run(5000);
                teamData.data["Reactor_system"]["userId"] = "";
                teamData.data["Reactor_system"]["sequence"] = [];
            }
            await bot.basicFunctions.get("teamData").write(reaction.message.channel.id, teamData);
            bot.specialChannel["Reactor_system"].get("index").run(bot, reaction.message, null);
            return;
        }
        return;
    }

    reactionAction(bot, reaction, user, "add")
};

module.exports.removeReaction = async (bot, reaction, user) => {
    if (await check(bot, reaction, user)) return;

    //next
    if (buttonEmoji.includes(reaction._emoji.name)) {
        let teamData = await bot.basicFunctions.get("teamData").open(reaction.message.channel.id);

        teamData.lastAction = new Date();

        if (teamData.data["Reactor_system"]["userId"] !== user.id) return;
        if (teamData.data["Reactor_system"]["sequence"].includes(reaction._emoji.name)) {
            let emojiIndex = teamData.data["Reactor_system"]["sequence"].indexOf(reaction._emoji.name)
            teamData.data["Reactor_system"]["sequence"].splice(emojiIndex, 1);
            await bot.basicFunctions.get("teamData").write(reaction.message.channel.id, teamData);
        }
        return;
    }

    reactionAction(bot, reaction, user, "remove")
};


module.exports.help = {
    name: "reaction"
};