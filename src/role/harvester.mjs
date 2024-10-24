export const states = {
    STANDBY: 'standby',
    HARVESTING: 'harvesting',
    STORING: 'storing',
    RECYCLE: 'recycle'
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
    if (creep.ticksToLive < CREEP_LIFE_TIME * 0.15) {
        creep.recycle();
        return;
    }

    switch (creep.memory.state) {
        case states.STANDBY:
            return standby(creep);
        case states.HARVESTING:
            return harvestEnergy(creep);
        case states.STORING:
            return storeEnergy(creep);
        case states.RECYCLE:
            return creep.recycle();
        default:
            return creep.switchState(states.HARVESTING);
    }
}

/**
 * Default HARVESTING state behaviour
 * @param {Creep} creep
 */
export function harvestEnergy(creep) {
    let target = creep.find(FIND_DROPPED_RESOURCES, [filters.resources.is(RESOURCE_ENERGY)], true);

    if (target !== null) {
        if (creep.pickup(target) === ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {visualizePathStyle: {stroke: '#ffaa00', lineStyle: 'dotted'}});
        }
    }
    else {
        let source = creep.find(FIND_SOURCES, [filters.activeSources], true);

        if (source === null)
            creep.memory.state = states.STANDBY;
        else if (creep.harvest(source) === ERR_NOT_IN_RANGE)
            creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00', lineStyle: 'dotted'}});
    }

    if (creep.isFull())
        creep.switchState(states.STORING);
}

/**
 * STORING state : store either in dedicated storages or in spawns/extensions
 * @param {Creep} creep
 */
export function storeEnergy(creep) {
    let structure = creep.find(FIND_STRUCTURES, [filters.structure.is(STRUCTURE_SPAWN, STRUCTURE_EXTENSION), filters.structure.available], true);
    let storage = creep.find(FIND_STRUCTURES, [filters.structure.is(STRUCTURE_CONTAINER, STRUCTURE_STORAGE), filters.structure.available], true);
    let target;
    
    if (structure === null && storage === null) {
        creep.switchState(states.STANDBY); // Unavailable storages/structures full
        return;
    } else {
        target = structure ? structure : storage; // Prioritize structures over storages
    }

    if (target instanceof STRUCTURE_SPAWN || target instanceof STRUCTURE_EXTENSION) {
        if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        }
    }
    else if (target instanceof STRUCTURE_CONTAINER || target instanceof STRUCTURE_STORAGE) {
        creep.moveTo(target);
        if (creep.pos.isEqualTo(target)) {
            creep.drop(RESOURCE_ENERGY);
        }
    }

    if (creep.isEmpty()) {
        creep.switchState(states.HARVESTING);
    }
}

/**
 * Refresh state based on creep's Capacity or move to StandbyZone Flag
 * @param {Creep} creep
 */
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
