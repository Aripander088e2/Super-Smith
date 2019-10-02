let autoCoal = autoMiner('coal',30,60);
let autoIron = autoMiner('iron_ore',40,70);
let autoCopper = autoMiner('copper_ore',60,90);

var automations = [autoCoal,autoIron,autoCopper];

function autoMineTick() {
    for (let i of automations) {
        if (i.maxCooldown) {
            if (i.cooldown <= 0) {
                addItem(i.resource,'player',1);
                i.cooldown = i.maxCooldown;
            }
            i.cooldown--;
        }
    }
}

function autoMiner(r,c,mC) {
    let miner = {name:'Automatic ' + prettyPrint(r) + ' Miner',level:0,cost:c,resource:items[r],cooldown:0,maxCooldown:0,func(){
        this.maxCooldown = mC / (1 + Math.pow(this.level,1.6));
        this.cost = parseInt(this.cost + 50 * Math.pow(2, (this.level+1)/ 5));
        this.cooldown = 0;
        this.level++;
        renderAutomationTable();
    }};
    return miner;
}