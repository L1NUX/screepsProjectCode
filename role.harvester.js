var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
	    if(creep.carry.energy < creep.carryCapacity) {
            var sources = creep.room.find(FIND_DROPPED_ENERGY);
            //sources.push(creep.room.find(FIND_STRUCTURES, {filter: (structure) => {return structure.structureType == STRUCTURE_CONTAINER}}));
            
            var x = 0;

            for(var i = 0; i < sources.length; i ++){
                if(sources[x].energy > 0){
                    x = i;
                }
            }

            if(creep.pickup(sources[x]) == ERR_NOT_IN_RANGE) {
                creep.pickup(sources[x], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
        else {
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
        }
	}
};

module.exports = roleHarvester;