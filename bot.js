const Discord = require('discord.js'); 
const eco = require("discord-economy");
 
//Bot clientini olu�tural�m
const client = new Discord.Client();
 
//Botun prefixini, adminini ve tokenini halledelim
const settings = {
  prefix: '',
  token: 'NTM3MjE2MzQ3NTE2NTY3NTYz.Dyi-sg.psqf4vfMm8fCgm6_AOqmtY6f-rY',
  admin:["223435296614645760"]
}

client.on('ready', () => {//bot �evrimi�i olunca "haz�r!" diye log d��er
  console.log("haz�r!")
})
 
//Birisi mesaj yazmaya ba�lad��� anda bu i�lemler devreye girer
//kodlar�n�zda "await" kullan�yorsan�z buraya "async" koymay� unutmay�n
client.on('message', async message => {
 
  //bu kod ise prefixinizdes sonraki mesaj� okuyarak hangi komutu kulland���n�z� anl�yor
  var command = message.content.toLowerCase().slice(settings.prefix.length).split(' ')[0];
 
  //bu ise komutlar�n�zdaki arg�manlar� ay�r�p komutu �zel kullanman�z� sa�l�yor
  var args = message.content.split(' ').slice(1);
 
  //Mesaj prefix ile ba�lamazsa i�lem iptal
  //Mesaj� bot yaz�yosa i�lem iptal
  if (!message.content.startsWith(settings.prefix) || message.author.bot) return;
 
  if (command === 'c�zdan') {
 
    var output = await eco.FetchBalance(message.author.id)
    message.channel.send(`Hey ${message.author.tag}! C�zdan�nda ${output.balance}TL var.`);
  }
 
  if (command === 'g�nl�kpara') {
 
    var output = await eco.Daily(message.author.id)
    //output.updated bize �yenin g�nl�k paras�n� al�p almad���n� s�yler
 
    if (output.updated) {
 
      var profile = await eco.AddToBalance(message.author.id, 100)
      message.reply(`G�nl�k 100TL'ni ald�n! �uan c�zdan�nda ${profile.newbalance}TL var.`);
 
    } else {
      message.channel.send(`�zg�n�m, zaten g�nl�k paran� ald�n!\n Ama �z�lme, ${output.timetowait} sonra tekrar alabilirsin!`)
    }
 
  }

 
  if (command === 'liderliktablosu') {

 
    //E�er birini etiketlerseniz kullan�c�n�n databasedeki� s�ralamas�n� g�sterir
    if (message.mentions.users.first()) {
 
      var output = await eco.Leaderboard({
        filter: x => x.balance > 50,
        search: message.mentions.users.first().id
      })
      message.channel.send(`${message.mentions.users.first().tag}, liderlik tablosunda ${output} s�rada!`);   
 
    } else {
 
      eco.Leaderboard({
        limit: 3, //Only takes top 3 ( Totally Optional )
        filter: x => x.balance > 50 //Only allows people with more than 100 balance ( Totally Optional )
      }).then(async users => { //make sure it is async
 
        if (users[0]) var firstplace = await client.fetchUser(users[0].userid) //Databasedeki 1. �yeyi bulur
        if (users[1]) var secondplace = await client.fetchUser(users[1].userid) //Databasedeki 2. �yeyi bulur
        if (users[2]) var thirdplace = await client.fetchUser(users[2].userid) //Databasedeki 3. �yeyi bulur
 
        message.channel.send(`Liderlik tablom:
 
1 - ${firstplace && firstplace.tag || '�imdilik bo�'} : ${users[0] && users[0].balance || 'Para yok'}
2 - ${secondplace && secondplace.tag || '�imdilik bo�'} : ${users[1] && users[1].balance || 'Para yok'}
3 - ${thirdplace && thirdplace.tag || '�imdilik bo�'} : ${users[2] && users[2].balance || 'Para yok'}`)
 
      })
 
    }
  }
 
  if (command === 'zar') {
 
    var roll = args[0] //1 ile 6 aras�nda bir say� olmal�
    var amount = args[1] //oynayaca��n�z miktar
 
    if (!roll || ![1, 2, 3, 4, 5, 6].includes(parseInt(roll))) return message.reply('L�tfen 1-6 aras� bir say� belirtin! Do�ru kullan�m: **-zar <1-6> <para miktar�>**')
    if (!amount) return message.reply('L�tfen oynayaca��n�z miktar� belirtin! Do�ru kullan�m: **-zar <1-6> <para miktar�>**')
 
    var output = eco.FetchBalance(message.author.id)
    if (output.balance < amount) return message.reply('Belirtti�iniz miktardan daha az paran var. Maalesef sizinle oynayamam.')
 
    var gamble = await eco.Dice(message.author.id, roll, amount).catch(console.error)


    
    if (gamble.output === "lost") {
	message.reply(`Zar ${gamble.dice} at�ld�. Yani kaybettin! Art�k c�zdan�nda ${gamble.newbalance}TL var`)
	} else if (gamble.output === "won"){
	message.reply(`Zar ${gamble.dice} at�ld�. Yani kazand�n! Art�k c�zdan�nda ${gamble.newbalance}TL var`)
	}
    
    //message.reply(`Zar ${gamble.dice} at�ld�. Yani ${gamble.output}! Art�k c�zdan�nda ${gamble.newbalance}TL var`)
 
  }
 

 
  if (command === '�al��') { //Bu komut i�in 2 �rnek yapt�m ikiside �al���yor
 
    var output = await eco.Work(message.author.id)
    //50% �anla bir �ey kazanmama ihtimaliniz var. 1 ile 100 aras�nda para kazan�rs�n�z. 
    if (output.earned == 0) return message.reply('Hmm, i�ini iyi yapamad���n i�in para kazanamad�n.')
    message.channel.send(`${message.author.username}
 \` ${output.job} \` olarak �al��t�n ve :money_with_wings: ${output.earned}TL kazand�n!
Art�k c�zdan�nda :money_with_wings: ${output.balance}TL var`)
 

  }
 
});
 

client.login(settings.token)