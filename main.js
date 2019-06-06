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

    var sources = spawn.room.find(FIND_SOURCES);

    var container;

    for(var i = 0; i < energyContainers.length; i ++){

        container = energyContainers[i];

        totalEnergy += container.energyCapacity;
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

        if(creep.memory.role == 'builder'){
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
        }else if(creep.memory.role == 'miner'){
            miners ++;
            roleMiner.run(creep);
            if(creep.ticksToLive == 1){
                spawn.memory.availableSources.push(creep.memory.source);
            }
        } else if(creep.memory.role == 'healer') {
            healers++;
            roleHealer.run(creep);
        }
    }

    var minBuilders = miners * 4;
    var minDefenders = _.countBy(spawn.room.find(FIND_MY_CREEPS)) / 4;
    var minUpgraders = miners * 3;
    var minHarvesters = miners * 5;
    var minMiners = sources.length;
    var minHealers = Math.round(attackers / 3);

    if(miners == 0){
        for(var i = 0; i < sources.length; i ++){
            spawn.memory.availableSources[i] = sources[i];
        }
        console.log("0 MINERS!");
    }

    if(miners < minMiners && spawn.energy == spawn.energyCapacity){
        spawn.spawnCreep(makeBody(totalEnergy, "miner"), "Miner" + Game.time, {memory: {role: "miner", source: spawn.memory.availableSources.pop()}});
    } else if(harvesters < minHarvesters){
        spawn.spawnCreep(makeBody(totalEnergy, "harvester"), "Harvester" + Game.time, {memory: {role: "harvester"}});
    } else if(defenders < minDefenders){
        spawn.spawnCreep(makeBody(totalEnergy, "defender"), "Defender" + Game.time, {memory: {role: "defender", tIndex: Math.round(Math.random() + 1)}});
    } else if(upgraders < minUpgraders){
        spawn.spawnCreep(makeBody(totalEnergy, "upgrader"), "Upgrader" + Game.time, {memory: {role: "upgrader"}});
    } else if(builders < minBuilders){
        spawn.spawnCreep(makeBody(totalEnergy, "builder"), "Builder" + Game.time, {memory: {role: "builder"}});
    } else if(healers < minHealers) {
        spawn.spawnCreep(makeBody(totalEnergy, "healer"), "Healer" + Game.time, {memory: {role: "healer"}});
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
        for(var i = 0; i < energy; i += 50){
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
        for(var i = 0; i < energy - usedEnergy; i += 100){
            console.log("work--");
            if(work < 5){
                body.push(WORK);
                work ++;
                usedEnergy += 100;
            }
        }
    }else if(type == "defender"){
        for(var i = 0; i < energy; i += 50){
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
        for(var i = 0; i < energy; i += 50){
            if(carry <= move && (energy - usedEnergy) >= 50){
                body.push(CARRY);
                carry ++;
                usedEnergy += 50;
            }else if((energy - usedEnergy) >= 50){
                body.push(MOVE);
                move ++;
                usedEnergy += 50;
            }
        }
    } else if(type == "healer") {
        for(var i = 0; i < energy; i += 50) {
            if(move <= heal && availableEnergy >= 50) {
                body.push(MOVE);
                move ++;
                usedEnergy += 50;
            } else if(availableEnergy >= 250) {
                body.push(HEAL);
                heal ++;
                usedEnergy += 250;
            }
        }
    }

    return body;
}
