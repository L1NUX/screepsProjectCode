var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleDefender = require('role.defender');
var roleMiner = require('role.miner');

module.exports.loop = function () {
    var spawn = Game.spawns['Spawn1'];

    var energyContainers = spawn.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_CONTAINER);
        }
    });

    var totalEnergy = 0;

    var sources = spawn.room.find(FIND_SOURCES);

    for(var i = 0; i < energyContainers.length; i ++){
        totalEnergy += energyContainers[i].energyCapacity;
    }

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

    for(var creep in spawn.room.find(FIND_MY_CREEPS)){

        console.log(creep);

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
            console.log("testing");
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
        spawn.spawnCreep(makeBody(totalEnergy, "defender"), "Defender" + Game.time, {memory: {role: "defender", tIndex: Math.round(Math.random() + 1)}});
    }else if(upgraders < minUpgraders){
        spawn.spawnCreep(makeBody(totalEnergy, "upgrader"), "Upgrader" + Game.time, {memory: {role: "upgrader"}});
    }else if(builders < minBuilders){
        spawn.spawnCreep(makeBody(totalEnergy, "builder"), "Builder" + Game.time, {memory: {role: "builder"}});
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

    if(type == "builder" || type == "upgrader"){
        while(usedEnergy < energy) {
            var availableEnergy = energy - usedEnergy;

            if(work <= move && move == carry && availableEnergy >= 100){
                body.push(WORK);
                work ++;
                usedEnergy += 100;
            }else if(move <= carry && availableEnergy >= 50){
                body.push(MOVE);
                move ++;
                usedEnergy += 50;
            }else if(availableEnergy >= 50){
                body.push(CARRY);
                carry ++;
                usedEnergy += 50;
            }
        }
    }else if(type == "miner"){
        body.push(MOVE);
        move ++;
        usedEnergy += 50;
        
        while(usedEnergy < energy) {
            if(work < 5 && energy - usedEnergy >= 100) {
                body.push(WORK);
                work ++;
                usedEnergy += 100;
            }
        }
    }else if(type == "defender"){
        while(usedEnergy < energy) {
            var availableEnergy = energy - usedEnergy;

            if(move < (attack / 2) && availableEnergy >= 50){
                body.push(MOVE);
                move ++;
                usedEnergy += 50;
            }else if(availableEnergy >= 80){
                body.push(ATTACK);
                attack ++;
                usedEnergy += 80;
            }
        }
    }else if(type == "harvester"){
        while(usedEnergy < energy) {
            var availableEnergy = energy - usedEnergy;
            
            if(carry <= move && availableEnergy >= 50){
                body.push(CARRY);
                carry ++;
                usedEnergy += 50;
            }else if(availableEnergy >= 50){
                body.push(MOVE);
                move ++;
                usedEnergy += 50;
            }
        }
    }

    return body;
}
