/**
 * @return {string}
 */
Creep.prototype.role = function() {
    return this.memory.role;
}

/**
 * @param {ResourceConstant} [resource]
 * @return {boolean}
 */
Creep.prototype.isEmpty = function(resource) {
    return this.store.getUsedCapacity(resource) <= 0;
}

/**
 * @returns {boolean}
 */
Creep.prototype.isFull = function() {
    return this.store.getFreeCapacity() <= 0;
}

/**
 * Find the closest targets that matches stackable filters
 * @param {FindConstant} target Find constant of the targets to find
 * @param {any} filters Optional filters
 * @param {boolean} closest Return only the closest target that matches ?
 * @return {any} results
 */
Creep.prototype.find = function(target, filters, closest) {
    let results = this.room.find(target, filters);

    if (closest)
        return this.pos.findClosestByPath(results)
    else
        return results;
};

Creep.prototype.switchState = function(state) {
    this.memory.state = state;
}

Creep.prototype.convert = function(role) {
    this.memory.role = role;
    this.memory.state = null;
}