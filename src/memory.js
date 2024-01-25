module.exports = {

    init: function()
    {
        Memory.roles = {
            harvester: {
                unitCount: 0,
                unitTarget: 4,
                priority: 3,
            },
            builder: {
                unitCount: 0,
                unitTarget: 2,
                priority: 2,
            },
            controller: {
                unitCount: 0,
                unitTarget: 2,
                priority: 1,
            },
        }
    },

    update: function() {
        const updatedMemory = Object.keys(Memory.creeps) // Always prefer to construct new data instead of modifying it
            .filter(creepName => Game.creeps[creepName]) // Filters out the dead creeps
            .reduce((acc, creepName) => {
                acc[creepName] = Memory.creeps[creepName];
                return acc;  // constructs a new object with the remaining live creeps
            }, {});

        const newMemory = { ...Memory, creeps: updatedMemory }; // Recreate a Memory object

        const roles = ['harvester', 'builder', 'controller'];
        roles.forEach(role => {
            newMemory[role] = { count: _.filter(updatedMemory, { role }).length };
        });

        Object.assign(Memory, newMemory);
    },

}