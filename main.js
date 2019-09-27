var keyFuncs = {
    'd':mineIron,
    's':mineCoal,
    'f':ironToFurnace,
    'a':coalToFurnace
};

var inventories = {player:{},furnace:{}};

var iron_ore = {name:'iron_ore'};
var coal = {name:'coal'};
var ironBar = {name:'iron_bar'};

var coalCooldown = 0;
var maxCoalCooldown = 10;
var ironCooldown = 0;
var maxIronCooldown = 25;
var smeltCooldown = 0;
var maxSmeltCooldown = 30;

$(document).keydown(function(e){
	$('#key-text').html(e.key);
	$('#key').addClass('key-small');
})

$(document).keyup(function(e){
    $('#key').removeClass('key-small');
    if (keyFuncs[e.key])
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
        addItem(ironBar,'player')
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

function removeItem(item,invName,amount = 1) {
    let inventory = inventories[invName];
    if (inventory[item.name] == undefined || inventory[item.name] < amount)
        return false;
    inventory[item.name] -= amount;
    renderInventoryTable(invName);
    return true;
}

function renderInventoryTable(invName) {
    let table = '';
    for (let i in inventories[invName]) {
        table += '<tr>';
        table += '<td>' + prettyPrint(i) + ':</td>';
        table += '<td>' + inventories[invName][i] + '</td>';
        table += '</tr>';
    }
    $('#' + invName +'Table').html(table);
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