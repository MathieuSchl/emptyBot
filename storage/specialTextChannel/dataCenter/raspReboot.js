


module.exports.run = async (bot, message, args)=>{
    message.delete();
    message.channel.send("```Redémarage de la raspberrydans 5s```").then((msg)=>{msg.delete({ timeout:5000 })});
    await bot.basicFunctions.get("wait").run(5500);
    bot.destroy();
    require('child_process').exec('sudo /sbin/shutdown -r now', function (msg) { console.log(msg) });
};

module.exports.help = {
    name: "raspReboot"
};