var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleDefender = require('role.defender');
var roleMiner = require('role.miner');

module.exports.loop = function () {
        var spawn = Game.spawns['Spawn1'];

        var energyContainers = spawn.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN);

                }
        });

        var totalEnergy = 0;


        var sources = spawn.room.find(FIND_SOURCES);

        spawn.memory.availableSources = sources;

        var builders = 0;
        var defenders = 0;
        var upgraders = 0;
        var harvesters = 0;
        var miners = 0;

        var minBuilders = miners * 4;
        var minDefenders = _.countBy(spawn.room.find(FIND_MY_CREEPS)) / 4;
        var minUpgraders = miners * 3;
        var minHarvesters = miners * 5;
        var minMiners = sources.length;

        for(var name in spawn.room.creeps){
            var creep = spawn.room.creeps[name];

            if(creep.memory.role == 'builder'){
                builders ++;
                roleBuilder.run(creep);
            }else if(creep.memory.role == 'defender'){
                defenders ++;
                roleDefender.run(creep);
            }else if(creep.memory.role == 'harvester'){
                harvesters ++;
                roleHarvester.run(creep);
            }else if(creep.memory.role == 'upgrader'){
                upgraders ++;
                roleUpgrader.run(creep);
            }else if(creep.memory.role == 'miner'){
                miners ++;
                roleMiner.run(creep);
                if(creep.ticksToLive == 1){
                    spawn.memory.availableSources.push(creep.memory.source);
                }
            }
        }

        if(miners < minMiners){
            spawn.spawnCreep(makeBody(totalEnergy, "miner"), "Miner" + Game.time, {memory: {role: "miner", source: spawn.memory.availableSources.pop()}});
        }else if(harvesters < minHarvesters){
            spawn.spawnCreep(makeBody(totalEnergy, "harvester"), "Harvester" + Game.time, {memory: {role: "harvester"}});
        }else if(defenders < minDefenders){
            spawn.spawnCreep(makeBody(totalEnergy, "defender"), "Defender" + Game.time, {memory: {role: "defender"}});
        }else if(upgraders < minUpgraders){
            spawn.spawnCreep(makeBody(totalEnergy, "upgrader"), "Upgrader" + Game.time, {memory: {role: "upgrader"}});
        }else if(builders < minBuilders){
            spawn.spawnCreep(makeBody(totalEnergy, "builder"), "Builder" + Game.time, {memory: {role: "builder"}});
        }

}

/* @param var energy */
/* @param var type */
function makeBody(energy, type){

    var body = [];

    var usedEnergy = 0;

    var work = 0;
    var move = 0;
    var carry = 0;
    var attack = 0;

    if(type == "builder" || type == "upgrader"){
        for(var i = 0; i < energy; i += 50){
            if(work <= move && move == carry && (energy - usedEnergy) >= 100){
                body.push(WORK);
                work ++;
                usedEnergy += 100
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
        for(var i = 0; i < (energy - 50); i += 50){
            if(work < 5){
                body.push(WORK);
                work ++;
            }
        }
    }else if(type == "defender"){
        for(var i = 0; i < energy; i += 50){
            if(move < (attack / 2) && (energy - usedEnergy) >= 50){
                body.push(MOVE);
                move ++;
            }else if((energy - usedEnergy) >= 80){
                body.push(ATTACK);
                attack ++;
            }
        }
    }
    else if(type == "harvester"){
        for(var i = 0; i < energy; i += 50){
            if(carry <= move && (energy - usedEnergy) >= 50){
                body.push(CARRY);
                carry ++;
            }else if((energy - usedEnergy) >= 50){
                body.push(MOVE);
                move ++;
            }
        }
    }
}
