var speedster_base = implement("unconventional:external/speedster_base");

function init(hero) {
    hero.setName("Pietro Maximoff");
    hero.setAliases("fast");
    hero.setTier(2);
    
    hero.setChestplate("Shirt");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.shoes");
    
    hero.addPowers("unconventional:super_speed");

    hero.addAttribute("PUNCH_DAMAGE", 5.0, 0);
    hero.addAttribute("JUMP_HEIGHT", 1.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 4.5, 0);
    hero.addAttribute("BASE_SPEED_LEVELS", 3.0, 0);

    hero.addKeyBind("SUPER_SPEED", "key.superSpeed", 1);
    hero.addKeyBind("SLOW_MOTION", "key.slowMotion", 2);
    
    var speedPunch = speedster_base.createSpeedPunch(hero);
    hero.setDamageProfile(entity => speedPunch.get(entity, null));

    hero.addSoundOverrides("MCU", speedster_base.mergeSounds("unconventional:super_speed", speedster_base.SOUNDS_PIETRO));

    hero.setTickHandler((entity, manager) => {
        speedster_base.tick(entity, manager);

        var speeding = entity.getData("fiskheroes:speeding") && entity.getData("fiskheroes:speed") > 1 && entity.isSprinting();
        manager.setData(entity, "fiskheroes:energy_projection", speeding);
    });
}

function getDamageProfile(entity) {
    return entity.getData("fiskheroes:speeding") ? "SPEED_PUNCH" : null;
}
