/**
 * Return sources that have remaining energy
 * @param {Source} source
 * @return {Object}
 */
export const activeSources = function (source) {
    return source ? source instanceof Source && source.energy > 0 : false;
}


export const resources = {
    is: function (types) {
        return function (target) {
            return target ? target instanceof Resource && types.includes(target.resourceType) : false;
        };
    }
}

export const structure = {
    haveEnergy: function (target) {
        return target ? target instanceof Structure && target.haveEnergy() : false;
    },
    available: function (target) {
        return target ? target instanceof Structure && !target.haveFreeSpace() : false;
    },
    depleted: function (target) {
        return target ? target instanceof Structure && target.isEmpty() : false;
    },
    is: function (types) {
        return function (target) {
            return target ? target instanceof Structure && types.includes(target.structureType) : false;
        };
    },
    not: function (types) {
        return function (target) {
            return target ? target instanceof Structure && !types.includes(target.structureType) : false;
        };
    },
};

export const construction = {
    is: function (types) {
        return function (target) {
            return target ? target instanceof ConstructionSite && types.includes(target.structureType) : false;
        };
    },
    not: function (types) {
        return function (target) {
            return target ? target instanceof ConstructionSite && !types.includes(target.structureType) : false;
        };
    },
};

/**
 * Return true if the target is damaged
 * @param {any} target
 * @return {boolean}
 */
export const damaged = function (target) {
    return target.hits < target.hitsMax;
};

/**
 * Return true for objects which have been damaged **_below_** a certain ratio.
 * @param {number} ratio Integrity in hits, normalized between 0 and 1;
 * @return {function(*): boolean}
 */
export const integrity = function (ratio) {
    return function (target) {
        return target.hits / target.hitsMax <= ratio;
    };
};