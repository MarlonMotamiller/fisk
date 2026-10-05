var speedster_base = implement("fiskheroes:external/speedster_base");
var sprint_break = implement("unconventional:external/sprint_break");

function init(hero) {
    hero.setName("The Flash/Barry Allen");
    hero.setVersion("DCEU");
    hero.setTier(5);
    
    hero.setChestplate("item.superhero_armor.piece.chestpiece");
    hero.addEquipment("fiskheroes:flash_ring");

    hero.addPowers("unconventional:speed_force_dceu");

    hero.addAttribute("PUNCH_DAMAGE", 4.0, 0);
    hero.addAttribute("JUMP_HEIGHT", 2.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 4.5, 0);
    hero.addAttribute("BASE_SPEED_LEVELS", 7.0, 0);

    hero.addKeyBind("SUPER_SPEED", "key.superSpeed", 1);
    hero.addKeyBind("SLOW_MOTION", "key.slowMotion", 2);
    hero.addKeyBind("CHARGE_ENERGY", "Charge Speed", 4);
    
    hero.setModifierEnabled(isModifierEnabled);
    hero.setKeyBindEnabled(isKeyBindEnabled);

    hero.addAttributeProfile("SHIELD", shieldProfile);
    hero.addAttributeProfile("SPEED", speedProfile);
    hero.setAttributeProfile(getAttributeProfile);

    var speedPunch = speedster_base.createSpeedPunch(hero);
    hero.setDamageProfile(entity => speedPunch.get(entity, null));

    hero.setTickHandler((entity, manager) => {
        speedster_base.tick(entity, manager);
    
        //At speed Level 24, you should maybe be able to teleport to the QR and Back in a time bubble?? Idk

        //Lenses
        manager.incrementData(entity, "unconventional:dyn/goggle_timer", 5, entity.getData("fiskheroes:speed") >= 3 && entity.getData("fiskheroes:speeding"));

        //Start up
        if (!entity.getData("fiskheroes:speeding") && (entity.getData("fiskheroes:energy_charge") == 1 || (entity.getData("fiskheroes:energy_charge") != 0 && !entity.getData("fiskheroes:energy_charging")))) {
			manager.setData(entity, 'fiskheroes:speeding', true);
            manager.setData(entity, 'unconventional:dyn/sprint_timer', entity.getData('fiskheroes:energy_charge'));
            manager.setData(entity, 'fiskheroes:energy_charge', 0);
		}
        manager.incrementData(entity, "unconventional:dyn/sprint_timer", 60, false);

        //Speedforce

        if (entity.getData("fiskheroes:speed_sprinting") && entity.getData("fiskheroes:speed") > 1 && entity.getData("fiskheroes:speeding") && entity.getData("unconventional:dyn/transformation_timer") == 1) {
			manager.setData(entity, 'unconventional:dyn/speedforce', true);
		}
		else {
			manager.setData(entity, 'unconventional:dyn/speedforce', false);
		}

        //--
        if (entity.getData("fiskheroes:speeding") && entity.getData("fiskheroes:speed") >= 1 && entity.getData("unconventional:dyn/transformation_timer") == 0) {
            manager.setData(entity, "unconventional:dyn/speedforce_cooldown", entity.getData("unconventional:dyn/speedforce_cooldown") - (entity.getData("unconventional:dyn/speedforce_timer") / 100));
        }
        else {
            manager.setData(entity, "unconventional:dyn/speedforce_cooldown", entity.getData("unconventional:dyn/speedforce_cooldown") + (entity.getData("unconventional:dyn/transformation_timer") == 1 / 150));
        }

        //Speed On/Off
        manager.incrementData(entity, "unconventional:dyn/speedforce_timer", 5, entity.getData("fiskheroes:speeding"));

		sprint_break.tick(entity, manager, 3.0);
    });
}

function getDamageProfile(entity) {
    return entity.getData("fiskheroes:speeding") ? "SPEED_PUNCH" : null;
}

function getAttributeProfile(entity) {
    return entity.getData("unconventional:dyn/sprint_timer") != 0 ? "SPEED" : ((entity.getData("fiskheroes:energy_charging") || entity.getData("unconventional:dyn/dash")) ? "SHIELD" : null);
}

function shieldProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("BASE_SPEED", -1.0, 1);
    profile.addAttribute("JUMP_HEIGHT", -2.5, 1);
}

function speedProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("SPRINT_SPEED", 2, 1);
}

function isModifierEnabled(entity, modifier) {
    switch (modifier.name()) {
    case "fiskheroes:super_speed":
        return !entity.getData("fiskheroes:shield_blocking");
    case "fiskheroes:shield":
        return !entity.getData("fiskheroes:speeding");
    case "fiskheroes:leaping":
        return entity.getData("fiskheroes:speeding") && entity.isSprinting();
    default:
        return true;
    }
}

function isKeyBindEnabled(entity, keyBind) {
    switch (keyBind) {
    case "SUPER_SPEED":
        return !entity.getData("fiskheroes:shield_blocking") && (entity.getData("unconventional:dyn/transformation_timer") == 0 || entity.getData("unconventional:dyn/transformation_timer") == 1);
    case "CHARGE_ENERGY":
        return entity.isSprinting() && !entity.getData("fiskheroes:speeding");
    default:
        return true;
    }
}