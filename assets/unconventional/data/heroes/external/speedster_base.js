function makeSounds(slowMotion, running) {
    return {
        "running": running
    };
}

var SOUNDS_FLASH_DCEU = makeSounds("dceu", {
    "ENABLE": [],
    "MOVE": ["unconventional:super_speed_move_loop_the_flash_dceu", "unconventional:super_speed_move_loop_wind"],
    "SPRINT": "unconventional:super_speed_sprint_the_flash_dceu",
    "STOP": "unconventional:super_speed_stop_the_flash_dceu"
});

var SOUNDS_FLASH_DCEU_JL = makeSounds("dceu", {
    "ENABLE": [],
    "MOVE": ["unconventional:super_speed_move_loop_the_flash_dceu", "unconventional:super_speed_move_loop_wind"],
    "SPRINT": "unconventional:super_speed_sprint_the_flash_dceu",
    "STOP": "unconventional:super_speed_stop_the_flash_dceu"
});

var SOUNDS_PIETRO = makeSounds("mcu", {
    "ENABLE": [],
    "MOVE": ["unconventional:super_speed_move_loop_wind"],
    "SPRINT": "unconventional:super_speed_sprint_pietro",
    "STOP": "unconventional:super_speed_stop_pietro"
});

function tick(entity, manager) {
    manager.incrementData(entity, "fiskheroes:dyn/speed_sprint_timer", 4, entity.isSprinting() && entity.getData("fiskheroes:speed_sprinting") && entity.getData("fiskheroes:speed") > 1);
}

function createSpeedPunch(hero, damageProfile) {
    if (typeof damageProfile === "undefined") {
        damageProfile = {
            "types": {
                "BLUNT": 1.0
            },
            "properties": {
                "HIT_COOLDOWN": 5
            }
        };
    }

    hero.addDamageProfile("SPEED_PUNCH", damageProfile);
    return {
        get: (entity, orElse) => entity.getData("fiskheroes:speeding") ? "SPEED_PUNCH" : orElse
    };
}

function mergeSounds(powerName, sounds, profile) {
    var profile2 = { "powers": {} };
    profile2.powers[powerName] = {
        "fiskheroes:super_speed": sounds.running,
        "fiskheroes:slow_motion": sounds.slowMotion
    };
    if (typeof profile === "undefined") {
        return profile2;
    }
    return merge(profile, profile2);
}

function merge(from, into) {
    if (typeof from !== "object") {
        return from;
    }
    var result = {};
    for (var attrname in into) {
        result[attrname] = into[attrname];
    }
    for (var attrname in from) {
        if (result.hasOwnProperty(attrname)) {
            result[attrname] = merge(from[attrname], result[attrname]);
        }
        else {
            result[attrname] = from[attrname];
        }
    }
    return result;
}
