function init(hero) {
    hero.setName("Weapon XI");
	hero.setAliases("deadpool_xmen");
    hero.setTier(6);
    
    hero.setHelmet("Head");
    hero.setChestplate("Body");
    hero.setLeggings("Pants");
    hero.setBoots("Shoes");
    
    hero.addPowers("unconventional:weapon_11_physiology", "fiskheroes:healing_factor");
	
    hero.addAttribute("PUNCH_DAMAGE", 6.0, 0);
    hero.addAttribute("WEAPON_DAMAGE", 2.0, 0);
    hero.addAttribute("JUMP_HEIGHT", 2.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 1.0, 1);
    hero.addAttribute("SPRINT_SPEED", 0.2, 1);
	
	hero.addKeyBind("BLADE", "Toggle Blades", 1);
	hero.addKeyBind("CHARGED_BEAM", "Optic Blast", 2);
	hero.addKeyBind("SLOW_MOTION", "Slow-Motion Vision", 4);
	hero.addKeyBind("TELEPORT", "Warp", 5);

	hero.setAttributeProfile(getProfile);
	hero.addAttributeProfile("BLADE", profile => {
		profile.inheritDefaults();
		profile.addAttribute("PUNCH_DAMAGE", 11.5, 0);
	});
	
    hero.setDamageProfile(getProfile);	
	hero.addDamageProfile("BLADE", {
        "types": {
            "SHARP": 1.0,
            "ADAMANTIUM": 1.0
        }
    });
	hero.setKeyBindEnabled(isKeyBindEnabled);
}

function getProfile(entity) {
    return entity.getData("fiskheroes:blade") ? "BLADE" : null;
}

function isKeyBindEnabled(entity, keyBind) {
	if (entity.getData('fiskheroes:teleport_timer')>0) {
		return keyBind == "TELEPORT" || keyBind == "SLOW_MOTION"
	}	
    switch (keyBind) {
    case "BLADE":
        return entity.getHeldItem().isEmpty();
    default:
        return true;
    }
}