var roleAttacker = {
    /** @param {Creep} creep */
    run: function(creep){
        var targetRoom = "W7N3";
        var targets = creep.room.find(FIND_HOSTILE_CREEPS);

        if(creep.room.name != targetRoom) {
            creep.moveTo(creep.pos.findClosestByRange(creep.room.findExitTo(targetRoom)), {visualizePathStyle: {stroke: '#f44242'}});
        } else if(creep.attack(targets[0]) == ERR_NOT_IN_RANGE) {
            creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#f44242'}});
        }else{
            creep.moveTo(Game.flags["Attackers"]);
        }
    }
};

module.exports = roleAttacker;
