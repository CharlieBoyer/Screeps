require('addons.structureAddons')

module.exports = {

    /**
     * Return sources that have remaining energy
     * @param source
     * @return {Object}
     */
    activeSources: (source) => {
        return (source instanceof Source && source.energy > 0);
        /* return {
            filter: (source) => {
                return source instanceof Source && source.energy > 0;
            }
        }; */
    },

    structureUnfilled: (structure) => (structure instanceof Structure && !structure.haveFreeSpace()),
    structureDepleted: (structure) => (structure instanceof Structure && structure.isEmpty()),

    is: (types) => (target) => target instanceof Structure && types.includes(target.structureType),
}