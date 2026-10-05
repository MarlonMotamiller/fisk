function init(hero) {
    hero.setName("Red Guardian");
    hero.setTier(6);
   
    hero.setHelmet("item.superhero_armor.piece.helmet");   
    hero.setChestplate("item.superhero_armor.piece.chestpiece");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.boots");
    hero.addPrimaryEquipment("fiskheroes:captain_americas_shield{display:{Name:\u00A7rRed Guardian's Shield}}", true);

    hero.addPowers("unconventional:kgb_super_soldier_serum", "unconventional:shield_throwing");

    hero.addAttribute("PUNCH_DAMAGE", 8.0, 0);
    hero.addAttribute("WEAPON_DAMAGE", 3.0, 0);
    hero.addAttribute("JUMP_HEIGHT", 1.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 7.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.2, 1);
   
    hero.addKeyBind("SHIELD_THROW", "key.shieldThrow", 1);
    
    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.setHasPermission((entity, permission) => permission == "USE_SHIELD");
}

function isKeyBindEnabled(entity, keyBind) {
    return keyBind != "SHIELD_THROW" || entity.getHeldItem().name() == "fiskheroes:captain_americas_shield";
}
