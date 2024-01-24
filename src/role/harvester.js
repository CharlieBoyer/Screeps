module.exports = {

    /** FSM **/

    states: {
        STANDBY: 'Standby',
        HARVESTING: 'Harvesting',
        STORING: 'Storing'
    },

    /* transitions: {
        harvestingOrder: {
            [this.states.STORING]: this.states.HARVESTING,
            [this.states.STANDBY]: this.states.HARVESTING,
        },
        storeOrder: {
            [this.states.HARVESTING]: this.states.STORING,
            [this.states.STANDBY]: this.states.STORING,
        },
        standby: {
            [this.states.HARVESTING]: this.states.STANDBY,
            [this.states.STORING]: this.states.STANDBY,
        }
    }, */

    run: function(creep) {
        switch (creep.memory.state)
        {
            case this.states.STANDBY:
                return this.standby(creep);
            case this.states.HARVESTING:
                return this.harvestEnergy(creep);
            case this.states.STORING:
                return this.storeEnergy(creep);
            default:
                creep.memory.state = this.states.HARVESTING;
        }
    },


    /** @param {Creep} creep **/
    oldRun: function(creep)
    {
        if (creep.memory.harvesting)
            creep.say('⛏️ Harvest...');

        if (creep.store.getFreeCapacity() > 0)
        {
            let sources = creep.room.find(FIND_SOURCES);

            if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
                creep.memory.harvesting = true;
            }
        }
        else
        {
            creep.memory.harvesting = false;

            let targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType === STRUCTURE_EXTENSION ||
                            structure.structureType === STRUCTURE_SPAWN ||
                            structure.structureType === STRUCTURE_TOWER) &&
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            });

            if (targets.length > 0)
            {
                if (creep.transfer(targets[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
    },

    harvestEnergy: function(creep) {
        let sources = creep.room.find(FIND_SOURCES, {
            filter: (source) => {
                return source.energy > 0;
            }
        });
        let targetSource = creep.pos.findClosestByPath(sources);

        if (targetSource == null)
            creep.memory.state = this.states.STANDBY;

        if (creep.harvest(targetSource) === ERR_NOT_IN_RANGE)
            creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00', lineStyle: 'dotted'}});

        if (creep.store.getFreeCapacity(RESOURCE_ENERGY) <= 0)
            creep.memory.state = this.states.STORING;
    },

    storeEnergy: function (creep) {
        let structures = creep.room.find(FIND_STRUCTURES, {
           filter: (structure) => {
               return (structure.structureType === STRUCTURE_SPAWN ||
                        structure.structureType === STRUCTURE_EXTENSION) &&
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
           }
        });
        let closestStructure = creep.pos.findClosestByPath(structures);

        let containers = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType === STRUCTURE_CONTAINER) &&
                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
            }
        });
        let closestContainer = creep.pos.findClosestByPath(containers);

        if (closestStructure == null && closestContainer == null) {
            creep.memory.state = this.states.STANDBY;
            return;
        }

        let targetDeposit = closestStructure ? closestStructure : closestContainer;
        if (creep.transfer(targetDeposit, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            creep.moveTo(targetDeposit);
        }

        if (creep.store.getUsedCapacity(RESOURCE_ENERGY) <= 0) {
            creep.memory.state = this.states.HARVESTING;
        }
    },

    standby: function(creep) {
        let capacity = creep.store.getFreeCapacity(RESOURCE_ENERGY);
        if (capacity === 0) {
            this.storeEnergy(creep);
        }
        else if (capacity > 0) {
            this.harvestEnergy(creep);
        }
        else {
            creep.moveTo(Game.flags['StandbyZone'].pos);
        }
    },
}