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
 * Find the closest target that matches stackable filters
 * @param {FindConstant} target
 * @param {any} filter
 * @return {any} results
 */
Creep.prototype.findClosest = function(target, filter) {
    let results = this.room.find(target, filter);
    return this.pos.findClosestByPath(results)
};