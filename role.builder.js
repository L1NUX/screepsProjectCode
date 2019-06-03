var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {
	    if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.say('-- harvest --');
	    }
	    if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
            var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION ||
                                structure.structureType == STRUCTURE_SPAWN ||
                                structure.structureType == STRUCTURE_TOWER
                                ) && ((_.sum(structure.store) < structure.storeCapacity) || (structure.energy < structure.energyCapacity));
                    }
            });
            if(targets.length > 0) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
            creep.memory.building = true;
	        creep.say('-- build --');
	    }

	    if(creep.memory.building) {
	        var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(targets.length) {
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }else{
                creep.memory.building = false;
            }
	    }
	    else {
            var sources = creep.room.find(FIND_DROPPED_ENERGY);
            var x;

            for(var i = 0; i < sources.length; i ++){
                if(sources[x].energy > 0){
                    x = i;
                }
            }

            if(creep.pickup(sources[x]) == ERR_NOT_IN_RANGE) {
                creep.pickup(sources[x], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
	    }
	}
};

module.exports = roleBuilder;