const electron = require('electron');

const { app, BrowserWindow, TouchBar } = require('electron');
const { TouchBarLabel, TouchBarButton, TouchBarSpacer } = TouchBar;
const path = require('path');
const url = require('url');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.

var player = require('play-sound')(opts = {})

let balance = 0; // total cookies
let timer = 0; // seconds timer
let clickinterval = 1; // click intervals

setInterval(increasetimer, 1000); 
setInterval(updatescreentimer, 10); 

// Timers
var autoclicktimer;
var grandmatimer;

// Power Click
let pcname = "👆🏽"; // name
let pcprice = 100; // price
let pcincrease = clickinterval*2; // double clicks
let pclvl = 0; // level

// Auto Click
let autoclickname = "🤖"; // name
let autoclickprice = 50; // price
let autoclickincrease = 1; // update by 1
let autolvl = 0; // level

// Grandma Factory
let grandmaname = "👵🏽"; // name
let grandmaprice = 2000; // price
let grandmaincrease = 100; // update by 100
let grandmalvl = 0; // level

// Achievements
const achievement = new TouchBarLabel();
var achievementnumber = 0; // Keep track of number of achievement



// Cookies button
const mainCoins = new TouchBarButton({
    label: '🍪 ' + balance,
    backgroundColor: '#7851A9',
    click: () => {

        // Balance update
        balance = balance+clickinterval;
        mainCoins.label = '🍪 ' + Beautify(balance);

        // Show + pop
        let mainWindow = BrowserWindow.getFocusedWindow();
        if(mainWindow != null){
            mainWindow.webContents.send('cl-pop', Beautify(clickinterval))
        }  

        // Check balance and enable/disable products
        checkProducts();

        player.play('sounds/click'+Math.floor(Math.random()*7+1)+'.mp3', { afplay: ['-v', 6 ] }, function(err){
            if (err) throw err
          })
          
    }
});


// Power Clicks button
const pc = new TouchBarButton({
    label: pcname + ' 🍪 ' + pcprice,
    backgroundColor: '#282828',
    click: () => {

        // Products
        if (balance >= pcprice) {
            balance = balance-pcprice;
            mainCoins.label = '🍪 ' + Beautify(balance);

            // Increase power clicks
            clickinterval += pcincrease

            // Check balance and enable/disable products
            checkProducts();

            pcprice = pcprice*3
            pcincrease = pcincrease*2

            pc.label = pcname + ' 🍪 ' + Beautify(pcprice);

            pclvl = pclvl+1;
            updateScreen("powerlvl", pclvl + ' (+' + Beautify(pcincrease) + '/click)')

            player.play('sounds/buy.mp3', function(err){
            if (err) throw err })
        
        }
    }
    
});

// autoclick button
const autoclick = new TouchBarButton({
    label: autoclickname + ' 🍪 ' + autoclickprice,
    backgroundColor: '#282828',
    click: () => {

        // Products
        if (balance >= autoclickprice) {
            balance = balance-autoclickprice;
            mainCoins.label = ' 🍪' + Beautify(balance);

            // Destroy old increase timer
            if(autoclicktimer){
            clearInterval(autoclicktimer);
            }

            // Start increase timer
            autoclicktimer = setInterval(autoclickBuy, 1000); 

            // Check balance and enable/disable products
            checkProducts();

            // Set up next autoclick info
            autoclickprice = autoclickprice * 3
            autoclickincrease = autoclickincrease * 2
            autoclick.label = autoclickname + ' 🍪 ' + Beautify(autoclickprice);

            autolvl = autolvl+1;
            updateScreen("autolvl", autolvl + ' (+' + Beautify(autoclickincrease) + '/sec)')

            player.play('sounds/buy.mp3', function(err){
                if (err) throw err })
        
        }
    }
    
});


// Grandma button
const grandma = new TouchBarButton({
    label: grandmaname + ' 🍪 ' + grandmaprice,
    backgroundColor: '#282828',
    click: () => {

        // Products
        if (balance >= grandmaprice) {
            balance = balance-grandmaprice;
            mainCoins.label = ' 🍪' + Beautify(balance);

            // Destroy old increase timer
            if(grandmatimer){
            clearInterval(grandmatimer);
            }

            // Start increase timer
            grandmatimer = setInterval(grandmaBuy, 1000); 

            // Check balance and enable/disable products
            checkProducts();

            // Set up next grandma info
            grandmaprice = grandmaprice * 4
            grandmaincrease = grandmaincrease * 2
            grandma.label = grandmaname + ' 🍪 ' + Beautify(grandmaprice);

            grandmalvl = grandmalvl+1;
            updateScreen("grandmalvl", grandmalvl + ' (+' + Beautify(grandmaincrease) + '/sec)')

            player.play('sounds/buy.mp3', function(err){
                if (err) throw err })
        
        }
    }
    
});


function autoclickBuy() {
    balance = balance+autoclickincrease;
    mainCoins.label = '🍪 ' + Beautify(balance);

    // Show + pop
    let mainWindow = BrowserWindow.getFocusedWindow();
    if(mainWindow != null){
        mainWindow.webContents.send('ac-pop', Beautify(autoclickincrease))
    }  

    // Products
    checkProducts()
}

function grandmaBuy() {
    balance = balance+grandmaincrease;
    mainCoins.label = '🍪 ' + Beautify(balance);

    // Show + pop
    let mainWindow = BrowserWindow.getFocusedWindow();
    if(mainWindow != null){
        mainWindow.webContents.send('gr-pop', Beautify(grandmaincrease))
    }  

    // Products
    checkProducts()
}

