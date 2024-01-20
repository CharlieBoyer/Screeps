global.utils = require('utils');
global.memory = require('memory');

let base = require('structure.base');
let harvester = require('role.harvester');
let controller = require('role.controller');
let builder = require('role.builder');

memory.init();

module.exports.loop = function () {

    // Clean Memory
    for (let i in Memory.creeps) {
        if(!Game.creeps[i]) {
            delete Memory.creeps[i];
        }
    }

    for (let name in Game.spawns)
    {
        let spawn = Game.spawns[name];

        switch (spawn.memory.type)
        {
            case 'base':
                base.run(spawn);
        }
    }

    for (let name in Game.creeps)
    {
        let creep = Game.creeps[name];

        if (creep.memory.role === 'harvester') {
            harvester.run(creep);
        }
        if (creep.memory.role === 'controller') {
            controller.run(creep);
        }
        if (creep.memory.role === 'builder') {
            builder.run(creep);
        }
    }
}
