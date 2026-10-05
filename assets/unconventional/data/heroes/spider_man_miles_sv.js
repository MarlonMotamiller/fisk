function init(hero) {
    hero.setName("Spider-Man/Miles Morales");
	hero.setVersion("Spider-Verse");
    hero.setTier(7);
    
    hero.setHelmet("item.superhero_armor.piece.mask");
    hero.setChestplate("item.superhero_armor.piece.chestpiece");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.boots");
	
	hero.addPowers("unconventional:mutated_spider_physiology_sv", "unconventional:web_shooters_miles_sv");
    
    hero.addAttribute("FALL_RESISTANCE", 11.0, 0);
    hero.addAttribute("JUMP_HEIGHT", 1.5, 0);
    hero.addAttribute("PUNCH_DAMAGE", 7.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.4, 1);
    hero.addAttribute("STEP_HEIGHT", 0.5, 0);
    hero.addAttribute("IMPACT_DAMAGE", 0.35, 1);
    
    hero.addKeyBind("UTILITY_BELT", "key.webShooters", 1);
    hero.addKeyBind("WEB_ZIP", "key.webZip", 2);
    hero.addKeyBindFunc("func_WEB_SWINGING", webSwingingKey, "key.webSwinging", 3);
    hero.addKeyBind("SLOW_MOTION", "key.slowMotion", 4);
    hero.addKeyBind("INVISIBILITY", "Camouflage", 4);
    hero.addKeyBind("CHARGE_ENERGY", "Venom Punch", 5);
    
	hero.addSoundEvent("PUNCH", "unconventional:miles_venom_punch");
    
    hero.setDefaultScale(0.9);
	
    hero.setModifierEnabled(isModifierEnabled);
    hero.setKeyBindEnabled(isKeyBindEnabled);
	
	hero.supplyFunction("canDischargeEnergy", false);
	  
}

function webSwingingKey(player, manager) {
    var flag = player.getData("fiskheroes:web_swinging");
    
    if (!flag) {
        manager.setDataWithNotify(player, "fiskheroes:prev_utility_belt_type", player.getData("fiskheroes:utility_belt_type"));
        manager.setDataWithNotify(player, "fiskheroes:utility_belt_type", -1);
    }
    
    manager.setDataWithNotify(player, "fiskheroes:web_swinging", !flag);
    return true;
}

function isModifierEnabled(entity, modifier) {
    switch (modifier.name()) {
    case "fiskheroes:web_swinging":
        return entity.getHeldItem().isEmpty() && entity.getData("fiskheroes:utility_belt_type") == -1;
    case "fiskheroes:leaping":
        return modifier.id() == "springboard" == (entity.getData("fiskheroes:ticks_since_swinging") < 5);
    case "fiskheroes:invisibility":
        return !entity.isPunching();
    default:
        return true;
    }
}

function isKeyBindEnabled(entity, keyBind) {
    switch (keyBind) {
    case "WEB_SWINGING":
        return entity.getHeldItem().isEmpty();
	case "INVISIBILITY":
        return entity.isSneaking();
	case "SLOW_MOTION":
        return !entity.isSneaking();
    default:
        return true;
    }
}
