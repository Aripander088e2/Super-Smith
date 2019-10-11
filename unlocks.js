let unlocks = [];

function unlock(requirements,func) {
    let newUnlock = {};
    newUnlock.requirements = requirements;
    newUnlock.func = func;
    newUnlock.bought = false;
    return newUnlock;
}

function checkUnlocks() {
    let requirementsMet;
    for (let i = 0; i < unlocks.length; i++) {
        requirementsMet = true;
        for (let j in unlocks[i].requirements)
            if (unlocks[i].bought || unlocks[i].requirements[j] > totalProduced[j])
                requirementsMet = false;
        if (requirementsMet) {
            unlocks[i].func();
            unlocks[i].bought = true;
        }
    }
}

unlocks.push(
    unlock({iron_ore:2},
    ()=>{ $('#iron_ore-press').fadeOut(); })
);

unlocks.push(
    unlock({iron_ore:7},
    ()=>{ 
        $('#sell-items').fadeIn(500);
        universalKeyFuncs.o = () => {return changeMode('sell')};
    })
);

unlocks.push(
    unlock({money:25},
    ()=>{ 
        upgrades.push(coalMining);
        $('#upgrade').fadeIn(500);
        universalKeyFuncs.p = () => {return changeMode('upgrade')};
    })
);

unlocks.push(
    unlock({iron_bar:5},
    ()=>{
        upgrades.push(improvedFurnaceSpeed);
        upgrades.push(automatedCoalMining);
        $('#new-upgrade').show();
    })
);

unlocks.push(
    unlock({iron_bar:40},
    ()=>{
        upgrades.push(improvedFurnaceSpeed2);
        $('#new-upgrade').show();
    })
);

unlocks.push(
    unlock({copper_bar:50},
    ()=>{
        upgrades.push(improvedFurnaceSpeed3);
        $('#new-upgrade').show();
    })
);

unlocks.push(
    unlock({copper_ore:8},
    ()=>{
        upgrades.push(copperForging);
        $('#new-upgrade').show();
    })
);

unlocks.push(
    unlock({small_engine:2},
    ()=>{
        upgrades.push(improvedAssembly);
        $('#new-upgrade').show();
    })
);

unlocks.push(
    unlock({escape_pod:1},
    ()=>{
        upgrades.push(improvedAssembly2);
        upgrades.push(improvedAutoAssembly2);
        $('#new-upgrade').show();
    })
);

unlocks.push(
    unlock({escape_pod:1},
    ()=>{
        upgrades.push(improvedAssembly2);
        upgrades.push(improvedAutoAssembly2);
        $('#new-upgrade').show();
    })
);

// -----  Manufacturing Upgrades ----- 
unlocks.push(
    unlock({iron_bar:20},
    ()=>{
        upgrades.push(ironPlateManufacturing);
        $('#new-upgrade').show();
    })
);

unlocks.push(
    unlock({copper_bar:8},
    ()=>{
        upgrades.push(copperWireManufacturing);
        $('#new-upgrade').show();
    })
);

unlocks.push(
    unlock({copper_bar:20},
    ()=>{
        upgrades.push(improvedCopperMining);
        $('#new-upgrade').show();
    })
);

// ----- Assembly Unlocks ----- 
unlocks.push(
    unlock({iron_plate:20},
    ()=>{
        upgrades.push(ironBulkheadAssembly);
        $('#new-upgrade').show();
    })
);

unlocks.push(
    unlock({copper_wire:100,iron_bar:20},
    ()=>{
        upgrades.push(simpleCircuitBoardAssembly);
        $('#new-upgrade').show();
    })
);

unlocks.push(
    unlock({copper_wire:80,iron_bar:20,copper_bar:20},
    ()=>{
        upgrades.push(smallEngineAssembly);
        $('#new-upgrade').show();
    })
);

unlocks.push(
    unlock({iron_plate:15},
    ()=>{
        upgrades.push(copperMining);
        $('#new-upgrade').show();
    })
);

// ----- Capacity Upgrades -----
let resourceCapacityUnlock = () => {
    unlocks.push(
        unlock({iron_ore:inventoryMaxVals.player.iron_ore * 3,
            copper_ore:(typeof copperMining != 'undefined' && copperMining.bought ? inventoryMaxVals.player.copper_ore * 3 : 0),
            coal:inventoryMaxVals.player.coal * 3},
        ()=>{
            upgrades.push(improvedResourceCapacity());
            $('#new-upgrade').show();
        })
    );
}
resourceCapacityUnlock();

let manufacturedCapacityUnlock = () => {
    unlocks.push(
        unlock({iron_ore:inventoryMaxVals.player.iron_ore * 3,copper_ore:inventoryMaxVals.player.copper_ore * 3,coal:inventoryMaxVals.player.coal * 3},
        ()=>{
            upgrades.push(improvedManufacturedCapacity());
            $('#new-upgrade').show();
        })
    );
}
manufacturedCapacityUnlock();

let assemblyCapacityUnlock = () => {
    unlocks.push(
        unlock({iron_ore:inventoryMaxVals.player.iron_ore * 3,copper_ore:inventoryMaxVals.player.copper_ore * 3,coal:inventoryMaxVals.player.coal * 3},
        ()=>{
            upgrades.push(improvedAssemblyCapacity());
            $('#new-upgrade').show();
        })
    );
}
assemblyCapacityUnlock();

// ----- Automation Unlocks ----- 
unlocks.push(
    unlock({iron_bar:40},
    ()=>{
        automations.push(autoIronMiner);
    })
);

unlocks.push(
    unlock({copper_bar:30},
    ()=>{
        automations.push(autoCopperMiner);
    })
);

unlocks.push(
    unlock({iron_bar:30,copper_bar:20},
    ()=>{
        automations.push(autoCoalLoader);
    })
);

unlocks.push(
    unlock({iron_bar:60},
    ()=>{
        automations.push(autoIronLoader);
    })
);

unlocks.push(
    unlock({copper_bar:40},
    ()=>{
        automations.push(autoCopperLoader);
    })
);

unlocks.push(
    unlock({iron_plate:40},
    ()=>{
        automations.push(autoIronPlateMaker);
    })
);

unlocks.push(
    unlock({copper_wire:300},
    ()=>{
        automations.push(autoCopperWireMaker);
    })
);

unlocks.push(
    unlock({iron_bulkhead:15},
    ()=>{
        automations.push(autoIronBulkheadAssembler);
    })
);

unlocks.push(
    unlock({simple_circuit_board:15},
    ()=>{
        automations.push(autoSimpleCircuitBoardAssembler);
    })
);

unlocks.push(
    unlock({small_engine:15},
    ()=>{
        automations.push(autoSmallEngineAssembler);
    })
);
