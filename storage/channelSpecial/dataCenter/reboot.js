const config = require('../../config.json');


module.exports.run = async (bot, message, args)=>{
    message.delete();
    message.channel.send("```Redémarage du bot dans 5s```").then((msg)=>{msg.delete({ timeout:5000 })});
    await bot.basicFunctions.get("wait").run(5500);
    bot.destroy();
    await bot.basicFunctions.get("wait").run(5000);
    require('child_process').exec(`node ${config.location}/index.js`, function (msg) { console.log(msg) });
};

module.exports.help = {
    name: "reboot"
};