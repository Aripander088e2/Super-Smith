var mode = "produce";
var subMode = '';

var mults = {};
mults.coalMineMult = 1;
mults.ironMineMult = 1;
mults.copperMineMult = 1;
mults.autoMineMult = 1;
mults.moveMult = 1;
mults.furnaceSpeed = 1;

mults.manufacturingMult = 1;
mults.autoManufacturingMult = 1;
mults.assemblyMult = 1;
mults.autoAssemblyMult = 1;

var flashInterval, flashing;

var progressStage = 0;

var unlocks = [
    ()=>{ $('#iron_ore-press').fadeOut();},
    ()=>{
        $('#sell-items').fadeIn(500);
        universalKeyFuncs.o = () => {return changeMode('sell')};
    },
    ()=>{
        upgrades.push(coalMining);
        $('#upgrade').fadeIn(500);
        universalKeyFuncs.p = () => {return changeMode('upgrade')};
    },
    ()=>{
        upgrades.push(improvedFurnaceSpeed);
        upgrades.push(automatedCoalMining);
        $('#new-upgrade').show();
    },
    ()=>{
        upgrades.push(improvedResourceCapacity);
        $('#new-upgrade').show();
    },
    ()=>{
        upgrades.push(ironPlateManufacturing);
        $('#new-upgrade').show();
    }
    ()=>{
        upgrades.push(copperForging);
        $('#new-upgrade').show();
    },
    ()=>{
        upgrades.push(copperWireManufacturing);
        $('#new-upgrade').show();
    }
]

var produceKeyFuncs = {
    'a':mineIron,
    'b':() => {manufacture(iron_bulkhead)},
    'n':() => {manufacture(simple_circuit_board)},
    'm':() => {manufacture(small_engine)},
};

var sellKeyFuncs = {
    'num':num => {sellItem(num)}
}

var upgradeKeyFuncs = {
    'num':num => {buyUpgrade(num,upgrades,renderUpgradeTable)},
}

var automationKeyFuncs = {
    'num':num => {(subMode == '' ? buyUpgrade(num,automations,renderAutomationTable) : toggleAutomation(num))},
    't':automationModeToggle
}

var shipyardKeyFuncs = {
    'num':num => {manufacture(ships[Object.keys(ships)[num-1]])}
}

var universalKeyFuncs = {
    'i':() => {return changeMode('produce')},
    'y':() => {return changeMode('shipyard')},
}

