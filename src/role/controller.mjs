export const states = {
    UPGRADING: 'upgrading',
    RECHARGING: 'recharching',
}

export function run(creep) {
    switch (creep.memory.state) {
        case states.UPGRADING:
            return upgradeController(creep);
        case states.RECHARGING:
            return recharching(creep);
        default:
            return creep.switchState(states.UPGRADING);
    }
}

/**
 * Default UPGRADING state behaviour
 * @param {Creep} creep
 */
export function upgradeController(creep) {
    let controller = creep.find(FIND_STRUCTURES, [filters.structure.is(STRUCTURE_CONTROLLER)], true)

    if (creep.isFull())
        creep.say('☄️ Upgrade')
    
    if (creep.upgradeController(controller) === ERR_NOT_IN_RANGE)
        creep.moveTo(controller, { visualizePathStyle: { stroke: '#00d0ff', lineStyle: "solid" } });

    if (creep.isEmpty()) {
        creep.switchState(states.RECHARGING);
    }
}

/**
 * RECHARCHING state behaviour
 * @param {Creep} creep
 */
export function recharching(creep) {
    let container = creep.find(FIND_STRUCTURES, [filters.structure.is(STRUCTURE_CONTAINER, STRUCTURE_STORAGE), filters.structure.haveEnergy], true);
    let spawn = creep.find(FIND_STRUCTURES, [filters.structure.is(STRUCTURE_SPAWN), filters.structure.haveEnergy], true);
    
    let target = container ? container : spawn;
    
    if (creep.isEmpty()) {
        creep.say('⚡ Empty')
    }
    
    if (creep.withdraw(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff', lineStyle: 'dotted' } });
    }
    
    if (creep.isFull())
        creep.switchState(states.UPGRADING);
}