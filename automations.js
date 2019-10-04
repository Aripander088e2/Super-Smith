let autoCoalMiner = autoMiner('coal',30,60);
let autoIronMiner = autoMiner('iron_ore',40,70);
let autoCopperMiner = autoMiner('copper_ore',50,80);

let autoCoalLoader = autoDoer('coal','Loader',()=>{coalToFurnace(1); coalToFurnace(2);},45,120);
let autoIronLoader = autoDoer('iron_ore','Loader',()=>{ironToFurnace()},65,140);
let autoCopperLoader = autoDoer('copper_ore','Loader',()=>{copperToFurnace()},85,180);

let autoIronPlateMaker = autoDoer('iron_plate','Maker',function(){manufacture(this.resource,true)},45,120);
let autoCopperWireMaker = autoDoer('copper_wire','Maker',function(){manufacture(this.resource,true)},45,120);

let autoIronBulkheadAssembler = autoDoer('iron_bulkhead','Assembler',function(){manufacture(this.resource,true)},45,120);
let autoSimpleCircuitBoardAssembler = autoDoer('simple_circuit_board','Assembler',function(){manufacture(this.resource,true)},45,120);
let autoSmallEngineAssembler = autoDoer('small_engine','Assembler',function(){manufacture(this.resource,true)},45,120);

var automations = [autoCoalMiner];

function autoMineTick() {
    for (let i of automations) {
        if (i.maxCooldown) {
            if (i.cooldown <= 0 && i.on) {
                if (i.type == 'miner')
                    addItem(i.resource,'player',i.amount * mults.autoMineMult);
                else
                    i.autoFunc();
                i.cooldown = i.maxCooldown;
            }
            i.cooldown--;
        }
    }
}

function autoMiner(r,c,mC) {
    let miner = {name:'Automatic ' + prettyPrint(r) + ' Miner',level:0,on:true,cost:c,resource:items[r],amount:1,cooldown:0,maxCooldown:0,type:'miner',
    func: function(){
        this.maxCooldown = mC / (1 + Math.pow(this.level,1.6));
        this.cost = parseInt(this.cost + 50 * Math.pow(2, (this.level+1)/ 5));
        this.cooldown = 0;
        this.level++;
        console.log(this.level,this.resource)
        if (automations[0].level >= 3 && automations.length == 1)
            automations.push(autoCoalMiner);
        else if (automations.length == 2 && automations[1].level >= 3 && copperMining.bought) {
            automations.push(autoCopperMiner);
            automations.push(autoCoalLoader)
        }
        else if (automations.length == 4 && automations[2].level >= 3 && automations[3].level >= 2)
            automations.push(autoIronLoader);
        else if (automations.length == 5 && automations[4].level >= 2)
            automations.push(autoCopperLoader);
        else if (automations.length >= 6 && automations[0].level + automations[1].level + automations[2].level >= 11 && upgrades.indexOf(improvedAutoMiners) == -1) {
            upgrades.push(improvedAutoMiners);
            $('#new-upgrade').hide();
        }
        else if (automations.length >= 6 && automations[0].level + automations[1].level + automations[2].level >= 17 && upgrades.indexOf(improvedAutoMiners2) == -1) {
            upgrades.push(improvedAutoMiners2);
            $('#new-upgrade').hide();
        }
        else if (automations.length >= 7 && automations[6].level >= 2 && upgrades.indexOf(improvedAutoManufacturing) == -1) {
            upgrades.push(improvedAutoManufacturing);
            $('#new-upgrade').hide();
        }
        else if (automations.length >= 10 && automations[9].level >= 2 && upgrades.indexOf(improvedAutoAssembly) == -1) {
            upgrades.push(improvedAutoAssembly);
            $('#new-upgrade').hide();
        }
        renderAutomationTable();
    }};
    return miner;
}

function autoDoer(r,v,f,c,mC) {
    let loader = {name:'Automatic ' + prettyPrint(r) + ' ' + v,level:0,on:true,cost:c,resource:items[r],amount:1,autoFunc:f,cooldown:0,maxCooldown:0,type:v.toLowerCase(),
    func: function(){
        this.maxCooldown = mC / (1 + Math.pow(this.level,1.6));
        this.cost = parseInt(this.cost + 50 * Math.pow(2, (this.level+1)/ 5));
        this.cooldown = 0;
        this.level++;
        renderAutomationTable();
    }};
    return loader;
}