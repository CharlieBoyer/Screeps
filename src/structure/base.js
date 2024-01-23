module.exports = {

    init: function() {
        Game.spawns['HQ'].memory.type = 'base';
        this.spawn('harvester', [WORK, CARRY, MOVE, MOVE]);
    },

    run: function(spawn)
    {
        this.autonomousSpawn();
    },

    spawn: function(role, modules)  {
        const trySpawn = (index) => {
            const unitName = `${role}_${index}`;
            return Game.spawns['HQ'].spawnCreep(modules, role, {memory: {role}});
        };

        const spawnLoop = (index) => {
            const src = trySpawn(index);
            if (src === ERR_BUSY || src === ERR_NOT_ENOUGH_ENERGY)
                return src;
            else if (src === ERR_NAME_EXISTS)
                spawnLoop(index + 1);
            else
                return src;
        };

        return spawnLoop(1);
    },

    autonomousSpawn: function() {
        const roles = ['harvester', 'builder', 'controller']; // Add more roles as needed

        roles.forEach(role => {
            const currentCount = Memory[role] ? Memory[role].count : 0;
            const targetCount = Memory[role] ? Memory[role].target : 0;

            if (currentCount < targetCount) {
                const modules = this.getModulesForRole(role);
                this.spawn(role, modules);
            }
        });
    },

    getModulesForRole: function(role) {
        switch (role) {
            case 'harvester':  return [WORK, WORK, CARRY, MOVE];
            case 'builder':    return [WORK, CARRY, CARRY, MOVE, MOVE];
            case 'fixer':      return [WORK, CARRY, CARRY, MOVE, MOVE];
            case 'controller': return [WORK, CARRY, MOVE, MOVE];
            default:           return [WORK, CARRY, MOVE, MOVE];
        }
    },
}