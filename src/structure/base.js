module.exports = {

    init: function()
    {
        Game.spawns['HQ'].memory.type = 'base';
    },

    run: function(spawn)
    {
        spawn.transfer()
    }
}