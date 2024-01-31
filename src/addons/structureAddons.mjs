/**
 * Return true if the structure doesn't hold anything.
 * Return undefined if the structure doesn't have a store.
 * @return {boolean|undefined}
 */
Structure.prototype.isEmpty = function() {
    return this.store ? this.store.getUsedCapacity() <= 0 : undefined;
}

/**
 * Return true if the structure can store more energy or other resources.
 * Return false otherwise, even if the structure can't hold anything.
 * @return {boolean|boolean}
 */
Structure.prototype.haveFreeSpace = function() {
    return this.store ? this.store.getFreeCapacity() > 0 : false;
}

/**
 * Return if the structure hold energy.
 * Return false if the structure can't hold anything.
 * @return {boolean|boolean}
 */
Structure.prototype.haveEnergy = function() {
    return this.store ? this.store.getUsedCapacity(RESOURCE_ENERGY) > 0 : false;
}

Structure.prototype.switchState = function(state) {
    this.memory.state = (this.memory) ? state : undefined;
}