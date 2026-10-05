function init(hero) {
    hero.setName("Black Canary/Earth-2");
    hero.setTier(4);
    
    hero.setHelmet("item.superhero_armor.piece.mask");
    hero.setChestplate("item.superhero_armor.piece.chestpiece");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.boots");
    hero.addPrimaryEquipment("fiskheroes:tactical_tonfa{Dual:1}", true, item => item.nbt().getBoolean("Dual"));
    hero.addPrimaryEquipment("fiskheroes:desert_eagle", true, item => !item.nbt().getBoolean("Dual"));
    
    hero.addPowers("fiskheroes:canary_cry");
    
    hero.addAttribute("PUNCH_DAMAGE", 4.5, 0);
    hero.addAttribute("WEAPON_DAMAGE", 3, 0);
    hero.addAttribute("JUMP_HEIGHT", 1, 0);
    hero.addAttribute("FALL_RESISTANCE", 4.5, 0);
    hero.addAttribute("SPRINT_SPEED", 0.15, 1);

    hero.addKeyBind("AIM", "key.aim", -1);
    hero.addKeyBind("GUN_RELOAD", "key.reload", 1);
    hero.addKeyBind("SONIC_WAVES", "key.canaryCry", 1);

    hero.setHasPermission((entity, permission) => permission == "USE_GUN" || permission == "USE_SHIELD");
    hero.supplyFunction("canAim", entity => entity.getHeldItem().isGun());

    hero.setKeyBindEnabled(isKeyBindEnabled);

}

function isKeyBindEnabled(entity, keyBind) {
    switch (keyBind) {
    case "GUN_RELOAD":
        return entity.getHeldItem().isGun() && !entity.getData("fiskheroes:aiming");
    case "SONIC_WAVES":
        return entity.getHeldItem().isEmpty();
    default:
        return true;
    }
}