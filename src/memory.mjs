global.memory = {
    
    init: function()
    {
        Memory.roles = {
            harvester: {
                unitCounter: 0,
                unitCount: 0,
                ratio: 3,
                priority: 3,
            },
            builder: {
                unitCounter: 0,
                unitCount: 0,
                ratio: 2,
                priority: 2,
            },
            controller: {
                unitCounter: 0,
                unitCount: 0,
                ratio: 2,
                priority: 1,
            },
        }
        Memory.activeRoles = ['harvester', 'builder', 'controller']
    },
    
    update: function() {
        const updatedMemory = Object.keys(Memory.creeps)
        .filter(creepName => Game.creeps[creepName])
        .reduce((acc, creepName) => {
            acc[creepName] = Memory.creeps[creepName];
            return acc;
        }, {});
        
        const newMemory = { ...Memory, creeps: updatedMemory };
        
        const roles = Memory.activeRoles;
        
        // Recreate the roles object by preserving existing properties
        newMemory['roles'] = roles.reduce((acc, role) => {
            acc[role] = { ...Memory['roles'][role], unitCount: _.filter(updatedMemory, { role }).length };
            return acc;
        }, {});
        
        Object.assign(Memory, newMemory);
    },
    
    
}
