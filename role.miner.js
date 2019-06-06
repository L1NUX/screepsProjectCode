var roleMiner = {

    /** @param {Creep} creep **/
    run: function(creep) {
        var source = creep.room.find(FIND_SOURCES)[creep.memory.source];
        console.log("test");
        if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
            creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
        }
	}
};

module.exports = roleMiner;