var upgrades = [];

upgrades.push({name:'Improved Furnace Loading',cost:200,bought:false,func(){
    moveMult += 1;
}});

upgrades.push({name:'Furnace Speed',cost:20,bought:false,func(){
    furnaceSpeed += 1;
}});

upgrades.push({name:'Furnace Speed 2',cost:100,bought:false,func(){
    furnaceSpeed += 1;
}});

upgrades.push({name:'Improved Resource Capacity',cost:60,bought:false,func(){
    let resources = ['iron_ore','coal','copper_ore']
    for (let i of resources)
        inventoryMaxVals.player[i] = Math.ceil(inventoryMaxVals.player[i] * 1.5);
    renderInventoryTable('player');
}});

upgrades.push({name:'Improved Resource Capacity 2',cost:600,bought:false,func(){
    let resources = ['iron_ore','coal','copper_ore']
    for (let i of resources)
        inventoryMaxVals.player[i] = Math.ceil(inventoryMaxVals.player[i] * 1.5);
    renderInventoryTable('player');
}});

upgrades.push({name:'Improved Furnace Capacity',cost:70,bought:false,func(){
    for (let i in inventoryMaxVals.furnace1)
        inventoryMaxVals.furnace1[i] = Math.ceil(inventoryMaxVals.furnace1[i] * 1.5);
    for (let i in inventoryMaxVals.furnace2)
        inventoryMaxVals.furnace2[i] = Math.ceil(inventoryMaxVals.furnace1[i] * 1.5);
}});

upgrades.push({name:'Improved Furnace Capacity 2',cost:300,bought:false,func(){
    for (let i in inventoryMaxVals.furnace1)
        inventoryMaxVals.furnace1[i] = Math.ceil(inventoryMaxVals.furnace1[i] * 1.5);
    for (let i in inventoryMaxVals.furnace2)
        inventoryMaxVals.furnace2[i] = Math.ceil(inventoryMaxVals.furnace1[i] * 1.5);
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

upgrades.push({name:'Improved Coal Mining',cost:50,bought:false,func(){
    coalMineMult += 2;
}});

upgrades.push({name:'Improved Iron Mining',cost:50,bought:false,func(){
    ironMineMult += 1;
}});

upgrades.push({name:'Improved Copper Mining',cost:50,bought:false,func(){
    copperMineMult += 1;
}});

upgrades.push({name:'Improved Auto Miners',cost:200,bought:false,func(){
    for (let i of automations.filter(auto => auto.type == 'miner'))
        i.amount++;
    renderInventoryTable('player');
}});

upgrades.push({name:'Improved Auto Miners',cost:1000,bought:false,func(){
    for (let i of automations.filter(auto => auto.type == 'miner'))
        i.amount++;
    renderInventoryTable('player');
}});