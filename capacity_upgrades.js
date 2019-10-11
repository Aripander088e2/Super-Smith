let capacityUpgradeLevels = {resources:1,manufactured:1,assembly:1};

// Capacity Upgrades (scaling)
let improvedResourceCapacity = function (){
    upgrade = {};
    upgrade.name = 'Improved Resource Capacity ' + toRomanNums(capacityUpgradeLevels.resources);
    upgrade.cost = -28 + 58 * capacityUpgradeLevels.resources + 30 * Math.pow(capacityUpgradeLevels.resources,2);
    upgrade.cost -= upgrade.cost % Math.pow(10,Math.max(parseInt(Math.log(upgrade.cost)/Math.log(10)-2),1));
    upgrade.cost = parseInt(upgrade.cost);
    upgrade.bought = false;
    upgrade.func = () => {
        for (let i of resources)
            inventoryMaxVals.player[i] = Math.ceil(inventoryMaxVals.player[i] * 1.5);
        renderInventoryTable('player');
        capacityUpgradeLevels.resources++;
        resourceCapacityUnlock();
    }
    return upgrade;
};

let improvedManufacturedCapacity = function (){
    upgrade = {};
    upgrade.name = 'Improved Manufactured Capacity ' + toRomanNums(capacityUpgradeLevels.manufactured);
    upgrade.cost = 300 * capacityUpgradeLevels.manufactured + 45 * Math.pow(capacityUpgradeLevels.manufactured,2.1);
    upgrade.cost -= upgrade.cost % Math.pow(10,Math.max(parseInt(Math.log(upgrade.cost)/Math.log(10)-2),1));
    upgrade.cost = parseInt(upgrade.cost);
    upgrade.bought = false;
    upgrade.func = () => {
        for (let i of manufactured)
            inventoryMaxVals.player[i] = Math.ceil(inventoryMaxVals.player[i] * 1.5);
        renderInventoryTable('player');
        manufacturedCapacityUnlock();
        capacityUpgradeLevels.manufactured++;
    }
    return upgrade;
};

let improvedAssemblyCapacity = function (){
    upgrade = {};
    upgrade.name = 'Improved Assembly Capacity ' + toRomanNums(capacityUpgradeLevels.assembly);
    upgrade.cost = 800 * capacityUpgradeLevels.assembly + 60 * Math.pow(capacityUpgradeLevels.assembly,2.2);
    upgrade.cost -= upgrade.cost % Math.pow(10,Math.max(parseInt(Math.log(upgrade.cost)/Math.log(10)-2),1));
    upgrade.cost = parseInt(upgrade.cost);
    upgrade.bought = false;
    upgrade.func = () => {
        for (let i of assembled)
            inventoryMaxVals.player[i] = Math.ceil(inventoryMaxVals.player[i] * 1.5);
        renderInventoryTable('player');
        assemblyCapacityUnlock();
        capacityUpgradeLevels.assembly++;
    }
    return upgrade;
};

// ----- Capacity Unlocks -----
let resourceCapacityUnlock = () => {
    let upgrade = improvedResourceCapacity();
    let newUnlock = unlock({iron_ore:inventoryMaxVals.player.iron_ore * 3,
        copper_ore:(typeof copperMining != 'undefined' && copperMining.bought ? inventoryMaxVals.player.copper_ore * 3 : 0),
        coal:inventoryMaxVals.player.coal * 3},
        ()=>{
            upgrades.push(upgrade);
            $('#new-upgrade').show();
        });
    newUnlock.upgrade = upgrade;
    unlocks.push(newUnlock);
}
resourceCapacityUnlock();

let manufacturedCapacityUnlock = () => {
    let upgrade = improvedManufacturedCapacity();
    let newUnlock = unlock({iron_ore:inventoryMaxVals.player.iron_ore * 3,copper_ore:inventoryMaxVals.player.copper_ore * 3,coal:inventoryMaxVals.player.coal * 3},
        ()=>{
            upgrades.push(upgrade);
            $('#new-upgrade').show();
        })
    newUnlock.upgrade = upgrade;
    unlocks.push(newUnlock);
}
manufacturedCapacityUnlock();

let assemblyCapacityUnlock = () => {
    let upgrade = improvedAssemblyCapacity()
    let newUnlock = unlock({iron_ore:inventoryMaxVals.player.iron_ore * 3,copper_ore:inventoryMaxVals.player.copper_ore * 3,coal:inventoryMaxVals.player.coal * 3},
        ()=>{
            upgrades.push(upgrade);
            $('#new-upgrade').show();
        })
    newUnlock.upgrade = upgrade;
    unlocks.push(newUnlock);
}
assemblyCapacityUnlock();