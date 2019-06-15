var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleDefender = require('role.defender');
var roleMiner = require('role.miner');
var roleHealer = require('role.healer');
var roleAttacker = require('role.attacker');
var roleClaimer = require('role.claimer');

module.exports.loop = function () {
    var spawn = Game.spawns['Spawn1'];
    
    if(Game.time % 1500 == 0){
        for(var i in Memory.creeps){
            if(!Game.creeps[i]){
                delete Memory.creeps[i];
            }
        }
    }

    var energyContainers = spawn.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN);
        }
    });


    var totalEnergy = 0;
    var currentEnergy = 0;


    var sources = spawn.room.find(FIND_SOURCES);


    var container;

    for(var i = 0; i < energyContainers.length; i ++) {

        container = energyContainers[i];

        totalEnergy += container.energyCapacity;
        currentEnergy += container.energy;
    }


    for(var i = 0; i < spawn.room.find(FIND_MY_CREEPS).length; i ++){
        
    }


    var builders = 0;
    var defenders = 0;
    var upgraders = 0;
    var harvesters = 0;
    var miners = 0;
    var healers = 0;
    var attackers = 0;
    var claimers = 0;

    // counting of currently spawned creeps
    for(var i in Game.creeps) {
        var creep = Game.creeps[i];
        var role = creep.memory.role;
        
        if(role == 'miner') {
            if(creep.ticksToLive <= 30){
                spawn.memory.availableSources.push(creep.memory.source);
                creep.suicide();
                console.log("MINER ABOUT TO DIE");
            }/*else if(Game.time % 3000 == 0){
                spawn.memory.availableSources = sources;
                creep.suicide();
            }*/

            miners ++;
            roleMiner.run(creep);
        }else if(role == 'builder'){
            builders ++;
            roleBuilder.run(creep);
        } else if(role == 'defender') {
            defenders ++;
            roleDefender.run(creep);
        } else if(role == 'harvester') {
            harvesters ++;
            roleHarvester.run(creep);
        } else if(role == 'upgrader') {
            upgraders ++;
            roleUpgrader.run(creep);
        } else if(role == 'healer') {
            healers++;
            roleHealer.run(creep);
        } else if(role == 'attacker') {
            attackers++;
            roleAttacker.run(creep);
        } else if(role == 'claimer'){
            claimers ++;
            roleClaimer.run(creep);
        }
            /*else{
            var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION ||
                                structure.structureType == STRUCTURE_SPAWN ||
                                structure.structureType == STRUCTURE_TOWER
                                ) && ((_.sum(structure.store) < structure.storeCapacity) || (structure.energy < structure.energyCapacity));
                    }
            });
            
            if(targets.length > 0) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
            
            roleHarvester.run(creep);
        }*/
    }

    for(var tower in spawn.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_TOWER);
            }
        }))
    {
        tower.heal();
    }

    // put all sources back into available sources when no miners exist
    if(miners == 0) {
        spawn.memory.availableSources = sources;
        
        console.log("0 MINERS!"); // debugging
        totalEnergy = 300;
    }
    
    //var spawnAmount = 2;
    var spawnAmount = spawn.room.controller.level;

    var minMiners = sources.length;
    var minBuilders = minMiners * 4 * (spawnAmount / 2);
    var minDefenders = (spawn.room.find(FIND_MY_CREEPS).length - defenders - miners) / 2;
    var minUpgraders = minMiners * 3 * (spawnAmount / 2);
    var minHarvesters = minMiners * 4  * (spawnAmount / 2);
    var minHealers = Math.round(attackers / 2);
    var minAttackers = 5; // change this to some other thing like minDefenders
    var minClaimers = 1;

    var display = false;
    
    if(attackers == minAttackers){
        console.log("MAXED OUT!");
        
        minDefenders *= 2;
        minUpgraders *= 2;
    }

    // Uncomment to fix bug where harvesters don't spawn unless energy is 300
    /*if(harvesters == 0) {
        totalEnergy = 300;
    }*/
    
    //--- Uncomment to enable information display every tick (useful for debugging) ---
    //display = true;
    
    if(display && Game.time % 300) {
        console.log("=======================");
        console.log("     *Information*");
        console.log("+++++++++++");
        console.log("Minimum Miners: " + minMiners);
        console.log("Current Miners: " + miners);
        console.log("-----------");
        console.log("Minimum Defenders: " + minDefenders);
        console.log("Current Defenders: " + defenders);
        console.log("-----------");
        console.log("Minimum Harvesters: " + minHarvesters);
        console.log("Current Harvesters: " + harvesters);
        console.log("-----------");
        console.log("Minimum Builders: " + minBuilders);
        console.log("Current Builders: " + builders);
        console.log("-----------");
        console.log("Minimum Upgraders: " + minUpgraders);
        console.log("Current Upgraders: " + upgraders);
        console.log("-----------");
        console.log("Minimum Healers: " + minHealers);
        console.log("Current Healers: " + healers);
        console.log("-----------");
        console.log("Minimum Attackers: " + minAttackers);
        console.log("Current Attackers: " + attackers);
        console.log("-----------");
        console.log("Minimum Claimers: " + minClaimers);
        console.log("Current Claimers: " + claimers);
        console.log("+++++++++++");
        console.log();
        console.log("Max Energy: " + totalEnergy);
        console.log("Current Energy: " + currentEnergy);
        console.log("=======================");
    }
    
    if(harvesters == 0){
        totalEnergy = 300;
    }
    
    if(currentEnergy >= totalEnergy) {
        if(miners < minMiners) {
            /*var keys = Object.keys(spawn.memory.miners);
            if(keys.length > 0) {
                for(var key in keys) {
                    if(!(Game.creeps[spawn.memory.miners[key]])) {
                        spawn.memory.availableSources.push(spawn.memory.miners[key]);
                        delete spawn.memory.miners[key];
                        console.log("replace dead miner's source");
                    }
                }
            }*/
            spawn.spawnCreep(makeBody(totalEnergy, "miner"), "Miner" + Game.time, {memory: {role: "miner", source: spawn.memory.availableSources.pop()}});
            
            //spawn.memory.miners["Miner" + Game.time] = Game.creeps["Miner" + Game.time].memory.source;
        }else if(defenders < minDefenders) {
            spawn.spawnCreep(makeBody(totalEnergy, "defender"), "Defender" + Game.time, {memory: {role: "defender", tIndex: Math.round(Math.random() + 1)}});
        }else if(healers < minHealers && attackers > 0) {
            spawn.spawnCreep(makeBody(totalEnergy, "healer"), "Healer" + Game.time, {memory: {role: "healer"}});
        }else if(harvesters < minHarvesters) {
            spawn.spawnCreep(makeBody(totalEnergy, "harvester"), "Harvester" + Game.time, {memory: {role: "harvester"}});
        }else if(builders < minBuilders) {
            spawn.spawnCreep(makeBody(totalEnergy, "builder"), "Builder" + Game.time, {memory: {role: "builder"}});
        }else if(upgraders < minUpgraders) {
            spawn.spawnCreep(makeBody(totalEnergy, "upgrader"), "Upgrader" + Game.time, {memory: {role: "upgrader"}});
        }else if(healers < minHealers) {
            spawn.spawnCreep(makeBody(totalEnergy, "healer"), "Healer" + Game.time, {memory: {role: "healer"}});
        }else if(attackers < minAttackers) {
            spawn.spawnCreep(makeBody(totalEnergy, "attacker"), "Attacker" + Game.time, {memory: {role: "attacker"}});
        }/*else if(claimers < minClaimers){
            spawn.spawnCreep(makeBody(totalEnergy, "claimer"), "Attacker" + Game.time, {memory: {role: "attacker"}});
        }*/
    }
}

