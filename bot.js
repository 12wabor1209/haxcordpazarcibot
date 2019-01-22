const Discord = require('discord.js'); 
const eco = require("discord-economy");
 
//Bot clientini oluþturalým
const client = new Discord.Client();
 
//Botun prefixini, adminini ve tokenini halledelim
const settings = {
  prefix: '',
  token: 'NTM3MjE2MzQ3NTE2NTY3NTYz.Dyi-sg.psqf4vfMm8fCgm6_AOqmtY6f-rY',
  admin:["223435296614645760"]
}

client.on('ready', () => {//bot çevrimiçi olunca "hazýr!" diye log düþer
  console.log("hazýr!")
})
 
//Birisi mesaj yazmaya baþladýðý anda bu iþlemler devreye girer
//kodlarýnýzda "await" kullanýyorsanýz buraya "async" koymayý unutmayýn
client.on('message', async message => {
 
  //bu kod ise prefixinizdes sonraki mesajý okuyarak hangi komutu kullandýðýnýzý anlýyor
  var command = message.content.toLowerCase().slice(settings.prefix.length).split(' ')[0];
 
  //bu ise komutlarýnýzdaki argümanlarý ayýrýp komutu özel kullanmanýzý saðlýyor
  var args = message.content.split(' ').slice(1);
 
  //Mesaj prefix ile baþlamazsa iþlem iptal
  //Mesajý bot yazýyosa iþlem iptal
  if (!message.content.startsWith(settings.prefix) || message.author.bot) return;
 
  if (command === 'cüzdan') {
 
    var output = await eco.FetchBalance(message.author.id)
    message.channel.send(`Hey ${message.author.tag}! Cüzdanýnda ${output.balance}TL var.`);
  }
 
  if (command === 'günlükpara') {
 
    var output = await eco.Daily(message.author.id)
    //output.updated bize üyenin günlük parasýný alýp almadýðýný söyler
 
    if (output.updated) {
 
      var profile = await eco.AddToBalance(message.author.id, 100)
      message.reply(`Günlük 100TL'ni aldýn! Þuan cüzdanýnda ${profile.newbalance}TL var.`);
 
    } else {
      message.channel.send(`Üzgünüm, zaten günlük paraný aldýn!\n Ama üzülme, ${output.timetowait} sonra tekrar alabilirsin!`)
    }
 
  }

 
  if (command === 'liderliktablosu') {

 
    //Eðer birini etiketlerseniz kullanýcýnýn databasedekiþ sýralamasýný gösterir
    if (message.mentions.users.first()) {
 
      var output = await eco.Leaderboard({
        filter: x => x.balance > 50,
        search: message.mentions.users.first().id
      })
      message.channel.send(`${message.mentions.users.first().tag}, liderlik tablosunda ${output} sýrada!`);   
 
    } else {
 
      eco.Leaderboard({
        limit: 3, //Only takes top 3 ( Totally Optional )
        filter: x => x.balance > 50 //Only allows people with more than 100 balance ( Totally Optional )
      }).then(async users => { //make sure it is async
 
        if (users[0]) var firstplace = await client.fetchUser(users[0].userid) //Databasedeki 1. üyeyi bulur
        if (users[1]) var secondplace = await client.fetchUser(users[1].userid) //Databasedeki 2. üyeyi bulur
        if (users[2]) var thirdplace = await client.fetchUser(users[2].userid) //Databasedeki 3. üyeyi bulur
 
        message.channel.send(`Liderlik tablom:
 
1 - ${firstplace && firstplace.tag || 'Þimdilik boþ'} : ${users[0] && users[0].balance || 'Para yok'}
2 - ${secondplace && secondplace.tag || 'Þimdilik boþ'} : ${users[1] && users[1].balance || 'Para yok'}
3 - ${thirdplace && thirdplace.tag || 'Þimdilik boþ'} : ${users[2] && users[2].balance || 'Para yok'}`)
 
      })
 
    }
  }
 
  if (command === 'zar') {
 
    var roll = args[0] //1 ile 6 arasýnda bir sayý olmalý
    var amount = args[1] //oynayacaðýnýz miktar
 
    if (!roll || ![1, 2, 3, 4, 5, 6].includes(parseInt(roll))) return message.reply('Lütfen 1-6 arasý bir sayý belirtin! Doðru kullaným: **-zar <1-6> <para miktarý>**')
    if (!amount) return message.reply('Lütfen oynayacaðýnýz miktarý belirtin! Doðru kullaným: **-zar <1-6> <para miktarý>**')
 
    var output = eco.FetchBalance(message.author.id)
    if (output.balance < amount) return message.reply('Belirttiðiniz miktardan daha az paran var. Maalesef sizinle oynayamam.')
 
    var gamble = await eco.Dice(message.author.id, roll, amount).catch(console.error)


    
    if (gamble.output === "lost") {
	message.reply(`Zar ${gamble.dice} atýldý. Yani kaybettin! Artýk cüzdanýnda ${gamble.newbalance}TL var`)
	} else if (gamble.output === "won"){
	message.reply(`Zar ${gamble.dice} atýldý. Yani kazandýn! Artýk cüzdanýnda ${gamble.newbalance}TL var`)
	}
    
    //message.reply(`Zar ${gamble.dice} atýldý. Yani ${gamble.output}! Artýk cüzdanýnda ${gamble.newbalance}TL var`)
 
  }
 

 
  if (command === 'çalýþ') { //Bu komut için 2 örnek yaptým ikiside çalýþýyor
 
    var output = await eco.Work(message.author.id)
    //50% þanla bir þey kazanmama ihtimaliniz var. 1 ile 100 arasýnda para kazanýrsýnýz. 
    if (output.earned == 0) return message.reply('Hmm, iþini iyi yapamadýðýn için para kazanamadýn.')
    message.channel.send(`${message.author.username}
 \` ${output.job} \` olarak çalýþtýn ve :money_with_wings: ${output.earned}TL kazandýn!
Artýk cüzdanýnda :money_with_wings: ${output.balance}TL var`)
 

  }
 
});
 

client.login(settings.token)