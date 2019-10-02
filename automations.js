let autoCoalMiner = autoMiner('coal',30,60);
let autoIronMiner = autoMiner('iron_ore',40,70);
let autoCopperMiner = autoMiner('copper_ore',60,90);

let autoCoalLoader = autoLoader('coal',()=>{coalToFurnace(1); coalToFurnace(2);},45,120);
let autoIronLoader = autoLoader('iron_ore',()=>{ironToFurnace()},65,140);
let autoCopperLoader = autoLoader('copper_ore',()=>{copperToFurnace()},85,180);

var automations = [autoCoalMiner,autoIronMiner,autoCopperMiner,autoCoalLoader,autoIronLoader,autoCopperLoader];

function autoMineTick() {
    for (let i of automations) {
        if (i.maxCooldown) {
            if (i.cooldown <= 0) {
                if (i.type == 'miner')
                    addItem(i.resource,'player',1);
                else if (i.type == 'loader')
                    i.loadFunc();
                i.cooldown = i.maxCooldown;
            }
            i.cooldown--;
        }
    }
}

function autoMiner(r,c,mC) {
    let miner = {name:'Automatic ' + prettyPrint(r) + ' Miner',level:0,cost:c,resource:items[r],cooldown:0,maxCooldown:0,type:'miner',
    func: function(){
        this.maxCooldown = mC / (1 + Math.pow(this.level,1.6));
        this.cost = parseInt(this.cost + 50 * Math.pow(2, (this.level+1)/ 5));
        this.cooldown = 0;
        this.level++;
        renderAutomationTable();
    }};
    return miner;
}

function autoLoader(r,f,c,mC) {
    let loader = {name:'Automatic ' + prettyPrint(r) + ' Loader',level:0,cost:c,loadFunc:f,cooldown:0,maxCooldown:0,type:'loader',
    func: function(){
        this.maxCooldown = mC / (1 + Math.pow(this.level,1.6));
        this.cost = parseInt(this.cost + 50 * Math.pow(2, (this.level+1)/ 5));
        this.cooldown = 0;
        this.level++;
        renderAutomationTable();
    }};
    return loader;
}