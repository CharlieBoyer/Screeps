global.commands = {
    
    spawn: function (role, modules) {
        const unitName = `${role}_${Memory['roles'][role].unitCount}`;
        let result = Game.spawns['HQ'].spawnCreep(modules, unitName, {memory: {role}});
        
        if (result === 0) Memory['roles'][role].unitCount++;
        return result;
    }
    
}