var produceKeyFuncs = {
    'd':mineIron,
    's':mineCoal,
    'f':ironToFurnace,
    'a':coalToFurnace
};

var sellKeyFuncs = {
    'num':num => {sellItem(num)}
}

var universalKeyFuncs = {
    'o':() => {return changeMode('sell')},
    'p':() => {return changeMode('upgrade')},
}

var modeDict = {
    'sell':{id:'sell-items',text:'Sell Items',key:'o'},
    'upgrade':{id:'upgrade',text:'Buy Upgrades',key:'p'}
}

var masterKeyFuncs = {produce:produceKeyFuncs,sell:sellKeyFuncs};

var inventories = {player:{},furnace:{}};

var iron_ore = {name:'iron_ore',val:2};
var coal = {name:'coal',val:3};
var iron_bar = {name:'iron_bar',val:8};
var items = {iron_ore:iron_ore,coal:coal,iron_bar:iron_bar};

var coalCooldown = 0;
var maxCoalCooldown = 10;
var ironCooldown = 0;
var maxIronCooldown = 25;
var smeltCooldown = 0;
var maxSmeltCooldown = 30;

let money = 0;

var mode = "produce";

$(document).keydown(function(e){
	$('#key-text').html(e.key);
	$('#key').addClass('key-small');
})

$(document).keyup(function(e){
    let keyFuncs = masterKeyFuncs[mode];
    $('#key').removeClass('key-small');
    if (!isNaN(e.key) && keyFuncs.num)
        keyFuncs.num(e.key);
    else if (universalKeyFuncs[e.key])
        universalKeyFuncs[e.key]();
    else if (keyFuncs[e.key])
        keyFuncs[e.key]();
});

function mineIron() {
    addItem(iron_ore,'player');
}

function mineCoal() {
    addItem(coal,'player');
}

function ironToFurnace() {
    if (removeItem(iron_ore,'player'))
        addItem(iron_ore,'furnace');
}

function coalToFurnace() {
    if (removeItem(coal,'player'))
        addItem(coal,'furnace');
}

setInterval(gameTick,100);

function gameTick() {
    furnaceTick();
}

function furnaceTick() {
    let inv = inventories.furnace;
    if (coalCooldown)
        coalCooldown--;
    if (ironCooldown)
        ironCooldown--;
    if (smeltCooldown)
        smeltCooldown--;
    if (inv.coal && !coalCooldown) {
        removeItem(coal,'furnace')
        coalCooldown = maxCoalCooldown;
    }
    if (inv.iron_ore && !ironCooldown) {
        removeItem(iron_ore,'furnace')
        ironCooldown = maxIronCooldown;
    }
    if (ironCooldown && coalCooldown && !smeltCooldown) {
        addItem(iron_bar,'player')
        smeltCooldown = maxSmeltCooldown;
    }
}

function addItem(item,invName,amount = 1) {
    let inventory = inventories[invName];
    if (inventory[item.name] == undefined)
        inventory[item.name] = amount;
    else
        inventory[item.name] += amount;
    renderInventoryTable(invName);
}

function sellItem(num) {
    let item = Object.keys(inventories['player'])[num - 1];
    let amount = removeItem(item,'player','all');
    money += amount * items[item].val;
    $('#money-val').html(money);
}

function removeItem(item,invName,amount = 1) {
    let inventory = inventories[invName];
    let currItem = (item.name == undefined ? item : item.name);
    if (amount == 'all')
        amount = inventory[currItem];
    if (inventory[currItem] == undefined || inventory[currItem] < amount)
        return 0;
    inventory[currItem] -= amount;
    renderInventoryTable(invName);
    return amount;
}

function renderInventoryTable(invName) {
    let table = '';
    let count = 1;
    for (let i in inventories[invName]) {
        table += '<tr>';
        table += '<td>' + prettyPrint(i) + ':</td>';
        table += '<td>' + inventories[invName][i] + ' x</td>';
        if (mode == 'sell') {
            table += '<td> $' + items[i].val + '</td>';
            table += '<td> = $' + items[i].val * inventories[invName][i] + 
            ' [' + count + ']</td>';
        }
        table += '</tr>';
        count++;
    }
    $('#' + invName +'Table').html(table);
}

function changeMode(given) {
    if (mode == 'produce') {
        $('#' + modeDict[given].id).html('Exit [' + modeDict[given].key + ']')
        mode = given;
    }
    else {
        $('#' + modeDict[given].id).html(modeDict[given].text + ' [' + modeDict[given].key + ']')
        mode = 'produce';
    }
    renderInventoryTable('player');
}

function prettyPrint(given) {
    if (given == undefined)
        return;
    if (isNaN(given)) {
        let arr = given.split('_')
        for (let i = 0; i < arr.length; i++)
            arr[i] = arr[i].substr(0,1).toUpperCase() + arr[i].substr(1);
        return arr.join(' ');
    }
    else {
        if (given < 0.1)
            return '' + (parseInt(given * 100)/100);
        else 
            return '' + (parseInt(given * 10)/10);
    }
}