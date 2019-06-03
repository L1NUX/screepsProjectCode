var roleEnergyHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        var sources = creep.room.find(FIND_SOURCES);
        if(creep.harvest(sources[creep.memory.sourceIndex]) == ERR_NOT_IN_RANGE) {
            creep.moveTo(sources[creep.memory.sourceIndex], {visualizePathStyle: {stroke: '#ffaa00'}});
        }
	}
};

module.exports = roleEnergyHarvester;