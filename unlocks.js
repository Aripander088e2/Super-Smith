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
            if (unlocks[i].requirements[j] > totalProduced[j])
                requirementsMet = false;
        if (requirementsMet) {
            unlocks[i].func();
            unlocks.splice(i,1);
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
    unlock({coal:10},
    ()=>{
        upgrades.push(improvedFurnaceSpeed);
        upgrades.push(automatedCoalMining);
        $('#new-upgrade').show();
    })
);

unlocks.push(
    unlock({iron_bar:7},
    ()=>{
        upgrades.push(improvedResourceCapacity);
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
    unlock({iron_ore:30},
    ()=>{
        upgrades.push(improvedResourceCapacity);
        $('#new-upgrade').show();
    })
);

unlocks.push(
    unlock({iron_ore:60},
    ()=>{
        upgrades.push(improvedResourceCapacity2);
        $('#new-upgrade').show();
    })
);

unlocks.push(
    unlock({iron_bar:20},
    ()=>{
        upgrades.push(improvedManufacturingCapacity);
        $('#new-upgrade').show();
    })
);

unlocks.push(
    unlock({copper_bar:20},
    ()=>{
        upgrades.push(improvedManufacturingCapacity2);
        $('#new-upgrade').show();
    })
);

unlocks.push(
    unlock({iron_bulkhead:6,copper_wire:50},
    ()=>{
        upgrades.push(improvedAssemblyCapacity);
        $('#new-upgrade').show();
    })
);

unlocks.push(
    unlock({simple_circuit_board:2,small_engine:2},
    ()=>{
        upgrades.push(improvedAssemblyCapacity2);
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
    unlock({iron_bar:12},
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

// ----- Automation Unlocks ----- 
unlocks.push(
    unlock({iron_ore:40},
    ()=>{
        automations.push(autoIronMiner);
    })
);

unlocks.push(
    unlock({copper_ore:30},
    ()=>{
        automations.push(autoCopperMiner);
    })
);

unlocks.push(
    unlock({iron_bar:30,copper_bar:10},
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
    unlock({iron_plate:20},
    ()=>{
        automations.push(autoIronPlateMaker);
    })
);

unlocks.push(
    unlock({copper_wire:100},
    ()=>{
        automations.push(autoCopperWireMaker);
    })
);

unlocks.push(
    unlock({iron_bulkhead:10},
    ()=>{
        automations.push(autoIronBulkheadAssembler);
    })
);

unlocks.push(
    unlock({simple_circuit_board:10},
    ()=>{
        automations.push(autoSimpleCircuitBoardAssembler);
    })
);

unlocks.push(
    unlock({small_engine:10},
    ()=>{
        automations.push(autoSmallEngineAssembler);
    })
);
