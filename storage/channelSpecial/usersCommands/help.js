const Discord = require("discord.js");


module.exports.run = async (bot, message, args) => {
    var helpEmbed = new Discord.MessageEmbed();
    helpEmbed.setColor("#B154BE");
    helpEmbed.setTitle('Liste des commandes')
    helpEmbed.setDescription('Les commandes pour le bot doivent commencer par `!`')
    helpEmbed.addFields({
        name: '!ping',
        value: 'Le bot dois répondre `pong` à cette command. Cela permet de vérifier que le bot est connecté'
    }, {
        name: '!profile [user]',
        value: 'Permet de voir le profile de l\'utilisateur sélectionné. Si aucun utilisateur n\'est sélectionné le profile affiché sera celui de l\'auteur du message\nEx:`/profile Cody` affichera le profile de `Cody`'
    }, )
    message.channel.send(helpEmbed);
};

module.exports.help = {
    name: "help"
};