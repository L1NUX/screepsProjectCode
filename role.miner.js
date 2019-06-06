var roleMiner = {

    /** @param {Creep} creep **/
    run: function(creep) {
        console.log("working");
        console.log(Game.getObjectById(creep.memory.source.id).pos.x);
        console.log(Game.getObjectById(creep.memory.source.id).pos.y);

<<<<<<< HEAD
        if(creep.harvest(Game.getObjectById(creep.memory.source.id)) == ERR_NOT_IN_RANGE) {
            console.log("working2");
            creep.moveTo(Game.getObjectById(creep.memory.source.id), {visualizePathStyle: {stroke: '#ffaa00'}});
=======
        if(creep.harvest(creep.memory.source) == ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.memory.source, {visualizePathStyle: {stroke: '#ffaa00'}});
>>>>>>> 92da019a849be25323b75059424d8e3e53fb483e
        }
	}
};

module.exports = roleMiner;