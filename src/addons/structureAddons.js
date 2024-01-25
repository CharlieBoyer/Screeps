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
 * Return false even if the structure can't hold anything.
 * @return {boolean|boolean}
 */
Structure.prototype.haveFreeSpace = function () {
    return this.store ? this.store.getFreeCapacity() > 0 : false;
}