var roleUpgrader = require('role.upgrader');

var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {
        var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
        
	    if(!(targets.length > 0)) {
            roleUpgrader.run(creep);
	    }else {
	        if(creep.carry[RESOURCE_ENERGY] == creep.carryCapacity) {
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
	        }else{
                var sources = creep.room.find(FIND_DROPPED_RESOURCES);
                
                if(creep.pickup(sources[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
                }
	        }
	    }
	}
};

module.exports = roleBuilder;