export const states = {
    BUILDING: 'building',
    REPAIRING: 'repairing',
    RECHARGING: 'recharging',
    STANDBY: 'standby',
    RECYCLE: 'recycle',
}

export function run(creep) {
    if (creep.ticksToLive < CREEP_LIFE_TIME * 0.15) {
        creep.recycle();
        return;
    }

    switch (creep.memory.state) {
        case states.BUILDING:
            return build(creep);
        case states.REPAIRING:
            return repair(creep);
        case states.RECHARGING:
            return recharching(creep);
        case states.STANDBY:
            return standby(creep);
        case states.RECYCLE:
            return creep.recycle();
        default:
            return creep.switchState(states.STANDBY);
    }
}

/**
 * Build behaviour for the state BUILDING
 * @param {Creep} creep
 */
export function build(creep) {
    let target = creep.find(FIND_CONSTRUCTION_SITES, [filters.construction.not(STRUCTURE_ROAD)], true);

    if (!target) {
        creep.switchState(states.REPAIRING)
        return;
    }
    else {
        if (creep.isFull())
            creep.say('🚧 Build');

        if (creep.build(target) === ERR_NOT_IN_RANGE)
            creep.moveTo(target, {visualizePathStyle: {stroke: '#FEF600', lineStyle: 'dotted'}});
    }

    if (creep.isEmpty(RESOURCE_ENERGY)) {
        creep.switchState(states.RECHARGING)
    }
}

/**
 * Repair behaviour for the state REPAIRING
 * @param {Creep} creep
 */
export function repair(creep) {
    const targets = creep.find(FIND_STRUCTURES, [filters.structure.is(STRUCTURE_CONTAINER)]);
    
    if (targets) {
        targets.sort((a, b) => a.hits - b.hits); // Sort the lowest integrity structures first ?
    }

    if (creep.isFull())
        creep.say('⚙️ Repair');

    if (creep.haveEnergy()) {
        if (targets.length > 0) {
            if (creep.repair(targets[0]) === ERR_NOT_IN_RANGE) {
                creep.moveTo(targets[0]);
            }
        } else {
            creep.switchState(states.STANDBY);
            return;
        }
    }

    if (creep.isEmpty()) {
        creep.switchState(states.RECHARGING);
    }
}

/**
 * Withdraw energy behaviour for the state RECHARCHING
 * @param {Creep} creep
 */
export function recharching(creep) {
    let container = creep.find(FIND_STRUCTURES, [filters.structure.is(STRUCTURE_CONTAINER, STRUCTURE_STORAGE), filters.structure.haveEnergy], true);
    let target;

    if (!container) {
        target = creep.find(FIND_MY_SPAWNS, [filters.structure.haveEnergy()], true);
        if (!target) {
            creep.find(FIND_MY_SPAWNS, function () {
                return false;
            }, true);
            creep.moveTo(target, {visualizePathStyle: {stroke: '#720000'}}); // Fallback to the closest spawn and standby
            creep.switchState(states.STANDBY);
            return;
        }
    }
    else
        target = container;

    if (creep.isEmpty()) {
        creep.say('⚡ Empty')
    }

    if (creep.withdraw(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
    }

    if (creep.isFull())
        creep.switchState(states.STANDBY)
}

/**
 * Checks energy levels and pivots to RECHARCHING if needs be. Otherwise, loop again toward BUILDING state
 * @param {Creep} creep
 */
export function standby(creep) {
    if (creep.haveEnergy()) {
        creep.switchState(states.BUILDING)
    }
    else {
        creep.switchState(states.RECHARGING)
    }
}