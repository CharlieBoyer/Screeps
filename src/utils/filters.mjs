/**
 * Return sources that have remaining energy
 * @param source
 * @return {Object}
 */
export const activeSources = (source) => {
    return (source instanceof Source && source.energy > 0);
    /* return {
        filter: (source) => {
            return source instanceof Source && source.energy > 0;
        }
    }; */
}

export const structure = {
    unfilled: (structure) => (structure instanceof Structure && !structure.haveFreeSpace()),
    depleted: (structure) => (structure instanceof Structure && structure.isEmpty()),
    is: (types) => (target) => target instanceof Structure && types.includes(target.structureType),
    not: (types) => (target) => target instanceof Structure && !types.includes(target.structureType),
}

export const construction = {
    is: (types) => (target) => target instanceof ConstructionSite && types.includes(target.structureType),
    not: (types) => (target) => target instanceof ConstructionSite && !types.includes(target.structureType)
}

export const damaged = (target) => target.hits < target.hitsMax;

/**
 * Return true for objects which have been damaged **_below_** a certain ratio.
 * @param ratio
 * @return {function(*): boolean}
 */
export const integrity = (ratio) => (target) => target.hits / target.hitsMax <= ratio;