function increasetimer() {
    timer = timer+1;
    updateScreen("timer", timer + ' seconds')
}

function updatescreentimer() {
    updateScreen("balance", balance)
}

function updateScreen(type, info){
    let mainWindow = BrowserWindow.getFocusedWindow();
    if(mainWindow != null){
    switch (type) {
        case "balance":
            mainWindow.webContents.send('cookies', Beautify(info))
            break;
        case "powerlvl":
            mainWindow.webContents.send('powerlvl', info)
            break;
        case "autolvl":
            mainWindow.webContents.send('autolvl', info)
            break; 
        case "grandmalvl":
            mainWindow.webContents.send('grandmalvl', info)
            break; 
        case "timer":
            mainWindow.webContents.send('timer', info)
            break; 
        default:
            break;
        }
    }

}

function checkProducts(){
    if (balance <= pcprice){
        // Disable Power Click
        pc.backgroundColor = '#282828';
    }
    if (balance <= autoclickprice){
        // Disable Power Click
        autoclick.backgroundColor = '#282828';
    }
    if (balance <= grandmaprice){
        // Disable Grandma
        grandma.backgroundColor = '#282828';
    }

    if (balance >= pcprice) {
        // Enable Power Click
        pc.backgroundColor = '#98AFC7';
    }
    if (balance >= autoclickprice) {
        // Enable Power Click
        autoclick.backgroundColor = '#98AFC7';
    }
    if (balance >= grandmaprice) {
        // Enable Granda Click
        grandma.backgroundColor = '#98AFC7';
    }
}


// Unlock achievements not implemented yet - feel free to play around with this feature! 

function unlockedAchievement(info){
    achievement.label = "Achievement: " + info;
    player.play('sounds/unlocked.mp3', { afplay: ['-v', 6 ] }, function(err){
        if (err) throw err
      })
    achievementnumber = achievementnumber+1;
}


//Beautify and number-formatting adapted from the Frozen Cookies add-on (http://cookieclicker.wikia.com/wiki/Frozen_Cookies_%28JavaScript_Add-on%29)

function formatEveryThirdPower(notations)
{
	return function (value)
	{
		var base = 0,
		notationValue = '';
		if (!isFinite(value)) return 'Infinity';
		if (value >= 1000000)
		{
			value /= 1000;
			while(Math.round(value) >= 1000)
			{
				value /= 1000;
				base++;
			}
			if (base >= notations.length) {return 'Infinity';} else {notationValue = notations[base];}
		}
		return ( Math.round(value * 1000) / 1000 ) + notationValue;
	};
}

function rawFormatter(value) {return Math.round(value * 1000) / 1000;}

var formatLong=[' thousand',' million',' billion',' trillion',' quadrillion',' quintillion',' sextillion',' septillion',' octillion',' nonillion'];
var prefixes=['','un','duo','tre','quattuor','quin','sex','septen','octo','novem'];
var suffixes=['decillion','vigintillion','trigintillion','quadragintillion','quinquagintillion','sexagintillion','septuagintillion','octogintillion','nonagintillion'];
for (var i in suffixes)
{
	for (var ii in prefixes)
	{
		formatLong.push(' '+prefixes[ii]+suffixes[i]);
	}
}

var formatShort=['k','M','B','T','Qa','Qi','Sx','Sp','Oc','No'];
var prefixes=['','Un','Do','Tr','Qa','Qi','Sx','Sp','Oc','No'];
var suffixes=['D','V','T','Qa','Qi','Sx','Sp','O','N'];
for (var i in suffixes)
{
	for (var ii in prefixes)
	{
		formatShort.push(' '+prefixes[ii]+suffixes[i]);
	}
}
formatShort[10]='Dc';

// Types of number formats: [short, long, raw]
var numberFormatters =[formatEveryThirdPower(formatShort),formatEveryThirdPower(formatLong),rawFormatter];

function Beautify(value,floats)
{
	var negative=(value<0);
	var decimal='';
	var fixed=value.toFixed(floats);
	if (Math.abs(value)<1000 && floats>0 && Math.floor(fixed)!=fixed) decimal='.'+(fixed.toString()).split('.')[1];
	value=Math.floor(Math.abs(value));
	if (floats>0 && fixed==value+1) value++;
	var formatter=numberFormatters[1];
	var output=formatter(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g,',');
	if (output=='0') negative=false;
	return negative?'-'+output:output+decimal;
}


const touchBar = new TouchBar([
    new TouchBarSpacer({size: 'flexible'}),
    pc,
    new TouchBarSpacer({size: 'flexible'}),
    autoclick,
    new TouchBarSpacer({size: 'flexible'}),
    grandma,
    new TouchBarSpacer({size: 'flexible'}),
    achievement,
]);

touchBar.escapeItem = mainCoins;

// Ready function
function ready() {

	// "Fill" the window
	mainWindow = new BrowserWindow({
		width: 800,
		heihgt: 800,
		resizable: false,
		fullscreenable: false
	})

	// Set the touchbar
	mainWindow.setTouchBar(touchBar);

	// Load the render process
    mainWindow.loadURL('file://' + __dirname + '/index.html');

	// On close destroy the window
	mainWindow.on('close', () => {
		mainWindow = null;
	})
};

// Once app is ready
app.on('ready', ready)

// If all windows are all closed
app.on('window-all-closed', () => {
    // Save
	// Kill the process if the platform is not "macOS / OSX"
	if (process.platform !== 'darwin') {
		app.quit();
	}
})

app.on('activate', () => {
	const windows = BrowserWindow.getAllWindows().length;
	if (windows === 0) ready()
})