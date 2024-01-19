module.exports = {

    spawn: function(role, modules)
    {
        let unitName;

        switch (role)
        {
            case 'harvester':
                unitName = 'harvester_' + (++Memory.role.harvester.count);
                break;
            case 'carrier':
                unitName = 'carrier_' + (++Memory.role.carrier.count);
                break;
            case 'builder':
                unitName = 'builder_' + (++Memory.role.builder.count);
                break;
            case 'controller':
                unitName = 'controller_' + (++Memory.role.controller.count);
                break;
        }

        return Game.spawns['HQ'].spawnCreep(modules, unitName, {memory: {role: role}});
    }

}