/* @param var energy, type */
function makeBody(energy, type) {
    var body = [];

    var usedEnergy = 0;

    var work = 0;
    var move = 0;
    var carry = 0;
    var attack = 0;
    var heal = 0;
    var claim = 0;

    if(type == "builder" || type == "upgrader") {
        while(energy - usedEnergy >= 50) {
            if(work <= move && move == carry && (energy - usedEnergy) >= 100) {
                body.push(WORK);
                work ++;
                usedEnergy += 100;
            }else if(move <= carry && (energy - usedEnergy) >= 50) {
                body.push(MOVE);
                move ++;
                usedEnergy += 50;
            }else if((energy - usedEnergy) >= 50) {
                body.push(CARRY);
                carry ++;
                usedEnergy += 50;
            }else{
                break;
            }
        }
    } else if(type == "miner") {
        body.push(MOVE);
        move ++;
        usedEnergy += 50;
        
        while(energy - usedEnergy >= 100) {
            if(work < 5) {
                body.push(WORK);
                work ++;
                usedEnergy += 100;
            }else{
                break;
            }
        }
    } else if(type == "defender") {
        while(energy - usedEnergy >= 50) {
            if(move < (attack / 2)) {
                body.push(MOVE);
                move ++;
                usedEnergy += 50;
            }else if((energy - usedEnergy) >= 80) {
                body.push(ATTACK);
                attack ++;
                usedEnergy += 80;
            }else if ((energy - usedEnergy) >= 10){
                body.push(HEAL);
                usedEnergy += 10;
            }else{
                break;
            }
        }
    } else if(type == "harvester") {
        while(energy - usedEnergy >= 50) {
            if(carry <= move) {
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
            }else if(energy - usedEnergy >= 250) {
                body.push(HEAL);
                heal ++;
                usedEnergy += 250;
            }else{
                break;
            }
        }
    } else if(type == "attacker") {
        while(energy - usedEnergy >= 50) {
            if(move < (attack / 2)) {
                body.push(MOVE);
                move ++;
                usedEnergy += 50;
            } else if((energy - usedEnergy) >= 80) {
                body.push(ATTACK);
                attack ++;
                usedEnergy += 80;
            }else if ((energy - usedEnergy) >= 10){
                body.push(HEAL);
                usedEnergy += 10;
            }else{
                break;
            }
        }
    }/*else if(type == "claimer"){
        while(energy - usedEnergy >= 50){
            if(claim < move && (energy - usedEnergy) >= 600){
                body.push(CLAIM);
                claim ++;
                usedEnergy += 600;
            }else if((energy - usedEnergy) >= 50){
                body.push(MOVE);
                move ++;
                usedEnergy += 50;
            }
        }
    }*/

    return body;
}
