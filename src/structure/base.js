const harvester = require('role.harvester');
const controller = require('role.controller');
const builder = require('role.builder');

module.exports = {

    states: {
        WAKE: 'wake',
        UPGRADE: 'upgrade',
        FAILSAFE: 'failsafe',
        CONTROL: 'control',
        RAID: 'raid'
    },

    init: function () {
        let mainSpawn = Game.spawns['HQ'];
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
                return this.states.WAKE;
        }
    },

    spawn: function(role, modules)  {
        const unitName = `${role}_${Memory['roles'][role].unitCount}`;
        let result = Game.spawns['HQ'].spawnCreep(modules, unitName, {memory: {role}});

        if (result === 0) Memory['roles'][role].unitCount++;
        return result;
    },

    wakeSetup: function() {
        const roles = ['harvester', 'builder', 'controller']; // Add more roles as needed
        const getModulesForRole = (role) => {
            switch (role) {
                case 'harvester':  return [WORK, CARRY, MOVE, MOVE];
                case 'builder':    return [WORK, CARRY, CARRY, MOVE, MOVE];
                case 'controller': return [WORK, CARRY, MOVE, MOVE];
                default:           return [WORK, CARRY, MOVE, MOVE];
            }
        };

        roles.sort((roleA, roleB) => {
            const priorityA = Memory['roles'][roleA] ? Memory['roles'][roleA].priority : 0;
            const priorityB = Memory['roles'][roleB] ? Memory['roles'][roleB].priority : 0;
            return priorityA - priorityB;
        });

        roles.forEach(role => {
            const currentCount = Memory['roles'][role] ? Memory['roles'][role].unitCount : 0;
            const targetCount = Memory['roles'][role] ? Memory['roles'][role].unitTarget : 0;

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