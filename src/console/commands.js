global.commands = {
    
    spawn: function (role, modules) {
        Memory['roles'][role].unitCounter++;
        const unitName = `${role}_${++Memory['roles'][role].unitCounter}`;
        return Game.spawns['HQ'].spawnCreep(modules, unitName, {memory: {role}});
    },

    convertCreep: function (creep, newRole) {
        creep.convert(newRole);
    },

    recycleCreep: function (creepName) {
        let creep = Game.creeps[creepName];
        creep.switchState('recycle');
    }
}