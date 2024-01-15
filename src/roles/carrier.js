let carrier = {

    spawn: function(spawner, space) {
        let generation = Memory.role.carrier.generation;
        let cargoSpace = [];

        if (space > 6) {
            space = 6;
            console.log("Unable to spawn Carrier with " + space + " cargo space");
        }

        for (let i = 0; i < space; i++) {
            cargoSpace += [CARRY];
        }
        while (cargoSpace.length < 8) {
            cargoSpace += [MOVE]
        }

        Game.spawners[spawner].spawnCreep(cargoSpace, 'harvester_' + generation, { memory: { role: 'carrier' } });
        Memory.role.carrier.generation++;
    }
};

module.exports = carrier;