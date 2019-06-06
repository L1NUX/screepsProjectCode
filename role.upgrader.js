var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.upgrading && creep.carry[RESOURCE_ENERGY] == 0) {
            creep.memory.upgrading = false;
            creep.say('-- harvest --');
	    }
	    if(!creep.memory.upgrading && creep.carry[RESOURCE_ENERGY] == creep.carryCapacity) {
	        creep.memory.upgrading = true;
	        creep.say('-- upgrade --');
	    }

	    if(creep.memory.upgrading) {
            console.log("upgrading");
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
        else {
            var sources = creep.room.find(FIND_DROPPED_ENERGY);
            if(creep.pickup(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
	}
};

module.exports = roleUpgrader;