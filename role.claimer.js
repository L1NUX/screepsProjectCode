var roleClaimer = {
    run: function(creep) {
        var targetRoom = "W15S8";
        
        var controllers = creep.room.find(FIND_STRUCTURES, {
            filter: function(structure) {
                return (structure.structureType == STRUCTURE_CONTROLLER);
            }
        });
        
        if(creep.room.name != targetRoom){
            creep.moveTo(creep.pos.findClosestByRange(creep.room.findExitTo(targetRoom)), {visualizePathStyle: {stroke: '#ff00c7'}});
            console.log("asd;flkajsdf;lkj");
        }else if(creep.claimController(controllers[0]) < 1){
            creep.moveTo(controllers[0], {visualizePathStyle: {stroke: '#ffffff'}});
        }
    }
};

module.exports = roleClaimer;