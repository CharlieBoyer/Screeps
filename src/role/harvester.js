module.exports = {

    states: {
        STANDBY: 'standby',
        HARVESTING: 'harvesting',
        STORING: 'storing'
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

    harvestEnergy: function(creep) {
        let source = creep.findClosest(FIND_SOURCES, filters.activeSources);

        if (source == null)
            creep.memory.state = this.states.STANDBY;

        if (creep.harvest(source) === ERR_NOT_IN_RANGE)
            creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00', lineStyle: 'dotted'}});

        if (creep.isFull())
            creep.memory.state = this.states.STORING;
    },

    storeEnergy: function (creep) {
        let structure = creep.findClosest(FIND_STRUCTURES, [filters.structureUnfilled, filters.is(STRUCTURE_SPAWN, STRUCTURE_EXTENSION)])
        let storage = creep.findClosest(FIND_STRUCTURES, [filters.is(STRUCTURE_CONTAINER, STRUCTURE_STORAGE), filters.structureUnfilled])

        if (structure == null && storage == null) {
            creep.memory.state = this.states.STANDBY; // Unavailable storages/structures full
            return;
        }
        else {
            let target = structure ? structure : storage;
        }


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