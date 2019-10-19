var iron_ore = {name:'iron_ore',val:2};
var coal = {name:'coal',val:3};
var copper_ore = {name:'copper_ore',val:6}
var iron_bar = {name:'iron_bar',val:20};
var copper_bar = {name:'copper_bar',val:40};
var copper_wire = {name:'copper_wire',val:11,recipe:{copper_bar:1},output:5};
var iron_plate = {name:'iron_plate',val: 25, recipe:{iron_bar:1}};
var iron_bulkhead = {name:'iron_bulkhead',val:200,recipe:{iron_plate:5}};
var simple_circuit_board = {name:'simple_circuit_board',val:375,recipe:{copper_wire:15,iron_bar:2}};
var small_engine = {name:'small_engine',val:450,recipe:{copper_wire:10,copper_bar:2,iron_bar:3}};
var escape_pod = {name:'escape_pod',val:10000,recipe:{iron_bulkhead:2,small_engine:3,simple_circuit_board:5}};

var items = {iron_ore:iron_ore,coal:coal,iron_bar:iron_bar,iron_plate:iron_plate,iron_bulkhead:iron_bulkhead,
    copper_ore:copper_ore,copper_bar:copper_bar,copper_wire:copper_wire,
    simple_circuit_board:simple_circuit_board,small_engine:small_engine,escape_pod:escape_pod};


var resources = ['iron_ore','coal','copper_ore'];
var manufactured = ['copper_wire','iron_plate'];
var assembled = ['iron_bulkhead','simple_circuit_board','small_engine'];
var ships = {escape_pod:escape_pod};

var player = {
    inventory: {},
    maxCapacity: {iron_ore:20,coal:40,copper_ore:20,iron_bar:20,copper_bar:20,
    copper_wire:50,iron_plate:20,iron_bulkhead:6,simple_circuit_board:15,small_engine:9,
    escape_pod:10},
    name:'player'
};

var furnace1 = {
    inventory: {iron_ore:0,coal:0},
    maxCapacity:{iron_ore:5,coal:10},
    speed: 1,
    name:'furnace1'
}

var furnace2 = {
    inventory: {copper_ore:0,coal:0},
    maxCapacity:{iron_ore:5,coal:10},
    speed: 1,
    name:'furnace2'
}