var roleMiner = {

    /** @param {Creep} creep **/
    run: function(creep) {
        console.log(Game.getObjectById(creep.memory.source.id).pos.y);

        if(creep.harvest(Game.getObjectById(creep.memory.source.id)) == ERR_NOT_IN_RANGE) {
            creep.moveTo(Game.getObjectById(creep.memory.source.id), {visualizePathStyle: {stroke: '#ffaa00'}});
        }
	}
};

module.exports = roleMiner;