var modeDict = {
    'produce':{key:'i',
        show:['production-container']
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
    player:{iron_ore:20,coal:40,copper_ore:20,iron_bar:20,copper_bar:20,
    copper_wire:50,iron_plate:20,iron_bulkhead:6,simple_circuit_board:15,small_engine:9},
    furnace1:{iron_ore:5,coal:10},
    furnace2:{copper_ore:5,coal:10}
}

var escape_pod = {name:'escape_pod',val:1000,recipe:{iron_bulkhead:2,small_engine:3,simple_circuit_board:5}};

var ships = {escape_pod:escape_pod};

var smeltCooldown = [0,0];
var maxSmeltCooldown = 60;

let money = 0;

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

function newUnlock() {
    unlocks.shift()();
    progressStage++;
}

function mineIron() {
    addItem(iron_ore,'player',1 * mults.ironMineMult);
    if (progressStage == 0 && inventories['player'].iron_ore == 2)
        newUnlock();
    else if (progressStage == 1 && inventories['player'].iron_ore == 7)
        newUnlock();
}

function mineCopper() {
    addItem(copper_ore,'player',1 * mults.copperMineMult)
    if (progressStage >= 6 && progressStage < 7)
        progressStage += 0.1;
    if (progressStage >= 6.8 && progressStage < 7) {
        progressStage = 6;
        newUnlock();
    }
}

function mineCoal() {
    addItem(coal,'player',1 * mults.coalMineMult);
    if (progressStage == 4 && inventories.player.coal > 20)
        newUnlock();
}

function ironToFurnace() {
    let amount = 1 * mults.moveMult;
    let max = inventoryMaxVals['furnace1'].iron_ore;
    if (!inventories['furnace1'].iron_ore || inventories['furnace1'].iron_ore < max)
        if (canAfford(iron_ore,'player',amount)) {
            removeItem(iron_ore,'player',amount);
            addItem(iron_ore,'furnace1',amount);
        }
}

function canAfford(item,givenInv,amount) {
    console.log(item,amount)
    let inv = inventories[givenInv];
    let result = true
    let index;
    let insufficient = [];
    if (!item.name) {
        for (i in item)
            if (!inv[i] || item[i] * amount > inv[i]) {
                result = false;
                if (givenInv == 'player') {
                    index = Object.keys(inv).indexOf(i);
                    insufficient.push($('.player-inventory-row')[index]);
                }
            }
        if (!result && givenInv == 'player') {
            flash(insufficient);
        }
    }
    else {
        result = (inv[item.name] != undefined && inv[item.name] >= amount);
        if (givenInv == 'player' && !result) {
            index = Object.keys(inv).indexOf(item.name);
            flash($('.player-inventory-row')[index]);
        }
    }
    return result;
}

function coalToFurnace(num) {
    let amount = 1 * mults.moveMult;
    let max = inventoryMaxVals['furnace' + num].coal;
    if (!inventories['furnace' + num].coal || inventories['furnace' + num].coal < max)
        if (canAfford(coal,'player',amount)) {
            removeItem(coal,'player',amount);
            addItem(coal,'furnace' + num,amount);
        }
}

function copperToFurnace() {
    let amount = 1 * mults.moveMult;
    let max = inventoryMaxVals['furnace2'].copper_ore;
    if (!inventories['furnace2'].copper_ore || inventories['furnace2'].copper_ore < max)
        if (canAfford(copper_ore,'player',amount)) {
            removeItem(copper_ore,'player',amount);
            addItem(copper_ore,'furnace2',amount);
        }
}

function manufacture(item,auto = false) {
    let amount = (item.output != undefined ? item.output : 1);
    let mult = 1;
    if (manufactured.indexOf(item.name) != -1)
        mult = (auto ? 'autoManufacturingMult' : 'manufacturingMult')
    else if (assembled.indexOf(item.name) != -1)
        mult = (auto ? 'autoAssemblyMult' : 'assemblyMult')
    amount *= mults[mult];
    if (canAfford(item.recipe,'player',mults[mult])) {
        removeRecipe(item,'player',mults[mult]);
        addItem(item,'player',amount);
    }
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
        smeltCooldown[0] = maxSmeltCooldown/mults.furnaceSpeed;
        if (progressStage >= 3 && progressStage < 4)
            progressStage += 0.1;
        if (progressStage >= 3.4 && progressStage < 4) {
            progressStage = 3;
            newUnlock();
        }
        if (progressStage >= 5 && progressStage < 6)
            progressStage += 0.1;
        if (progressStage >= 5.9 && progressStage < 6) {
            progressStage = 5;
            newUnlock();
        }
    }
    smeltCooldown[0]--;
    $("#furnace1-inner").width(smeltCooldown[0]/(maxSmeltCooldown/mults.furnaceSpeed) * 100 + '%');

    // Furnace 2
    inv = inventories.furnace2;
    if (inv.copper_ore && inv.coal >= 2 && smeltCooldown[1] <= 0) {
        removeItem(copper_ore,'furnace2')
        removeItem(coal,'furnace2',2)
        addItem(copper_bar,'player')
        smeltCooldown[1] = maxSmeltCooldown/mults.furnaceSpeed;
        if (progressStage >= 7 && progressStage < 8)
            progressStage += 0.1;
        if (progressStage >= 7.5 && progressStage < 8) {
            progressStage = 7;
            newUnlock();
        }
    }
    smeltCooldown[1]--;
    $("#furnace2-inner").width(smeltCooldown[1]/(maxSmeltCooldown/mults.furnaceSpeed) * 100 + '%');
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
    let amount = inventories['player'][items[item].name];
    removeItem(item,'player','all');
    changeMoney(amount * items[item].val);
}

