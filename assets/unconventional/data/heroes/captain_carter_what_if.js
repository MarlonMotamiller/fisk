function init(hero) {
    hero.setName("Captain Carter");
    hero.setVersion("What If")
    hero.setAliases("cap_carter");
    hero.setTier(6);
    
    hero.setHelmet("item.superhero_armor.piece.hair");
    hero.setChestplate("item.superhero_armor.piece.chestpiece");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.boots");
    hero.addPrimaryEquipment("fiskheroes:captain_americas_shield{display:{Name:\"Captain Carter's Shield\"}}", true);
    
    hero.addPowers("fiskheroes:super_soldier_serum", "unconventional:shield_throwing");
    hero.addAttribute("PUNCH_DAMAGE", 7.0, 0);
    hero.addAttribute("WEAPON_DAMAGE", 4.5, 0);
    hero.addAttribute("JUMP_HEIGHT", 2.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 6.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.4, 1);
    
    hero.addKeyBind("SHIELD_THROW", "key.shieldThrow", 1);
    
    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.setHasPermission((entity, permission) => permission == "USE_SHIELD");

}

function isKeyBindEnabled(entity, keyBind) {
    return keyBind != "SHIELD_THROW" || entity.getHeldItem().name() == "fiskheroes:captain_americas_shield";
}