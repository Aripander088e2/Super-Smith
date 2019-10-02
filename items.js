var iron_ore = {name:'iron_ore',val:2};
var coal = {name:'coal',val:3};
var copper_ore = {name:'copper_ore',val:5}
var iron_bar = {name:'iron_bar',val:12};
var copper_bar = {name:'copper_bar',val:25};
var copper_wire = {name:'copper_wire',val:7,recipe:{copper_bar:1},output:5};
var iron_plate = {name:'iron_plate',val: 19, recipe:{iron_bar:1}};
var iron_bulkhead = {name:'iron_bulkhead',val:200,recipe:{iron_plate:5}};
var simple_circuit_board = {name:'simple_circuit_board',val:275,recipe:{copper_wire:15,iron_bar:2}};
var small_engine = {name:'small_engine',val:325,recipe:{copper_wire:10,copper_bar:2,iron_bar:3}};

var items = {iron_ore:iron_ore,coal:coal,iron_bar:iron_bar,iron_plate:iron_plate,iron_bulkhead:iron_bulkhead,
    copper_ore:copper_ore,copper_bar:copper_bar,copper_wire:copper_wire,
    simple_circuit_board:simple_circuit_board,small_engine:small_engine};