function automationModeToggle() {
    subMode = (subMode == '' ? 'toggle' : '');
    $('#automation-toggle-text').html((subMode == '' ? 'Toggle Mode [t]' : 'Buy Mode [t]'));
    renderAutomationTable();
}

function buyUpgrade(num,list,renderFunc) {
    let upgrade = list.filter(curr =>{
        return !curr.bought;
    })[num - 1];
    if (money >= upgrade.cost) {
        changeMoney(-1 * upgrade.cost)
        upgrade.func();
        if (renderFunc == renderUpgradeTable)
            upgrade.bought = true;
        renderFunc();
    }
}

function toggleAutomation(num) {
    automations[num - 1].on = !automations[num-1].on;
    renderAutomationTable();
    renderInventoryTable('player');
}

function removeItem(item,invName,amount = 1) {
    let inventory = inventories[invName];
    let currItem = (item.name == undefined ? item : item.name);
    if (amount == 'all')
        amount = inventory[currItem];
    inventory[currItem] -= amount;
    renderInventoryTable(invName);
}

function removeRecipe(item,givenInv,mult) {
    for (i in item.recipe)
        removeItem(items[i],givenInv,item.recipe[i]*mult);
}

function changeMoney(amount) {
    money += amount;
    $('#money-val').html(money);
    if (progressStage == 2 && money >= 25)
        newUnlock();
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
            table += '<td> x $' + items[i].val + '</td>';
            table += '<td> = $' + items[i].val * inventories[invName][i] + '</td>';
            table +=  '<td> [' + count + ']</td>';
        }
        else if (invName == 'player'){
            curr = automations.filter(auto => auto.resource == items[i] && auto.type != 'loader')[0];
            if (curr && curr.maxCooldown && curr.on) {
                let mult = 1;
                if (resources.indexOf(curr.resource.name) != -1)
                    mult = 'autoMineMult';
                else if (manufactured.indexOf(curr.resource.name) != -1)
                    mult = 'autoManufacturingMult';
                else if (assembled.indexOf(curr.resource.name) != -1)
                    mult = 'autoAssemblyMult';
                if (i == 'iron_bar')
                    curr = 'autoIronLoader';
                else if (i == 'copper_bar')
                    curr = autoCopperLoader;
                table += '<td>+' + prettyPrint(curr.amount * mults[mult] * (20/curr.maxCooldown)) + '/s</td>';
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
        if (!i.bought && count <= 9) {
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
        table += '<td class="border-container automation-item ' + (i.on ? '' : 'red-border') + '"><p class="title">';
        table += i.name + '</p>';
        table += '<p>Level:' + i.level + '</p>';
        if (subMode == '')
            table += '<p>Upgrade: $' + i.cost + ' [' + (count <= 9 ? count : symbols[count-10]) +']</p></td>';
        else {
            table += '<p> <span class="' + (i.on ? 'green' : 'red') + '">' + (i.on ? 'On' : 'Off');
            table += '</span> [' + (count <= 9 ? count : symbols[count-10]) +']</p></td>';
        }
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
    if (given == 'upgrade') {
        $('#new-upgrade').hide();
        renderUpgradeTable();
    }
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

function save() {
    let save = {};
    save.mode = mode;
    save.money = money;
    save.inventories = inventories;
    save.inventoryMaxVals = inventoryMaxVals;
    save.upgrades = upgrades;
    save.automations = automations;
    save.mults = mults;
    console.log(upgrades,save.upgrades)
    window.sessionStorage.superSmith = JSON.stringify(save);
}

function load() {
    let save = JSON.parse(window.sessionStorage.superSmith);
    money = save.money;
    inventories = save.inventories;
    inventoryMaxVals = save.inventoryMaxVals;
    upgrades = save.upgrades;
    automations = save.automations;
    mults = save.mults;
    console.log(upgrades,save.upgrades)
    changeMode(save.mode);
    changeMoney(0);
}