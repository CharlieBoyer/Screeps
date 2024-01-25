// Prototypes overload
require('addons.creepAddons');
require('addons.structureAddons');

// Globals & Utils
global.memory = require('memory');
global.filters = require('utils.filters');

// Modules
const base = require('structure.base');
const harvester = require('role.harvester');
const controller = require('role.controller');
const builder = require('role.builder');

memory.init();
base.init();

module.exports.loop = function () {

    memory.update();

    for (let name in Game.spawns)
    {
        let spawn = Game.spawns[name];
        base.run(spawn);
    }

    for (let name in Game.creeps)
    {
        let creep = Game.creeps[name];

        if (creep.role() === 'harvester') {
            harvester.run(creep);
        }
        if (creep.role() === 'controller') {
            controller.run(creep);
        }
        if (creep.role() === 'builder') {
            builder.run(creep);
        }
    }
}
