var roleHealer = {
    /** @param {Creep} creep */
    run: function(creep) {
        var targets = Game.spawns['Spawn1'].room.find(FIND_MY_CREEPS);

        for(var target in targets) {
            if(target.hitsMax - creep.hits >= 4) {
                if(creep.heal(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#42f448'}});
                } else {
                    creep.moveTo(creep.pos.findClosestByRange(targets));
                }
            }
        }
        
        creep.moveTo(Game.flags["Healers"]);
    }
};

module.exports = roleHealer;