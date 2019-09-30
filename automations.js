var autoCoalMaxCooldown = 0;
var autoCoalCooldown = 0;

let autoCoal = {name:'Automatic Coal Miner', cost:30,bought:false,func(){
    autoCoalMaxCooldown = 60;
}}

let autoCoal2 = {name:'Automatic Coal Miner', cost:80,bought:false,func(){
    autoCoalMaxCooldown = 30;
}}

let autoCoal3 = {name:'Automatic Coal Miner', cost:220,bought:false,func(){
    autoCoalMaxCooldown = 20;
}}

var automations = [autoCoal,autoCoal2,autoCoal3];

function autoMineTick() {
    if (autoCoalMaxCooldown) {
        if (autoCoalCooldown <= 0) {
            addItem(coal,'player',1);
            autoCoalCooldown = autoCoalMaxCooldown;
        }
        autoCoalCooldown--;
    }
}