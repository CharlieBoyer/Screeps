export const states = {
    STANDBY: 'standby',
    HARVESTING: 'harvesting',
    STORING: 'storing'
}

/*export const transitions = {
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
} */

export function run(creep) {
    switch (creep.memory.state) {
        case this.states.STANDBY:
            return this.standby(creep);
        case this.states.HARVESTING:
            return this.harvestEnergy(creep);
        case this.states.STORING:
            return this.storeEnergy(creep);
        default:
            creep.memory.state = this.states.HARVESTING;
    }
}

export function harvestEnergy(creep) {
    let source = creep.find(FIND_SOURCES, filters.activeSources, true);

    if (source == null)
        creep.memory.state = this.states.STANDBY;

    if (creep.harvest(source) === ERR_NOT_IN_RANGE)
        creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00', lineStyle: 'dotted'}});

    if (creep.isFull())
        creep.memory.state = this.states.STORING;
}

export function storeEnergy(creep) {
    let structure = creep.findClosest(FIND_STRUCTURES, [filters.structure.unfilled, filters.structure.is(STRUCTURE_SPAWN, STRUCTURE_EXTENSION)])
    let storage = creep.findClosest(FIND_STRUCTURES, [filters.structure.unfilled, filters.structure.is(STRUCTURE_CONTAINER, STRUCTURE_STORAGE)])
    let target;

    if (structure === null && storage === null) {
        creep.memory.state = this.states.STANDBY; // Unavailable storages/structures full
        return;
    } else {
        target = structure ? structure : storage;
    }

    if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        creep.moveTo(target);
    }

    if (creep.store.getUsedCapacity(RESOURCE_ENERGY) <= 0) {
        creep.memory.state = this.states.HARVESTING;
    }
}

export function standby(creep) {
    let capacity = creep.store.getFreeCapacity(RESOURCE_ENERGY);
    if (capacity === 0) {
        this.storeEnergy(creep);
    } else if (capacity > 0) {
        this.harvestEnergy(creep);
    } else {
        creep.moveTo(Game.flags['StandbyZone'].pos);
    }
}
