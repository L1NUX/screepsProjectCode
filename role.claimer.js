var roleClaimer = {
    run: function(creep) {
        var targetRoom = "W2N4";
        
        var controllers = creep.room.find(FIND_STRUCTURES, {
            filter: function(structure) {
                return (structure.structureType == STRUCTURE_CONTROLLER);
            }
        });
        
        if(creep.room.name != targetRoom) {
            creep.moveTo(creep.pos.findClosestByRange(creep.room.findExitTo(targetRoom)), {visualizePathStyle: {stroke: '#ff00c7'}});
        } else if(creep.claimController(controllers[0]) == ERR_NOT_IN_RANGE) {
            creep.moveTo(controllers[0], {visualizePathStyle: {stroke: '#ffffff'}});
        }
    }
};

module.exports = roleClaimer;