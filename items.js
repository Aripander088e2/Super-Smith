var iron_ore = {name:'iron_ore',val:20};
var coal = {name:'coal',val:30};
var copper_ore = {name:'copper_ore',val:60}

var iron_bar = {name:'iron_bar',val:200};
var copper_bar = {name:'copper_bar',val:400};

var copper_wire = {name:'copper_wire',val:11,recipe:{copper_bar:1},output:5};
var iron_plate = {name:'iron_plate',val: 25, recipe:{iron_bar:1}};
var iron_bulkhead = {name:'iron_bulkhead',val:200,recipe:{iron_plate:5}};
var simple_circuit_board = {name:'simple_circuit_board',val:375,recipe:{copper_wire:15,iron_bar:2}};
var small_engine = {name:'small_engine',val:450,recipe:{copper_wire:10,copper_bar:2,iron_bar:3}};
var small_life_support = {name:'small_life_support',val:4500,recipe:{copper_wire:65,iron_plate:8,simple_circuit_board:6}};
var small_railgun = {name:'small_railgun',val:12500,recipe:{copper_wire:250,iron_bar:10,simple_circuit_board:4}};

var small_hauler = {name:'small_hauler',val:10000,recipe:{iron_bulkhead:2,small_engine:3,simple_circuit_board:5}};
var small_transport = {name:'small_transport',val:22000,recipe:{iron_bulkhead:3,small_engine:4,simple_circuit_board:6,small_life_support:1}};
var small_fighter = {name:'small_fighter',val:50000,recipe:{iron_bulkhead:5,iron_plate:20,small_engine:5,simple_circuit_board:10,small_railgun:1}};

var items = {iron_ore:iron_ore,coal:coal,iron_bar:iron_bar,iron_plate:iron_plate,iron_bulkhead:iron_bulkhead,
    copper_ore:copper_ore,copper_bar:copper_bar,copper_wire:copper_wire,
    simple_circuit_board:simple_circuit_board,small_engine:small_engine,small_life_support,small_railgun:small_railgun,
    small_hauler:small_hauler,small_transport:small_transport,small_fighter:small_fighter};


var resources = ['iron_ore','coal','copper_ore'];
var manufactured = ['copper_wire','iron_plate'];
var assembled = ['iron_bulkhead','simple_circuit_board','small_engine','small_life_support','small_railgun'];
var ships = {small_hauler:small_hauler,small_transport:small_transport,small_fighter:small_fighter};

var player = {
    inventory: {},
    maxCapacity: {iron_ore:20,coal:40,copper_ore:20,iron_bar:2000,copper_bar:2000,
    copper_wire:50,iron_plate:20,iron_bulkhead:6,simple_circuit_board:15,small_engine:9,small_life_support:4,
    small_hauler:10,small_transport:10,small_fighter:10},
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
    maxCapacity:{copper_ore:5,coal:10},
    speed: 1,
    name:'furnace2'
}
