var coalMineMult = 1;
var coalMoveMult = 1;
var furnaceSpeed = 1;

var produceKeyFuncs = {
    'd':mineIron,
    's':mineCoal,
    'k':ironToFurnace,
    'l':coalToFurnace
};

var sellKeyFuncs = {
    'num':num => {sellItem(num)}
}

var upgradeKeyFuncs = {
    'num':num => {buyUpgrade(num,upgrades)}
}

var automationKeyFuncs = {
    'num':num => {buyUpgrade(num,automations)}
}

var universalKeyFuncs = {
    'i':() => {return changeMode('produce')},
    'o':() => {return changeMode('sell')},
    'p':() => {return changeMode('upgrade')},
    'u':() => {return changeMode('automation')},
}

var modeDict = {
    'produce':{key:'i',
        show:['inventory-container','furnace-container']
    },
    'sell':{id:'sell-items',text:'Sell Items',key:'o',
        show:['inventory-container']
    },
    'upgrade':{id:'upgrade',text:'Buy Upgrades',key:'p',
        show:['upgrade-container']
    },
    'automation':{id:'automation',text:'Automation',key:'u',
        show:['upgrade-container']
    }
}

var masterKeyFuncs = {
    produce:produceKeyFuncs,
    sell:sellKeyFuncs,
    upgrade:upgradeKeyFuncs,
    automation:automationKeyFuncs
};

var inventories = {player:{},furnace:{}};

var iron_ore = {name:'iron_ore',val:2};
var coal = {name:'coal',val:3};
var iron_bar = {name:'iron_bar',val:8};
var items = {iron_ore:iron_ore,coal:coal,iron_bar:iron_bar};

var smeltCooldown = 0;
var maxSmeltCooldown = 60;

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
    addItem(coal,'player',1 * coalMineMult);
}

function ironToFurnace() {
    if (removeItem(iron_ore,'player'))
        addItem(iron_ore,'furnace');
}

function coalToFurnace() {
    let amount = 1 * coalMoveMult;
    if (removeItem(coal,'player',amount))
        addItem(coal,'furnace',amount);
}

setInterval(gameTick,50);

function gameTick() {
    furnaceTick();
    autoMineTick();
}

function furnaceTick() {
    let inv = inventories.furnace;
    if (inv.iron_ore && inv.coal >= 2 && smeltCooldown <= 0) {
        removeItem(iron_ore,'furnace')
        removeItem(coal,'furnace',2)
        addItem(iron_bar,'player')
        smeltCooldown = maxSmeltCooldown/furnaceSpeed;
    }
    smeltCooldown--;
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
    changeMoney(amount * items[item].val);
}

function buyUpgrade(num,list) {
    let upgrade = list.filter(curr =>{
        return !curr.bought;
    })[num - 1];
    if (money >= upgrade.cost) {
        upgrade.func();
        upgrade.bought = true;
        renderUpgradeTable(list);
        changeMoney(-1 * upgrade.cost)
    }
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

function changeMoney(amount) {
    money += amount;
    $('#money-val').html(money);
}

function renderInventoryTable(invName) {
    let table = '';
    let count = 1;
    for (let i in inventories[invName]) {
        table += '<tr>';
        table += '<td>' + prettyPrint(i) + ':</td>';
        table += '<td>' + inventories[invName][i] + ' x</td>';
        if (mode == 'sell' && invName == 'player') {
            table += '<td> $' + items[i].val + '</td>';
            table += '<td> = $' + items[i].val * inventories[invName][i] + 
            ' [' + count + ']</td>';
        }
        table += '</tr>';
        count++;
    }
    $('#' + invName +'-table').html(table);
}

function renderUpgradeTable(list) {
    let table = '';
    let count = 1;
    for (let i of list) {
        if (!i.bought) {
            table += '<tr>';
            table += '<td>' + i.name + '</td>';
            table += '<td>$' + i.cost + ' [' + count +']</td>';
            table += '</tr>';
            count++;
        }
    }
    $('#upgrade-table').html(table);
}

function changeMode(given) {
    // If user hits the button they just hit go back
    if (given == mode)
        given = 'produce';
    if (modeDict[given].id)
        $('#' + modeDict[given].id).html('Exit [' + modeDict[given].key + ']')
    for (let i of modeDict[mode].show)
        $('#' + i).hide();
    for (let i of modeDict[given].show)
        $('#' + i).show();
    $('#' + modeDict[mode].id).html(modeDict[mode].text + ' [' + modeDict[mode].key + ']')
    mode = given;
    if (given == 'upgrade')
        renderUpgradeTable(upgrades);
    else if (given == 'automation')
        renderUpgradeTable(automations);
    else
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