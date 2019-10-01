var autoCoalMaxCooldown = 0;
var autoCoalCooldown = 0;

let autoCoal = {name:'Automatic Coal Miner',level:0,cost:30,func(){
    autoCoalMaxCooldown = 60 / (1 + Math.pow(this.level,1.6));
    this.cost = parseInt(this.cost + 50 * Math.pow(2, (this.level+1)/ 5));
    this.level++;
    renderAutomationTable();
}};

var automations = [autoCoal];

function autoMineTick() {
    if (autoCoalMaxCooldown) {
        if (autoCoalCooldown <= 0) {
            addItem(coal,'player',1);
            autoCoalCooldown = autoCoalMaxCooldown;
        }
        autoCoalCooldown--;
    }
}
