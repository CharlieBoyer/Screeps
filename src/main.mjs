// Global Modules
import "./memory";
import "./console/commands.js"

// Prototypes addons
import "./addons/creepAddons"
import "./addons/structureAddons";

import * as filters from "./utils/filters";
import * as base from "./structure/base"
import * as harvester from "./role/harvester";
import * as builder from "./role/builder"
import * as controller from "./role/controller"

global.filters = filters;

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