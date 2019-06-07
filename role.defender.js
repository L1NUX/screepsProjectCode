var roleDefender = {
    /** @param {Creep} creep */
    run: function(creep){
        var targets1 = creep.room.find(FIND_HOSTILE_CREEPS); // total hostiles in room
        var targets2 = targets1.splice(0, Math.floor(targets1.length / 2)); // removes half of hostiles in targets1 and puts them in targets2

        if(targets1 && creep.memory.tIndex == 1){
            if(creep.attack(targets1[0]) == ERR_NOT_IN_RANGE){
                creep.moveTo(targets1[0], {visualizePathStyle: {stroke: '#1000ff'}});
            }
        } else if(targets2 && creep.memory.tIndex == 2) {
            if(creep.attack(targets2[0]) == ERR_NOT_IN_RANGE){
                creep.moveTo(targets2[0], {visualizePathStyle: {stroke: '#1000ff'}});
            }
        } else{
            if(creep.carry[RESOURCE_ENERGY] < creep.carryCapacity) {
                var sources = creep.room.find(FIND_DROPPED_ENERGY);
                //sources.push(creep.room.find(FIND_STRUCTURES, {filter: (structure) => {return structure.structureType == STRUCTURE_CONTAINER}}));
    
                if(creep.pickup(sources[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
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
    }
};

module.exports = roleDefender;
