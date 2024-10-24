/**
 * Return the creep's role
 * @return {string}
 */
Creep.prototype.role = function() {
    return this.memory.role;
}

/**
 * Return true if the creep doesn't carry the specified resource
 * @param {ResourceConstant} [resource]
 * @return {boolean}
 */
Creep.prototype.isEmpty = function(resource) {
    return this.store.getUsedCapacity(resource) <= 0;
}

/**
 * Return true is the creep's capacity is full
 * @returns {boolean}
 */
Creep.prototype.isFull = function() {
    return this.store.getFreeCapacity() <= 0;
}

/**
 * Return if the creep carry energy or not
 * @return {boolean}
 */
Creep.prototype.haveEnergy = function() {
    return this.store.getUsedCapacity(RESOURCE_ENERGY) > 0;
}

/**
 * Wrapper for finding targets that matches optional filters in the current room;
 * @param {FindConstant} target Find constant of the targets to find
 * @param {any} filters Optional filters
 * @param {boolean} closest Return only the closest target that matches ?
 * @return {any|any[]} results
 */
Creep.prototype.find = function(target, filters, closest= false) {
    let results = this.room.find(target);
    
    if (!Array.isArray(filters)) {
        filters = [filters];
    }
    
    if (!results) {
        return [];
    }
    
    for (const filter of filters)
    {
        if (typeof filter === 'function') {
            results = results.filter(filter);
        }
    }
    
    if (closest)
        return this.pos.findClosestByPath(results)
    else
        return results;
};

Creep.prototype.switchState = function(state) {
    this.memory.state = state;
}

Creep.prototype.recycle = function() {
    let structure = this.find(FIND_STRUCTURES, [filters.structure.is(STRUCTURE_SPAWN)], true);
    this.moveTo(structure);
    structure.recycleCreep(this);
    return 0;
}

/**
 * Repurpose the creep to another role.
 * Automatically reset it's internal state.
 * @param {string} role
 */
Creep.prototype.convert = function(role) {
    this.memory.role = role;
    this.memory.state = null;
}