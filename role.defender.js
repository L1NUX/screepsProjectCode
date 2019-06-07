var roleDefender = {
    /** @param {Creep} creep */
    run: function(creep){
        var targets1 = creep.room.find(FIND_HOSTILE_CREEPS); // total hostiles in room
        var targets2 = targets1.splice(0, Math.floor(targets1.length / 2)); // removes half of hostiles in targets1 and puts them in targets2

        if(targets1.length > 0 && creep.memory.tIndex == 1){
            if(creep.attack(targets1[0]) == ERR_NOT_IN_RANGE){
                creep.moveTo(targets1[0], {visualizePathStyle: {stroke: '#1000ff'}});
            }
        } else if(targets2.length > 0 && creep.memory.tIndex == 2) {
            if(creep.attack(targets2[0]) == ERR_NOT_IN_RANGE){
                creep.moveTo(targets2[0], {visualizePathStyle: {stroke: '#1000ff'}});
            }
        } else{
            //creep.moveTo(creep.room.find(FIND_MY_SPAWNS)[0].pos.x, creep.room.find(FIND_MY_SPAWNS)[0].pos.y + 5);
            creep.moveTo(8, 47);
        }
    }
};

module.exports = roleDefender;
