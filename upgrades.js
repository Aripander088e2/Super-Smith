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

let copperForging = {name:'Copper Forging',cost:450,bought:false,func(){
    modeDict.produce.show.push('furnace2-container');
    produceKeyFuncs.l = copperToFurnace;
    produceKeyFuncs.K = () => {coalToFurnace(2)};
    $('#load-copper_ore-text').show();
    $('#load_coal2-text').show();
}}

let improvedFurnaceCapacity = {name:'Improved Furnace Capacity',cost:120,bought:false,func(){
    for (let i in inventoryMaxVals.furnace1)
        inventoryMaxVals.furnace1[i] = Math.ceil(inventoryMaxVals.furnace1[i] * 1.5);
    for (let i in inventoryMaxVals.furnace2)
        inventoryMaxVals.furnace2[i] = Math.ceil(inventoryMaxVals.furnace2[i] * 1.5);
}};

let improvedFurnaceSpeed = {name:'Furnace Speed',cost:150,bought:false,func(){
    mults.furnaceSpeed += 0.3;
    upgrades.push(improvedFurnaceCapacity);
    upgrades.push(improvedFurnaceLoading);
    upgrades.push(improvedCoalMining);
}};

let improvedFurnaceSpeed2 = {name:'Furnace Speed II',cost:500,bought:false,func(){
    mults.furnaceSpeed += 0.3;
}};

let improvedFurnaceSpeed3 = {name:'Furnace Speed III',cost:1500,bought:false,func(){
    mults.furnaceSpeed += 0.2;
}};

let improvedFurnaceSpeed4 = {name:'Furnace Speed IV',cost:10000,bought:false,func(){
    mults.furnaceSpeed += 0.2;
}};

let improvedCoalMining = {name:'Improved Coal Mining',cost:250,bought:false,func(){
    mults.coalMineMult += 2;
    upgrades.push(improvedIronMining);
}};

let improvedIronMining = {name:'Improved Iron Mining',cost:350,bought:false,func(){
    mults.ironMineMult += 1;
}};

let copperMining = {name:'Copper Mining',cost:400,bought:false,func(){
    produceKeyFuncs.d = mineCopper;
    $('#copper_ore-text').show();
}};

let improvedFurnaceLoading = {name:'Improved Furnace Loading',cost:200,bought:false,func(){
    mults.moveMult += 1;
}};

let improvedFurnaceCapacity2 = {name:'Improved Furnace Capacity 2',cost:700,bought:false,func(){
    for (let i in inventoryMaxVals.furnace1)
        inventoryMaxVals.furnace1[i] = Math.ceil(inventoryMaxVals.furnace1[i] * 1.5);
    for (let i in inventoryMaxVals.furnace2)
        inventoryMaxVals.furnace2[i] = Math.ceil(inventoryMaxVals.furnace2[i] * 1.5);
}};

let improvedCopperMining = {name:'Improved Copper Mining',cost:600,bought:false,func(){
    mults.copperMineMult += 1;
}};

let improvedAutoMiners = {name:'Improved Auto Miners',cost:750,bought:false,func(){
    mults.autoMineMult++;
    renderInventoryTable('player');
}};

let improvedAutoMiners2 = {name:'Improved Auto Miners 2',cost:2000,bought:false,func(){
    mults.autoMineMult++;
    renderInventoryTable('player');
}};

let ironPlateManufacturing = {name:'Iron Plate Manufacturing',cost:300,bought:false,func(){
    produceKeyFuncs.z = () => {manufacture(iron_plate)};
    $('#iron_plate-text').show();
}};

let copperWireManufacturing = {name:'Copper Wire Manufacturing',cost:700,bought:false,func(){
    produceKeyFuncs.x = () => {manufacture(copper_wire)};
    upgrades.push(improvedFurnaceCapacity2);
    $('#copper_wire-text').show();
}};

let ironBulkheadAssembly = {name:'Iron Bulkhead Assembly',cost:600,bought:false,func(){
    produceKeyFuncs.b = () => {manufacture(iron_bulkhead)};
    //upgrades.push(improvedManufacturing);
    $('#iron_bulkhead-text').show();
}};

let simpleCircuitBoardAssembly = {name:'Simple Circuit Board Assembly',cost:1200,bought:false,func(){
    produceKeyFuncs.n = () => {manufacture(simple_circuit_board)};
    $('#simple_circuit_board-text').show();
    upgrades.push(improvedFurnaceSpeed2);
}};

let smallEngineAssembly = {name:'Small Engine Assembly',cost:2500,bought:false,func(){
    produceKeyFuncs.m = () => {manufacture(small_engine)};
    //upgrades.push(improvedManufacturing2)
    $('#small_engine-text').show();
}};

let improvedManufacturing = {name:'Improved Manufacturing',cost:800,bought:false,func(){
    mults.manufacturingMult += 1;
}};

let improvedManufacturing2 = {name:'Improved Manufacturing II',cost:200,bought:false,func(){
    mults.manufacturingMult += 1;
}};

let improvedAutoManufacturing = {name:'Improved Auto Manufacturing',cost:200,bought:false,func(){
    mults.autoManufacturingMult += 1;
}};

let improvedAutoAssembly = {name:'Improved Auto Assembly',cost:200,bought:false,func(){
    mults.autoAssemblyMult += 1;
}};

let improvedAssembly = {name:'Improved Assembly',cost:200,bought:false,func(){
    mults.assemblyMult += 1;
}};

let improvedAutoAssembly2 = {name:'Improved Auto Assembly 2',cost:200,bought:false,func(){
    mults.autoAssemblyMult += 1;
}};

let improvedAssembly2 = {name:'Improved Assembly 2',cost:200,bought:false,func(){
    mults.assemblyMult += 1;
}};

// Automation Unlock Upgrades 
let automatedCoalMining = {name:'Automated Coal Mining',cost:250,bought:false,func(){
    $('#automation').show();
    universalKeyFuncs.u = () => {return changeMode('automation')};
}};

let automatedIronMining = {name:'Automated Iron Mining',cost:350,bought:false,func(){
    automations.push(autoIronMiner);
}};

let automatedCopperMining = {name:'Automated Copper Mining',cost:550,bought:false,func(){
    automations.push(autoCopperMiner);
}};

let automaticCoalLoading = {name:'Automated Coal Loading',cost:700,bought:false,func(){
    automations.push(autoCoalLoader);
}};

let automaticIronLoading = {name:'Automated Iron Loading',cost:900,bought:false,func(){
    automations.push(autoIronLoader);
}};

let automaticCopperLoading = {name:'Automated Copper Loading',cost:1100,bought:false,func(){
    automations.push(autoCopperLoader);
}};

let automaticIronPlateMaking = {name:'Automated Iron Plate Manufacturing',cost:1500,bought:false,func(){
    automations.push(autoIronPlateMaker);
}};

let automaticCopperWireMaking = {name:'Automated Copper Wire Manufacturing',cost:1800,bought:false,func(){
    automations.push(autoCopperWireMaker);
}};

let automaticIronBulkheadAssembly = {name:'Automated Iron Bulkhead Assembly',cost:3000,bought:false,func(){
    automations.push(autoIronBulkheadAssembler);
}};

let automaticSimpleCircuitBoardAssembly = {name:'Automated Simple Circuit Board Assembly',cost:3500,bought:false,func(){
    automations.push(autoSimpleCircuitBoardAssembler);
}};

let automaticSmallEngineAssembly = {name:'Automated Small Engine Assembly',cost:4000,bought:false,func(){
    automations.push(autoSmallEngineAssembler);
}};
