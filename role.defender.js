var roleDefender = {
    /** @param {Creep} creep */
    run: function(creep){
        var targets;
        
        if(targets = creep.room.find(FIND_HOSTILE_CREEPS)){
            if(creep.attack(targets[0]) == ERR_NOT_IN_RANGE){
                creep.moveTo(targets[0]);
            }
        }else{
            creep.moveTo(creep.room.find(FIND_STRUCTURE_SPAWN)[0]);
        }
    }
};

module.exports = roleDefender;