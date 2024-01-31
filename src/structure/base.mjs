export const states = {
    WAKE: 'wake',
    UPGRADE: 'upgrade',
    FAILSAFE: 'failsafe',
    CONTROL: 'control',
    RAID: 'raid'
}

export function init() {
    let mainSpawn = Game.spawns['HQ'];
    mainSpawn.switchState(states.WAKE);
    spawn('harvester', [WORK, CARRY, MOVE, MOVE]);
}

export function run(spawn) {
    switch (spawn.memory.state) {
        case states.WAKE:
            return wakeSetup(spawn);
        case states.UPGRADE:
            return upgradeRoutine(spawn);
        case states.FAILSAFE:
            return failsafe(spawn);
        case states.RAID:
            return launchRaid(spawn, Memory.nextRoomTarget);
        default:
            return states.WAKE;
    }
}

export function spawn(role, modules) {
    const unitName = `${role}_${Memory['roles'][role].unitCount}`;
    let result = Game.spawns['HQ'].spawnCreep(modules, unitName, {memory: {role}});

    if (result === 0) Memory['roles'][role].unitCount++;
    return result;
}

/**
 * @param {Spawn} spawner
 */
export function wakeSetup(spawner) {
    const roles = Memory.activeRoles;
    const getModulesForRole = (role) => {
        switch (role) {
            case 'harvester':
                return [WORK, CARRY, MOVE, MOVE];
            case 'builder':
                return [WORK, CARRY, CARRY, MOVE, MOVE];
            case 'controller':
                return [WORK, CARRY, MOVE, MOVE];
            default:
                return [WORK, CARRY, MOVE, MOVE];
        }
    };
    
    roles.sort((roleA, roleB) => {
        const priorityA = Memory['roles'][roleA] ? Memory['roles'][roleA].priority : 0;
        const priorityB = Memory['roles'][roleB] ? Memory['roles'][roleB].priority : 0;
        return priorityA - priorityB;
    });
    
    // Counter to keep track of the number of creeps spawned for the current role
    let spawnCounter = 0;
    
    roles.forEach(role => {
        const roleMemory = Memory['roles'][role];
        const currentCount = roleMemory ? roleMemory.unitCount : 0;
        const ratio = roleMemory.ratio;
        
        // Calculate the target count based on ratio
        const targetCount = currentCount + ratio;
        
        // Spawn creeps until the target count is reached
        while (spawnCounter < targetCount) {
            const modules = getModulesForRole(role);
            spawn(role, modules);
            spawnCounter++;
        }
    });
    
    // Reset spawn counter when all roles are iterated
    if (spawnCounter >= roles.length) {
        spawnCounter = 0;
    }
}

export function upgradeRoutine(spawn) {
    return undefined;
}

/**
 * @param {Spawn} spawn
 * @return {undefined}
 */
export function failsafe(spawn) {
    return undefined;
}

/**
 * @param {Spawn} spawn
 * @param nextRoomTarget
 * @return {undefined}
 */
export function launchRaid(spawn, nextRoomTarget) {
    return undefined;
}