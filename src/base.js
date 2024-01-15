var base = {

    /** @param {StructureSpawn} spawner **/
    initialize: function(spawner)
    {
        Game.spawners['HQ'].spawnCreep( [WORK, CARRY, MOVE], 'harvester1', { memory: { role: 'harvester' } })
    }
};

module.exports = base;