module.exports = {

     init: function()
     {
          Memory.harvester = {};
          Memory.harvester.count = 0;
          Memory.harvester.target = 4;

         Memory.builder = {};
         Memory.builder.count = 0;
         Memory.builder.target = 2;

         Memory.controller = {};
         Memory.controller.count = 0;
         Memory.controller.target = 1;
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