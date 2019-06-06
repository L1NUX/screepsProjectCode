var roleMiner = {

    /** @param {Creep} creep **/
    run: function(creep) {
        console.log("working");
        console.log(Game.getObjectById(creep.memory.source.id).pos.x);
        console.log(Game.getObjectById(creep.memory.source.id).pos.y);

        if(creep.harvest(Game.getObjectById(creep.memory.source.id)) == ERR_NOT_IN_RANGE) {
            console.log("working2");
            creep.moveTo(Game.getObjectById(creep.memory.source.id), {visualizePathStyle: {stroke: '#ffaa00'}});
        }
	}
};

module.exports = roleMiner;