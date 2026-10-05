function init(hero) {
    hero.setName("Cyborg");
    hero.setVersion("DCEU");
    hero.setTier(8);

    hero.setChestplate("Body");

    hero.addPowers("unconventional:cyborg");
    hero.addAttribute("PUNCH_DAMAGE", 7.0, 0);
    hero.addAttribute("JUMP_HEIGHT", 1.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 8.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.2, 1);

    hero.addKeyBind("AIM", "key.crabCannon", 1);
    hero.addKeyBind("SHIELD", "key.naniteShield", 2);
	
	hero.addKeyBind("CHARGED_BEAM", "Mech Arm Jab", 4);
    hero.addKeyBind("MECH_ARMS", "Toggle Mech Arms", 5);


    hero.setModifierEnabled(isModifierEnabled);
    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.setHasProperty(hasProperty);
    hero.supplyFunction("canAim", entity => entity.getHeldItem().isEmpty() && !entity.getData("fiskheroes:shield") && entity.getData("fiskheroes:barrel_roll_timer") == 0);

    hero.addSoundEvent("MASK_OPEN", "fiskheroes:mk50_mask_open");
    hero.addSoundEvent("MASK_CLOSE", "fiskheroes:mk50_mask_close");
    hero.addSoundEvent("AIM_START", ["unconventional:cyborg_dceu_cannon_aim", "unconventional:cyborg_dceu_cannon_static"] );
    hero.addSoundEvent("AIM_STOP", "unconventional:cyborg_dceu_cannon_retract");

    hero.setTickHandler((entity, manager) => {
		var nbt = entity.getWornChestplate().nbt();
		var flying = entity.getData("fiskheroes:flying");
		manager.setBoolean(nbt, 'DUAL', flying);
		
        manager.incrementData(entity, "unconventional:dyn/cooldown_1", 10, entity.getData("fiskheroes:aiming_timer") > 0 && flying && entity.getData("unconventional:dyn/cooldown_2") == 1);
        manager.incrementData(entity, "unconventional:dyn/cooldown_2", 3, entity.getData("fiskheroes:aiming_timer") > 0 && flying);

		if (entity.getData("fiskheroes:beam_shooting_timer") == 0 && entity.getData("fiskheroes:beam_charge") == 0) {
            manager.setData(entity, "unconventional:dyn/punch", Math.floor(Math.random()*2));
        }
		
		manager.incrementData(entity, "unconventional:dyn/jab_1_timer", 2, 4, entity.getData("fiskheroes:beam_shooting_timer") > 0 && entity.getData("unconventional:dyn/punch") == 0);
		manager.incrementData(entity, "unconventional:dyn/jab_2_timer", 2, 4, entity.getData("fiskheroes:beam_shooting_timer") > 0 && entity.getData("unconventional:dyn/punch") == 1);
		
		if ((entity.getAir() < 3 || entity.world().getDimension() == 2595) && entity.getData("fiskheroes:mask_open_timer2") == 0) {
            manager.setData(entity, "fiskheroes:mask_open", true);
        }
		
        var item = entity.getHeldItem();
        flying &= !entity.as("PLAYER").isUsingItem();
		manager.incrementData(entity, "fiskheroes:dyn/booster_timer", 3, flying);
        manager.incrementData(entity, "fiskheroes:dyn/booster_r_timer", 3, flying && item.isEmpty() && !entity.isPunching() && entity.getData("fiskheroes:aiming_timer") == 0 && entity.getData("fiskheroes:shield_timer") == 0);
        manager.incrementData(entity, "fiskheroes:dyn/booster_l_timer", 3, flying && !item.doesNeedTwoHands() && !(entity.getData("fiskheroes:aiming_timer") > 0 && nbt.getBoolean("DUAL")) );
	});


}

function isModifierEnabled(entity, modifier) {
	var nbt = entity.getWornChestplate().nbt();
    switch (modifier.name()) {
        case "fiskheroes:repulsor_blast":
            return entity.getData("fiskheroes:aimed_timer") >= 1 && modifier.id() == 'blast_double' == nbt.getBoolean("DUAL");
		case "fiskheroes:energy_bolt":
            return false;
        case "fiskheroes:blade":
            return !entity.getData("fiskheroes:aiming") && !entity.getData("fiskheroes:shield") && !(entity.isSprinting() && entity.getData("fiskheroes:flying"));
        case "fiskheroes:regeneration":
            return !entity.getData("fiskheroes:blade");
        case "fiskheroes:water_breathing":
            return entity.getData("fiskheroes:mask_open");
        default:
            return true;
    }
}

function isKeyBindEnabled(entity, keyBind) {
    switch (keyBind) {
        case "SHIELD":
            return !(entity.isSprinting() && entity.getData("fiskheroes:flying"));
		case "CHARGED_BEAM":
			return entity.getData("fiskheroes:dyn/nanite_timer") == 1;
		default:
			return true;
    }
}

function hasProperty(entity, property) {
    switch (property) {
        case "MASK_TOGGLE":
            return true;
        case "BREATHE_SPACE":
            return entity.getData("fiskheroes:mask_open");
        default:
            return false;
    }
}