const harvester = require('role.harvester');
const controller = require('role.controller');
const builder = require('role.builder');

module.exports = {

    states: {
        WAKE: 'Wake',
        UPGRADE: 'Upgrade',
        REINFORCE: 'Reinforce',
        FAILSAFE: 'Failsafe',
        CONTROL: 'Control',
        RAID: 'Raid'
    },

    init: function () {
        let mainSpawn = Game.spawns['HQ'];
        mainSpawn.memory.type = 'base';
        mainSpawn.memory.state = this.states.WAKE;
        this.spawn('harvester', [WORK, CARRY, MOVE, MOVE]);
    },

    run: function (spawn) {
        switch (spawn.memory.state)
        {
            case this.states.WAKE:
                return this.wakeSetup();
            case this.states.UPGRADE:
                return this.upgradeRoutine();
            case this.states.FAILSAFE:
                return this.failsafe();
            case this.states.RAID:
                return this.launchRaid(Memory.nextRoomTarget);
            default:
                return this.UPGRADE;
        }
    },

    spawn: function(role, modules)  {
        const unitName = `${role}_${Memory[role].count}`;
        let result = Game.spawns['HQ'].spawnCreep(modules, unitName, {memory: {role}});

        if (result === 0) Memory[role].count++;
        return result;
    },

    wakeSetup: function() {
        const roles = ['harvester', 'builder', 'controller']; // Add more roles as needed
        const getModulesForRole = (role) => {
            switch (role) {
                case 'harvester':  return [WORK, WORK, CARRY, MOVE];
                case 'builder':    return [WORK, CARRY, CARRY, MOVE, MOVE];
                case 'fixer':      return [WORK, CARRY, CARRY, MOVE, MOVE];
                case 'controller': return [WORK, CARRY, MOVE, MOVE];
                default:           return [WORK, CARRY, MOVE, MOVE];
            }
        };

        roles.forEach(role => {
            const currentCount = Memory[role] ? Memory[role].count : 0;
            const targetCount = Memory[role] ? Memory[role].target : 0;

            if (currentCount < targetCount) {
                const modules = getModulesForRole(role);
                this.spawn(role, modules);
            }
        });
    },

    upgradeRoutine() {
        return undefined;
    },

    failsafe() {
        return undefined;
    },

    launchRaid(nextRoomTarget) {
        return undefined;
    }
}