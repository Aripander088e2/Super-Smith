var coalMineMult = 1;
var coalMoveMult = 1;
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

var iron_ore = {name:'iron_ore',val:2};
var coal = {name:'coal',val:3};
var copper_ore = {name:'copper_ore',val:5}
var iron_bar = {name:'iron_bar',val:12};
var copper_bar = {name:'copper_bar',val:25};
var copper_wire = {name:'copper_wire',val:7,recipe:{copper_bar:1},output:5};
var iron_plate = {name:'iron_plate',val: 19, recipe:{iron_bar:1}};
var iron_bulkhead = {name:'iron_bulkhead',val:200,recipe:{iron_plate:5}};
var simple_circuit_board = {name:'simple_circuit_board',val:275,recipe:{copper_wire:15,iron_bar:2}};
var small_engine = {name:'small_engine',val:325,recipe:{copper_wire:10,copper_bar:2,iron_bar:3}};

var items = {iron_ore:iron_ore,coal:coal,iron_bar:iron_bar,iron_plate:iron_plate,iron_bulkhead:iron_bulkhead,
    copper_ore:copper_ore,copper_bar:copper_bar,copper_wire:copper_wire,
    simple_circuit_board:simple_circuit_board,small_engine:small_engine};


var escape_pod = {name:'escape_pod',val:1000,recipe:{iron_bulkhead:2,small_engine:3,simple_circuit_board:5}};

var ships = {escape_pod:escape_pod};

var smeltCooldown = [0,0];
var maxSmeltCooldown = 60;

let money = 0;

var mode = "produce";

$(document).keyup(function(e){
    let keyFuncs = masterKeyFuncs[mode];
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

function mineCopper() {
    addItem(copper_ore,'player')
}

function mineCoal() {
    addItem(coal,'player',1 * coalMineMult);
}

function ironToFurnace() {
    if (removeItem(iron_ore,'player'))
        addItem(iron_ore,'furnace1');
}

function coalToFurnace(num) {
    let amount = 1 * coalMoveMult;
    if (removeItem(coal,'player',amount))
        addItem(coal,'furnace' + num,amount);
}

function copperToFurnace() {
    if (removeItem(copper_ore,'player'))
        addItem(copper_ore,'furnace2');
}

function manufacture(item) {
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

    // Furnace 2
    inv = inventories.furnace2;
    if (inv.copper_ore && inv.coal >= 2 && smeltCooldown[1] <= 0) {
        removeItem(copper_ore,'furnace2')
        removeItem(coal,'furnace2',2)
        addItem(copper_bar,'player')
        smeltCooldown[1] = maxSmeltCooldown/furnaceSpeed;
    }
    smeltCooldown[1]--;
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
    for (let i in inventories[invName]) {
        table += '<tr class="' + invName + '-inventory-row">';
        table += '<td>' + prettyPrint(i) + ':</td>';
        table += '<td>' + inventories[invName][i] + '</td>';
        if (mode == 'sell' && invName == 'player') {
            table += '<td> $' + items[i].val + '</td>';
            table += '<td> = $' + items[i].val * inventories[invName][i] + '</td>';
            table +=  '<td> [' + count + ']</td>';
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
        table += '<tr>';
        table += '<td class="border-container automation-item"><p class="title">';
        table += i.name + '</p>';
        table += '<p>Level:' + i.level + '</p>';
        table += '<p>Upgrade: $' + i.cost + ' [' + count +']</p>';
        table += '</td></tr>';
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
    else
        renderInventoryTable('player');
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

function prettyPrint(given) {
    if (given == undefined)
        return 0;
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