global.utils = require('utils');
global.memory = require('memory');

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
