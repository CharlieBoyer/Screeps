export const states = {
    BUILDING: 'Building',
    REPAIRING: 'Repairing',
    RECHARGING: 'Recharging',
    STANDBY: 'Standby',
}

export function run(creep) {
    switch (creep.memory.state) {
        case states.BUILDING:
            return build(creep);
        case states.REPAIRING:
            return repair(creep);
        case states.RECHARGING:
            return recharching(creep);
        case states.STANDBY:
            return standby(creep);
    }
}

export function build(creep) {
    if (creep.isFull())
        creep.say('🚧 Build');

    let target = creep.findClosest(FIND_CONSTRUCTION_SITES, [filters.construction.not(STRUCTURE_ROAD)]);

    if (creep.build(target) === ERR_NOT_IN_RANGE)
        creep.moveTo(target, {visualizePathStyle: {stroke: '#FEF600', lineStyle: 'dotted'}});

    if (creep.isEmpty(RESOURCE_ENERGY)) {
        creep.switchState(states.RECHARGING)
    }
}

export function repair(creep) {
    const targets = creep.room.find(FIND_STRUCTURES, [filters.integrity(0.5)]);

    targets.sort((a, b) => a.hits - b.hits);

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
    } else if (targets.length > 0) {
        if (creep.repair(targets[0]) === ERR_NOT_IN_RANGE) {
            creep.moveTo(targets[0]);
        }
    }
}

/** @param {Creep} creep **/
export function oldrun(creep) {

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
        if (targets.length > 0) {
            if (creep.build(targets[0]) === ERR_NOT_IN_RANGE) {
                creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#FEF600'}});
            }
        }
    } else if (creep.store.getUsedCapacity(RESOURCE_ENERGY) > 0) {
        this.repair(creep);
    } else {
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



export function recharching(creep) {
    return undefined;
}

export function standby(creep) {
    return undefined;
}