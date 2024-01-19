module.exports = {

     init: function()
     {
          Memory.role = {};

          Memory.role.harvester = {}
          Memory.role.harvester.count = 0;

          Memory.role.builder = {}
          Memory.role.builder.count = 0;

          Memory.role.controller = {}
          Memory.role.controller.count = 0;
     },

     flushUnitCounters: function() {
          for (let role in Memory.role) {
               role.count = 0;
          }
     }
}