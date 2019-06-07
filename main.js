var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleDefender = require('role.defender');
var roleMiner = require('role.miner');
var roleHealer = require('role.healer');

module.exports.loop = function () {
    var spawn = Game.spawns['Spawn1'];

    var energyContainers = spawn.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN);
        }
    });

    var totalEnergy = 0;
    var currentEnergy = 0;

    var sources = spawn.room.find(FIND_SOURCES);

    var container;

    for(var i = 0; i < energyContainers.length; i ++){

        container = energyContainers[i];

        totalEnergy += container.energyCapacity;
        currentEnergy += container.energy;
    }

    var builders = 0;
    var defenders = 0;
    var upgraders = 0;
    var harvesters = 0;
    var miners = 0;
    var attackers = 0;
    var healers = 0;

    for(var i in Game.creeps){
        var creep = Game.creeps[i];

        if(creep.memory.role == 'miner'){
            miners ++;
            roleMiner.run(creep);
            if(creep.ticksToLive == 1){
                spawn.memory.availableSources.push(creep.memory.source);
            }
        } if(creep.memory.role == 'builder'){
            builders ++;
            roleBuilder.run(creep);
        } else if(creep.memory.role == 'defender'){
            defenders ++;
            roleDefender.run(creep);
        } else if(creep.memory.role == 'harvester'){
            harvesters ++;
            roleHarvester.run(creep);
        } else if(creep.memory.role == 'upgrader'){
            upgraders ++;
            roleUpgrader.run(creep);
        } else if(creep.memory.role == 'healer') {
            healers++;
            roleHealer.run(creep);
        }
    }

    if(miners == 0){
        for(var i = 0; i < sources.length; i ++){
            spawn.memory.availableSources[i] = sources[i];
        }
        
        console.log("0 MINERS!");
    }
    if(miners < 2){
        for(var i in Game.creeps) {
            var creep = Game.creeps[i];
            var role = creep.memory.role;

            var droppedEnergy = creep.room.find(FIND_DROPPED_ENERGY);

            if(role == 'harvester' || role == 'builder' || role == 'upgrader'){
                if(creep.carry[RESOURCE_ENERGY] > creep.carryCapacity) {
                    if(creep.transfer(Game.spawns['Spawn1'], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(Game.spawns['Spawn1']);
                        console.log('Returning to spawn...');
                    }
                }else{
                    if(creep.pickup(droppedEnergy[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(droppedEnergy[0], {visualizePathStyle: {stroke: '#ffaa00'}});
                    }
                }
            }
            
        }
    }

    var minMiners = sources.length;
    var minBuilders = minMiners * 4 * (spawn.room.controller.level / 1.5);
    var minDefenders = (spawn.room.find(FIND_MY_CREEPS).length - defenders) / 2;
    var minUpgraders = minMiners * 3  * (spawn.room.controller.level / 1.5);
    var minHarvesters = minMiners * 4  * (spawn.room.controller.level / 1.5);
    var minHealers = Math.round(attackers / 3);

    var display = false;

    //--- Uncomment to enable information display every tick (useful for debugging) ---
    display = true;
    
    if(display){
        console.log("=======================");
        console.log("     *Information*");
        console.log("+++++++++++");
        console.log("Minimum Miners: " + minMiners);
        console.log("Current Miners: " + miners);
        console.log("-----------");
        console.log("Minimum Harvesters: " + minHarvesters);
        console.log("Current Harvesters: " + harvesters);
        console.log("-----------");
        console.log("Minimum Defenders: " + minDefenders);
        console.log("Current Defenders: " + defenders);
        console.log("-----------");
        console.log("Minimum Upgraders: " + minUpgraders);
        console.log("Current Upgraders: " + upgraders);
        console.log("-----------");
        console.log("Minimum Builders: " + minBuilders);
        console.log("Current Builders: " + builders);
        console.log("-----------");
        console.log("Minimum Healers: " + minHealers);
        console.log("Current Healers: " + healers);
        console.log("+++++++++++");
        console.log();
        console.log("Max Energy: " + totalEnergy);
        console.log("Current Energy: " + currentEnergy);
        console.log("=======================");
    }

    if(currentEnergy == totalEnergy){
        if(miners < minMiners && spawn.energy == spawn.energyCapacity){
            /*var keys = Object.keys(spawn.memory.miners);
            if(keys.length > 0){
                for(var key in keys){
                    if(!(Game.creeps[spawn.memory.miners[key]])){
                        spawn.memory.availableSources.push(spawn.memory.miners[key]);
                        delete spawn.memory.miners[key];
                        console.log("replace dead miner's source");
                    }
                }
            }*/
            spawn.spawnCreep(makeBody(totalEnergy, "miner"), "Miner" + Game.time, {memory: {role: "miner", source: spawn.memory.availableSources.pop()}});
            
            //spawn.memory.miners["Miner" + Game.time] = Game.creeps["Miner" + Game.time].memory.source;
        }else if(healers < minHealers && attackers > 0){
            spawn.spawnCreep(makeBody(totalEnergy, "healer"), "Healer" + Game.time, {memory: {role: "healer"}});
        }else if(harvesters < minHarvesters){
            spawn.spawnCreep(makeBody(totalEnergy, "harvester"), "Harvester" + Game.time, {memory: {role: "harvester"}});
        }else if(defenders < minDefenders){
            spawn.spawnCreep(makeBody(totalEnergy, "defender"), "Defender" + Game.time, {memory: {role: "defender", tIndex: Math.round(Math.random() + 1)}});
        }else if(upgraders < minUpgraders){
            spawn.spawnCreep(makeBody(totalEnergy, "upgrader"), "Upgrader" + Game.time, {memory: {role: "upgrader"}});
        }else if(builders < minBuilders){
            spawn.spawnCreep(makeBody(totalEnergy, "builder"), "Builder" + Game.time, {memory: {role: "builder"}});
        }else if(healers < minHealers) {
            spawn.spawnCreep(makeBody(totalEnergy, "healer"), "Healer" + Game.time, {memory: {role: "healer"}});
        }
    }
}

/* @param var energy, type */
function makeBody(energy, type){
    var body = [];

    var usedEnergy = 0;

    var work = 0;
    var move = 0;
    var carry = 0;
    var attack = 0;
    var heal = 0;

    if(type == "builder" || type == "upgrader"){
        while(energy - usedEnergy >= 50) {
            if(work <= move && move == carry && (energy - usedEnergy) >= 100){
                body.push(WORK);
                work ++;
                usedEnergy += 100;
            }else if(move <= carry && (energy - usedEnergy) >= 50){
                body.push(MOVE);
                move ++;
                usedEnergy += 50;
            }else if((energy - usedEnergy) >= 50){
                body.push(CARRY);
                carry ++;
                usedEnergy += 50;
            }
        }
    }else if(type == "miner"){
        body.push(MOVE);
        move ++;
        usedEnergy += 50;
        
        while(energy - usedEnergy >= 100) {
            if(work < 5){
                body.push(WORK);
                work ++;
                usedEnergy += 100;
            }
        }
    }else if(type == "defender"){
        while(energy - usedEnergy >= 50) {
            if(move < (attack / 2) && (energy - usedEnergy) >= 50){
                body.push(MOVE);
                move ++;
                usedEnergy += 50;
            }else if((energy - usedEnergy) >= 80){
                body.push(ATTACK);
                attack ++;
                usedEnergy += 80;
            }
        }
    }
    else if(type == "harvester"){
        while(energy - usedEnergy >= 50) {
            if(carry <= move){
                body.push(CARRY);
                carry ++;
                usedEnergy += 50;
            }else {
                body.push(MOVE);
                move ++;
                usedEnergy += 50;
            }
        }
    } else if(type == "healer") {
        while(energy - usedEnergy >= 50) {
            if(move <= heal) {
                body.push(MOVE);
                move ++;
                usedEnergy += 50;
            } else if(energy - usedEnergy >= 250) {
                body.push(HEAL);
                heal ++;
                usedEnergy += 250;
            }
        }
    }

    return body;
}
