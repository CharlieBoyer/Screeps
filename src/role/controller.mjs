module.exports = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if (creep.memory.upgrading && creep.store[RESOURCE_ENERGY] === 0) {
            creep.memory.upgrading = false;
            creep.say('🔄 Collecting...');
        }
        if (!creep.memory.upgrading && creep.store.getFreeCapacity() === 0) {
            creep.memory.upgrading = true;
            creep.say('⚡ Upgrading...');
        }

        if (creep.memory.upgrading) {
            if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
        else {
            let containers = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType === STRUCTURE_CONTAINER) &&
                            structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0;
                }
            });

            if (containers.length <= 0) {
                containers = creep.room.find(FIND_MY_SPAWNS, {
                    filter: (spawn) => {
                        return (spawn.store.getUsedCapacity(RESOURCE_ENERGY) > 0);
                    }
                });

                if (containers.length <= 0) containers[0] = creep.pos.findClosestByPath(FIND_MY_SPAWNS);
            }

            if (creep.withdraw(creep.pos.findClosestByPath(containers), RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.pos.findClosestByPath(containers));
            }
        }
    }
}