var upgrades = [];
let coalMining = {name:'Coal Mining',cost:40,bought:false,func(){
    produceKeyFuncs.s = mineCoal;
    $('#coal-text').show();
    upgrades.push(ironForging);
}};

let ironForging = {name:'Iron Forging',cost:65,bought:false,func(){
    modeDict.produce.show.push('furnace1-container');
    produceKeyFuncs.j = ironToFurnace;
    produceKeyFuncs.k = () => {coalToFurnace(1)};
    $('#load-iron_ore-text').show();
    $('#load-coal-text').show();
}}

let copperForging = {name:'Copper Forging',cost:350,bought:false,func(){
    modeDict.produce.show.push('furnace2-container');
    produceKeyFuncs.l = copperToFurnace;
    produceKeyFuncs.K = () => {coalToFurnace(2)};
    $('#load-copper_ore-text').show();
    $('#load-coal2-text').show();
}}

let improvedFurnaceCapacity = {name:'Improved Furnace Capacity',cost:120,bought:false,func(){
    for (let i in inventoryMaxVals.furnace1)
        inventoryMaxVals.furnace1[i] = Math.ceil(inventoryMaxVals.furnace1[i] * 1.5);
    for (let i in inventoryMaxVals.furnace2)
        inventoryMaxVals.furnace2[i] = Math.ceil(inventoryMaxVals.furnace1[i] * 1.5);
}};

let improvedFurnaceSpeed = {name:'Furnace Speed',cost:150,bought:false,func(){
    mults.furnaceSpeed += 1;
    upgrades.push(improvedFurnaceCapacity);
    upgrades.push(improvedFurnaceLoading);
    upgrades.push(improvedCoalMining);
}};

let improvedCoalMining = {name:'Improved Coal Mining',cost:250,bought:false,func(){
    mults.coalMineMult += 2;
    upgrades.push(copperMining);
    upgrades.push(improvedIronMining);
}};

let improvedIronMining = {name:'Improved Iron Mining',cost:50,bought:false,func(){
    mults.ironMineMult += 1;
}};

let automatedCoalMining = {name:'Automated Coal Mining',cost:250,bought:false,func(){
    $('#automation').show();
    universalKeyFuncs.u = () => {return changeMode('automation')};
}};

let copperMining = {name:'Copper Mining',cost:400,bought:false,func(){
    produceKeyFuncs.d = mineCopper;
    $('#copper_ore-text').show();
    if (automations.length == 2 && automations[1].level >= 3 && copperMining.bought)
        automations.push(autoCopperMiner);
}};

let improvedFurnaceLoading = {name:'Improved Furnace Loading',cost:200,bought:false,func(){
    mults.moveMult += 1;
}};

let improvedResourceCapacity = {name:'Improved Resource Capacity',cost:60,bought:false,func(){
    for (let i of resources)
        inventoryMaxVals.player[i] = Math.ceil(inventoryMaxVals.player[i] * 1.5);
    renderInventoryTable('player');
}};

let ironPlateManufacturing = {name:'Iron Plate Manufacturing',cost:300,bought:false,func(){
    produceKeyFuncs.z = () => {manufacture(iron_plate)};
}};

let copperWireManufacturing = {name:'Iron Plate Manufacturing',cost:500,bought:false,func(){
    produceKeyFuncs.x = () => {manufacture(copper_wire)};
    upgrades.push(improvedFurnaceCapacity2);
    upgrades.push(improvedCopperMining);
}};

let improvedFurnaceCapacity2 = {name:'Improved Furnace Capacity 2',cost:300,bought:false,func(){
    for (let i in inventoryMaxVals.furnace1)
        inventoryMaxVals.furnace1[i] = Math.ceil(inventoryMaxVals.furnace1[i] * 1.5);
    for (let i in inventoryMaxVals.furnace2)
        inventoryMaxVals.furnace2[i] = Math.ceil(inventoryMaxVals.furnace1[i] * 1.5);
}};

let improvedCopperMining = {name:'Improved Copper Mining',cost:50,bought:false,func(){
    mults.copperMineMult += 1;
}};

let improvedAutoMiners = {name:'Improved Auto Miners',cost:500,bought:false,func(){
    mults.autoMineMult++;
    renderInventoryTable('player');
}};

let improvedAutoMiners = {name:'Improved Auto Miners 2',cost:2000,bought:false,func(){
    mults.autoMineMult++;
    renderInventoryTable('player');
}};

/*
upgrades.push({name:'Improved Resource Capacity 2',cost:600,bought:false,func(){
    for (let i of resources)
        inventoryMaxVals.player[i] = Math.ceil(inventoryMaxVals.player[i] * 1.5);
    renderInventoryTable('player');
}});

upgrades.push({name:'Improved Manufacturing',cost:200,bought:false,func(){
    mults.manufacturingMult += 1;
}});

upgrades.push({name:'Improved Auto Manufacturing',cost:200,bought:false,func(){
    mults.autoManufacturingMult += 1;
}});

upgrades.push({name:'Improved Assembly',cost:200,bought:false,func(){
    mults.assemblyMult += 1;
}});

upgrades.push({name:'Improved Auto Assembly',cost:200,bought:false,func(){
    mults.autoAssemblyMult += 1;
}});

upgrades.push({name:'Furnace Speed 2',cost:100,bought:false,func(){
    furnaceSpeed += 1;
}});

upgrades.push({name:'Improved Manufacturing Capacity',cost:60,bought:false,func(){
    let products = ['iron_bar','copper_bar','iron_plate','copper_wire']
    for (let i of products)
        inventoryMaxVals.player[i] = Math.ceil(inventoryMaxVals.player[i] * 1.5);
    renderInventoryTable('player');
}});

upgrades.push({name:'Improved Manufacturing Capacity 2',cost:60,bought:false,func(){
    let products = ['iron_bar','copper_bar','iron_plate','copper_wire']
    for (let i of products)
        inventoryMaxVals.player[i] = Math.ceil(inventoryMaxVals.player[i] * 1.5);
    renderInventoryTable('player');
}});

upgrades.push({name:'Improved Assembly Capacity ',cost:60,bought:false,func(){
    let products = ['iron_bulkhead','simple_circuit_board','small_engine'];
    for (let i of products)
        inventoryMaxVals.player[i] = Math.ceil(inventoryMaxVals.player[i] * 1.5);
    renderInventoryTable('player');
}});

upgrades.push({name:'Improved Assembly Capacity 2',cost:60,bought:false,func(){
    let products = ['iron_bulkhead','simple_circuit_board','small_engine'];
    for (let i of products)
        inventoryMaxVals.player[i] = Math.ceil(inventoryMaxVals.player[i] * 1.5);
    renderInventoryTable('player');
}});
*/