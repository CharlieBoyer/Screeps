module.exports = {

    states: {
        BUILDING: 'Building',
        REPAIRING: 'Repairing',
        RECHARGING: 'Recharging',
        STANDBY: 'Standby',
    },

    run: function(creep) {
        switch (creep.memory.state)
        {
            case this.states.BUILDING:
                return this.standby(creep);
            case this.states.REPAIRING:
                return this.repair(creep);
            case this.states.STANDBY(creep):
                return this.standby(creep);
        }
    },

    build: function(creep)
    {
        if (creep.store.getUsedCapacity(RESOURCE_ENERGY) <= 0)


        if (creep.store.getFreeCapacity() === 0) {
            creep.say('🚧 Build');
        }

        let targets
    },

    /** @param {Creep} creep **/
    oldrun: function(creep) {

        if (creep.memory.building && creep.store[RESOURCE_ENERGY] === 0) {
            creep.memory.building = false;
            creep.say('🔄 Collect');
        }
        if (!creep.memory.building && creep.store.getFreeCapacity() === 0) {
            creep.memory.building = true;
            creep.say('🚧 Build');
        }

        if (creep.memory.building) {
            let targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if (targets.length) {
                if(creep.build(targets[0]) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
        else if (creep.store.getUsedCapacity(RESOURCE_ENERGY) > 0) {
            this.repair(creep);
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
    },

    repair: function(creep) {
        const targets = creep.room.find(FIND_STRUCTURES, {
            filter: object => object.hits < object.hitsMax
        });

        targets.sort((a,b) => a.hits - b.hits);

        if (creep.store.getUsedCapacity[RESOURCE_ENERGY] <= 0) {
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
        else if (targets.length > 0) {
            if(creep.repair(targets[0]) === ERR_NOT_IN_RANGE) {
                creep.moveTo(targets[0]);
            }
        }
    },
}