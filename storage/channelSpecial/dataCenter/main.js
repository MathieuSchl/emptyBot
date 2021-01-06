const {
    exec
} = require('child_process');
const config = require('../../config.json');


module.exports.run = async (bot, message, args) => {
    message.delete();
    exec('git checkout main', {
        cwd: config.location
    }, async function (error, stdout, stderr) {
        console.log(error);
        //console.log(stdout);
        console.log(stderr);
        message.channel.send("```Le bot est maintenant en mode normal```");
        await bot.basicFunctions.get("wait").run(250);
        bot.destroy();
        await bot.basicFunctions.get("wait").run(5000);
        require('child_process').exec(`node ${config.location}/index.js`, function (msg) { console.log(msg) });
    });
};

module.exports.help = {
    name: "main"
};