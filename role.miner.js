var roleMiner = {

    /** @param {Creep} creep **/
    run: function(creep) {
        var sources = creep.room.find(FIND_SOURCES);
        console.log("test");
        if(creep.harvest(sources[creep.memory.source]) == ERR_NOT_IN_RANGE) {
            creep.moveTo(sources[creep.memory.source], {visualizePathStyle: {stroke: '#ffaa00'}});
        }
	}
};

module.exports = roleMiner;