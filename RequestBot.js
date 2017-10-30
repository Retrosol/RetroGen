const Discord = require("discord.js");
const client = new Discord.Client();
const fs = require("fs");
const config = require("./config.json");
const base = require("./Roles/base.json");
let data
fs.readFile("./Roles/data.json", (err, content) => {
  if(err) {
    console.log("error when reading data.json:\n" + err);
    process.exit(1);
  } else {
      try {
        data = JSON.parse(content);
      } catch (e) {
          console.log("error when parsing data.json:\n" + e);
          process.exit(1);
      }
    }
});
let saveData = () => {
    fs.writeFile("./Roles/data.json", JSON.stringify(data), (a) => {(a) ? console.log("error writing save to data.json:\n" + a) : ""})
};
client.on('ready', () => {
console.log("Let's Make Some Pokemon!")
});

client.on('message', message => {
  if (message.author === client.user) return;
  if (message.channel.type != 'dm') {
    const guildID = message.member.guild.id
    if (!data[guildID]) {
      data[guildID] = Object.assign({}, base);
      saveData();
    }
    if (!data[guildID].autorole) {
      data[guildID].autorole = "";
      saveData();
    }
    if (message.content.startsWith(message.author +  " Submitted the following team:")) {
      setTimeout(() => {
        message.delete()
     }, 17280000)
   }
  }
  if (message.channel.type === 'dm') {
    if (message.content.startsWith("http://pokepast.es/") || message.content.includes("-")) {
        client.channels.get("337475517362208769").send(message.author +  " Submitted the following team:\n " + "```" + message.content + "```")
        message.author.send("Success!")
        //message.author.send("Please Remember to only request **3** mons per day!")
        return;
    }
    else if (message.attachments != undefined) {
      client.channels.get("337475517362208769").send(message.author + " Submitted the following team:\n" + message.attachments.first().url)
      message.author.send("Success!")
      //message.author.send("Please Remember to only request **3** mons per day!")
      return;
    }
    if (true) {
      message.author.send(`Hey ${message.author.username}\nI am an All Purpose Server-Wide Genning RequestBot. Please send me your http://pokepast.es/ or http://play.pokemonshowdown.com/teambuilder to begin.`);
    }
  }
});
client.on('guildCreate', newGuild => {
    const invite = newGuild.defaultChannel.createInvite({
      "temporary": "false",
      "maxAge": "86400",
      "maxUses": "100"
    }).then( invite => {
      client.channels.get("343144704810156042").sendMessage(`RequestBot was added to a server called "${newGuild.name}".\nServer invite: ${invite}`);
    })
    newGuild.defaultChannel.sendMessage('Thank you for adding me to your Server!, DM me to get started.')
});
client.on("guildMemberAdd", (member) => {
    const guildID = member.guild.id
    if (!data[guildID]) {
      data[guildID] = Object.assign({}, base);
      saveData();
    }
    if (!data[guildID].autorole) {
      data[guildID].autorole = "";
      saveData();
    }
    if (!data[guildID].autorole || data[guildID].autorole == "") return;
    const role = member.guild.roles.find("name", data[guildID].autorole)
    member.addRole(role)
    saveData();
})

client.login(config.token);