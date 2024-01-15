let harvester = {

    /** @param {string} spawner **/
    spawn: function(spawner) {
        let generation = Memory.role.harvester.generation;
        Game.spawners[spawner].spawnCreep( [WORK, CARRY, MOVE], 'harvester_' + generation, { memory: { role: 'harvester' } });
        Memory.role.harvester.generation++;
    },

    run: function(creep) {
        if (creep.store.getFreeCapacity() > 0) {
            let sources = creep.room.find(FIND_SOURCES);
            if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
                creep.say('Harvesting ⚡');
            }
        }
        else {
            let targets = creep.room.find(FIND_MY_CREEPS, {
                filter: (creep) => {
                    return (creep.memory.role == 'carrier' && creep.store.getFreeCapacity(RESOURCE_ENERGY) > 0);
                }
            });
            if (targets.length > 0) {
                if (creep.transfer(targets[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
    },
};

module.exports = harvester;