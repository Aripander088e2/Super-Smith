var coalMineMult = 1;
var ironMineMult = 1;
var copperMineMult = 1;
var moveMult = 1;
var furnaceSpeed = 1;

var flashInterval, flashing;

var produceKeyFuncs = {
    'a':mineIron,
    's':mineCoal,
    'd':mineCopper,
    'j':ironToFurnace,
    'k':() => {coalToFurnace(1)},
    'K':() => {coalToFurnace(2)},
    'l':copperToFurnace,
    'z':() => {manufacture(iron_plate)},
    'x':() => {manufacture(copper_wire)},
    'b':() => {manufacture(iron_bulkhead)},
    'n':() => {manufacture(simple_circuit_board)},
    'm':() => {manufacture(small_engine)},
};

var sellKeyFuncs = {
    'num':num => {sellItem(num)}
}

var upgradeKeyFuncs = {
    'num':num => {buyUpgrade(num,upgrades,renderUpgradeTable)}
}

var automationKeyFuncs = {
    'num':num => {buyUpgrade(num,automations,renderAutomationTable)}
}

var shipyardKeyFuncs = {
    'num':num => {manufacture(ships[Object.keys(ships)[num-1]])}
}

var universalKeyFuncs = {
    'i':() => {return changeMode('produce')},
    'o':() => {return changeMode('sell')},
    'p':() => {return changeMode('upgrade')},
    'u':() => {return changeMode('automation')},
    'y':() => {return changeMode('shipyard')},
}

var modeDict = {
    'produce':{key:'i',
        show:['production-container','furnace1-container','furnace2-container']
    },
    'sell':{id:'sell-items',text:'Sell Items',key:'o',
        show:[]
    },
    'upgrade':{id:'upgrade',text:'Buy Upgrades',key:'p',
        show:['upgrade-container']
    },
    'automation':{id:'automation',text:'Automation',key:'u',
        show:['automation-container']
    },
    'shipyard':{id:'shipyard',text:'Shipyard',key:'u',
        show:['shipyard-container']
    }
}

var masterKeyFuncs = {
    produce:produceKeyFuncs,
    sell:sellKeyFuncs,
    upgrade:upgradeKeyFuncs,
    automation:automationKeyFuncs,
    shipyard:shipyardKeyFuncs
};

var inventories = {player:{},furnace1:{},furnace2:{}};
var inventoryMaxVals = {
    player:{iron_ore:20,coal:40,copper_ore:20,iron_bar:10,copper_bar:10,
    copper_wire:50,iron_plate:20,iron_bulkhead:6,simple_circuit_board:15,small_engine:9},
    furnace1:{iron_ore:5,coal:10},
    furnace2:{copper_ore:5,coal:10}
}

var escape_pod = {name:'escape_pod',val:1000,recipe:{iron_bulkhead:2,small_engine:3,simple_circuit_board:5}};

var ships = {escape_pod:escape_pod};

var smeltCooldown = [0,0];
var maxSmeltCooldown = 60;

let money = 10000;

var mode = "produce";

$(document).keyup(function(e){
    let keyFuncs = masterKeyFuncs[mode];
    if (symbols.indexOf(e.key) != -1)
        keyFuncs.num(symbols.indexOf(e.key) + 10)
    else if (!isNaN(e.key) && keyFuncs.num)
        keyFuncs.num(e.key);
    else if (universalKeyFuncs[e.key])
        universalKeyFuncs[e.key]();
    else if (keyFuncs[e.key])
        keyFuncs[e.key]();
});

function mineIron() {
    addItem(iron_ore,'player',1 * ironMineMult);
}

function mineCopper() {
    addItem(copper_ore,'player',1 * copperMineMult)
}

function mineCoal() {
    addItem(coal,'player',1 * coalMineMult);
}

function ironToFurnace() {
    let amount = 1 * moveMult;
    let max = inventoryMaxVals['furnace1'].iron_ore;
    if (!inventories['furnace1'].iron_ore || inventories['furnace1'].iron_ore < max)
        if (removeItem(iron_ore,'player',amount))
            addItem(iron_ore,'furnace1',amount);
}

