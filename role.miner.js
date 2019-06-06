var roleMiner = {

    /** @param {Creep} creep **/
    run: function(creep) {
        var sources = creep.room.find(FIND_SOURCES);

        if(creep.harvest(creep.memory.source) == ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.memory.source, {visualizePathStyle: {stroke: '#ffaa00'}});
        }
	}
};

module.exports = roleMiner;