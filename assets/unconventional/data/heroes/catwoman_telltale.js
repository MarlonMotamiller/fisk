function init(hero) {
    hero.setName("Catwoman");
    hero.setVersion("Telltale");
    hero.setTier(3);
    hero.hide();
    
    hero.setHelmet("item.superhero_armor.piece.mask");
    hero.setChestplate("item.superhero_armor.piece.jacket");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.boots");
    hero.addEquipment("fiskheroes:grappling_gun");
    
    hero.addPowers("unconventional:protective_leotard");
	
    hero.addAttribute("FALL_RESISTANCE", 8.5, 0);
    hero.addAttribute("JUMP_HEIGHT", 2.0, 0);
    hero.addAttribute("PUNCH_DAMAGE", 5.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.3, 1);
    hero.addAttribute("WEAPON_DAMAGE", 1.0, 0);
    
    hero.addKeyBind("BLADE", "key.claws", 1);
    hero.addKeyBind("AIM", "key.aim", 3);
    
    hero.setKeyBindEnabled(isKeyBindEnabled);

    hero.setHasPermission((entity, permission) => permission == "USE_GRAPPLING_GUN");
    hero.supplyFunction("canAim", entity => entity.getHeldItem().name() == "fiskheroes:grappling_gun");
	
    hero.addAttributeProfile("CLAWS", clawsProfile);
    hero.setAttributeProfile(getProfile);
    hero.setDamageProfile(getProfile);
    hero.addDamageProfile("CLAWS", {"types": {"SHARP": 1.0}});
}

function getProfile(entity) {
    return entity.getData("fiskheroes:blade") ? "CLAWS" : null;
}

function clawsProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 6.5, 0);
}

function isKeyBindEnabled(entity, keyBind) {
	return keyBind != "SHIELD_THROW" || entity.getHeldItem().name() == "fiskheroes:grappling_gun";
}