function coalToFurnace(num) {
    let amount = 1 * moveMult;
    let max = inventoryMaxVals['furnace' + num].coal;
    if (!inventories['furnace' + num].coal || inventories['furnace' + num].coal < max)
        if (removeItem(coal,'player',amount))
            addItem(coal,'furnace' + num,amount);
}

function copperToFurnace() {
    let amount = 1 * moveMult;
    let max = inventoryMaxVals['furnace2'].copper_ore;
    if (!inventories['furnace2'].copper_ore || inventories['furnace2'].copper_ore < max)
        if (removeItem(copper_ore,'player',amount))
            addItem(copper_ore,'furnace2',amount);
}

function manufacture(item) {
    console.log(item)
    let amount = (item.output != undefined ? item.output : 1);
    if (removeRecipe(item.recipe,'player'))
        addItem(item,'player',amount);
    if (mode == 'shipyard')
        renderShipyard();
}

setInterval(gameTick,50);

function gameTick() {
    furnaceTick();
    furnaceTick();
    autoMineTick();
}

function furnaceTick() {
    // Furnace 1
    let inv = inventories.furnace1;
    if (inv.iron_ore && inv.coal >= 2 && smeltCooldown[0] <= 0) {
        removeItem(iron_ore,'furnace1')
        removeItem(coal,'furnace1',2)
        addItem(iron_bar,'player')
        smeltCooldown[0] = maxSmeltCooldown/furnaceSpeed;
    }
    smeltCooldown[0]--;
    $("#furnace1-inner").width(smeltCooldown[0]/maxSmeltCooldown * 100 + '%');

    // Furnace 2
    inv = inventories.furnace2;
    if (inv.copper_ore && inv.coal >= 2 && smeltCooldown[1] <= 0) {
        removeItem(copper_ore,'furnace2')
        removeItem(coal,'furnace2',2)
        addItem(copper_bar,'player')
        smeltCooldown[1] = maxSmeltCooldown/furnaceSpeed;
    }
    smeltCooldown[1]--;
    $("#furnace2-inner").width(smeltCooldown[1]/maxSmeltCooldown * 100 + '%');
}

function addItem(item,invName,amount = 1) {
    let inventory = inventories[invName];
    let max = inventoryMaxVals[invName][item.name];
    if (inventory[item.name] == undefined)
        inventory[item.name] = amount;
    else
        inventory[item.name] += amount;
    inventory[item.name] = Math.min(inventory[item.name],max);
    renderInventoryTable(invName);
}

function sellItem(num) {
    let item = Object.keys(inventories['player'])[num - 1];
    let amount = removeItem(item,'player','all');
    changeMoney(amount * items[item].val);
}

function buyUpgrade(num,list,renderFunc) {
    let upgrade = list.filter(curr =>{
        return !curr.bought;
    })[num - 1];
    if (money >= upgrade.cost) {
        upgrade.func();
        if (renderFunc == renderUpgradeTable)
            upgrade.bought = true;
        renderFunc();
        changeMoney(-1 * upgrade.cost)
    }
}

function removeItem(item,invName,amount = 1) {
    let inventory = inventories[invName];
    let currItem = (item.name == undefined ? item : item.name);
    let index;
    if (amount == 'all')
        amount = inventory[currItem];
    if (inventory[currItem] == undefined || inventory[currItem] < amount) {
        if (invName == 'player') {
            index = Object.keys(inventory).indexOf(currItem);
            flash($('.player-inventory-row')[index]);
        }
        return 0;
    }
    inventory[currItem] -= amount;
    renderInventoryTable(invName);
    return amount;
}

function removeRecipe(recipe,givenInv) {
    let result = true;
    let insufficient = [];
    let inv = inventories[givenInv];
    let index;
    for (i in recipe)
        if (!inv[i] || recipe[i] > inv[i]) {
            result = false;
            if (givenInv == 'player') {
                index = Object.keys(inv).indexOf(i);
                insufficient.push($('.player-inventory-row')[index]);
            }
        }
    if (!result && givenInv == 'player') {
        flash(insufficient);
        return false;
    }
    for (i in recipe)
        removeItem(i,givenInv,recipe[i]);
    return true;
}

