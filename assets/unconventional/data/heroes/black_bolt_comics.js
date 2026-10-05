function init(hero) {
    hero.setName("Black Bolt");
    hero.setVersion("Comics");
    hero.setTier(7);
    
    hero.setHelmet("item.superhero_armor.piece.cowl");
    hero.setChestplate("item.superhero_armor.piece.chestpiece");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.boots");

    hero.addPowers("unconventional:inhuman_black_bolt");
	
    hero.addAttribute("FALL_RESISTANCE", 10.0, 0);
    hero.addAttribute("JUMP_HEIGHT", 1.5, 0);
    hero.addAttribute("PUNCH_DAMAGE", 6.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.40, 1);
	hero.addAttribute("WEAPON_DAMAGE", 1.5, 0);

    hero.addKeyBind("CHARGED_BEAM", "I'm Sorry", 1);
    
    hero.addAttributeProfile("SCREAM", screamProfile);
    hero.setAttributeProfile(getAttributeProfile);
    hero.setKeyBindEnabled(isKeyBindEnabled);
}

function getAttributeProfile(entity) {
    return entity.getData("fiskheroes:beam_charging") || entity.getData("fiskheroes:beam_shooting") ? "SCREAM" : null;

}

function screamProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("BASE_SPEED", -0.5, 0);
}

function isKeyBindEnabled(entity, keyBind) {
    return keyBind != "CHARGED_BEAM" || !entity.getData("fiskheroes:gliding");
}