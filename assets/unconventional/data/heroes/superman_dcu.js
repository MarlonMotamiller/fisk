var sonic_boom = implement("unconventional:external/sonic_boom_with_cooldown");
var sonic_boom_init = implement("unconventional:external/sonic_boom_with_cooldown_init");

function init(hero) {
    hero.setName("Superman");
    hero.setVersion("Gunn")
    hero.setTier(8);
    
    hero.setChestplate("item.superhero_armor.piece.chestpiece");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.boots");

    hero.addPowers("unconventional:kryptonian_physiology_gunn");
    hero.addAttribute("PUNCH_DAMAGE", 11.0, 0);
    hero.addAttribute("WEAPON_DAMAGE", -2.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.1, 1);
    hero.addAttribute("BASE_SPEED_LEVELS", 1.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 10.0, 0);

    hero.addKeyBind("SUPER_SPEED", "key.superSpeed", 1);
    hero.addKeyBind("SLOW_MOTION", "key.slowMotion", 2);
    hero.addKeyBind("CHARGED_BEAM", "Freeze Breath", 4);
    hero.addKeyBind("HEAT_VISION", "key.heatVision", 5);

    hero.setModifierEnabled(isModifierEnabled);
    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.setHasProperty((entity, property) => property == "BREATHE_SPACE");

    sonic_boom = sonic_boom.create(220, 1, 0);
    sonic_boom_init.init(hero, sonic_boom, 1, 0.5);

}

function isModifierEnabled(entity, modifier) {
    switch (modifier.name()) {
        case "fiskheroes:super_speed":
            return !entity.getData("fiskheroes:flying") && entity.getData("unconventional:dyn/sonic_boom") == 0;
        default:
            return sonic_boom.isModifierEnabled(entity, modifier);
    }
}

function isKeyBindEnabled(entity, keyBind) {
    switch (keyBind) {
        case "SUPER_SPEED":
            return !entity.getData("fiskheroes:flying") && entity.getData("unconventional:dyn/sonic_boom") == 0;
        case "HEAT_VISION":
            return !entity.getData("fiskheroes:speeding");
        case "CHARGED_BEAM":
            return !entity.getData("fiskheroes:speeding");
        default:
            return sonic_boom.isKeyBindEnabled(entity, keyBind);
    }
}