function changeMoney(amount) {
    money += amount;
    $('#money-val').html(money);
}

function renderInventoryTable(invName) {
    let table = '';
    let count = 1;
    let curr,max;
    for (let i in inventories[invName]) {
        max = prettyPrint(inventoryMaxVals[invName][i]);
        table += '<tr class="' + invName + '-inventory-row">';
        table += '<td>' + prettyPrint(i) + ':</td>';
        table += '<td>' + inventories[invName][i] + '/' + max + '</td>';
        if (mode == 'sell' && invName == 'player') {
            table += '<td> $' + items[i].val + '</td>';
            table += '<td> = $' + items[i].val * inventories[invName][i] + '</td>';
            table +=  '<td> [' + count + ']</td>';
        }
        else if (invName == 'player'){
            curr = automations.filter(auto => auto.resource == items[i] && auto.type != 'loader')[0];
            if (curr && curr.maxCooldown) {
                if (i == 'iron_bar')
                    curr = autoIronLoader;
                else if (i == 'copper_bar')
                    curr = autoCopperLoader;
                table += '<td>+' + prettyPrint(curr.amount * (20/curr.maxCooldown)) + '/s</td>';
            }
        }
        table += '</tr>';
        count++;
    }
    $('#' + invName +'-table').html(table);
}

function renderUpgradeTable() {
    let table = ''
    let count = 1;
    for (let i of upgrades) {
        if (!i.bought) {
            table += '<tr>';
            table += '<td class="border-container center"><p>' + i.name + '</p>';
            table += '<p>$' + i.cost + ' [' + count +']</p>';
            table += '</p></tr>';
            count++;
        }
    }
    $('#upgrade-table').html(table);
}

function renderAutomationTable() {
    let table = '';
    let count = 1;
    for (let i of automations) {
        if (count % 2 == 1)
            table += '<tr>';
        table += '<td class="border-container automation-item"><p class="title">';
        table += i.name + '</p>';
        table += '<p>Level:' + i.level + '</p>';
        table += '<p>Upgrade: $' + i.cost + ' [' + (count <= 9 ? count : symbols[count-10]) +']</p></td>';
        if (count % 2 == 0)
            table += '</tr>';
        count++;
    }
    $('#automation-table').html(table);
}

function renderShipyard() {
    let list = '';
    let table, curr;
    let count = 1;
    for (let i in ships) {
        curr = ships[i];
        table = '<li><table class="shipyard-table border-container">'
        table += '<tr><th colspan="2"><span class="title">' + prettyPrint(curr.name) + '</span> [' + count + ']</th></tr>'
        for (let j in curr.recipe) {
            table += '<tr>';
            table += '<td>' + prettyPrint(j) + '</td>';
            table += '<td>' + prettyPrint(inventories.player[j]) + '/' + curr.recipe[j] + '</td>';
            table += '</tr>';
        }
        table += '</table></li>'
        list += table;
        count++;
    }
    $('#shipyard-list').html(list);
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
        renderUpgradeTable();
    else if (given == 'automation')
        renderAutomationTable();
    else if (given == 'shipyard')
        renderShipyard();
    else {
        renderInventoryTable('player');
        renderInventoryTable('furnace1')
        renderInventoryTable('furnace2')
    }
}

function flash(element) {
    if (Array.isArray(flashing))
        for (let i of flashing)
            $(i).removeClass('insufficient');
    else
        $(flashing).removeClass('insufficient');
    clearInterval(flashInterval);
    flashing = element;
    let count = 0;
    flashInterval = setInterval(() => {
        if (Array.isArray(element))
            for (let i of element)
                $(i).toggleClass('insufficient');
        else
            $(element).toggleClass('insufficient');
        count++;
        if (count == 10)
            clearInterval(flashInterval);
    },200)
    
}