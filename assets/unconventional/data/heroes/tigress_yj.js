function init(hero) {
    hero.setName("Tigress");
    hero.setVersion("Young Justice");
    hero.setTier(4);
    
    hero.setHelmet("item.superhero_armor.piece.mask");
    hero.setChestplate("item.superhero_armor.piece.chestpiece");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.boots");
    hero.addPrimaryEquipment("fiskheroes:chokuto", true, item => !item.nbt().getBoolean("Dual"));
    hero.addPrimaryEquipment("fisktag:weapon{WeaponType:unconventional:tigress_yj_crossbow}", true, item => item.nbt().getString("WeaponType") == 'unconventional:tigress_yj_crossbow');
    hero.addEquipment("fiskheroes:compound_bow");
    hero.addEquipment("fiskheroes:quiver");
    
    hero.addPowers("fiskheroes:archery");
	
    hero.addAttribute("PUNCH_DAMAGE", 5.0, 0);
    hero.addAttribute("WEAPON_DAMAGE", 3.5, 0);
    hero.addAttribute("JUMP_HEIGHT", 1.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 4.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.15, 1);
    hero.addAttribute("BOW_DRAWBACK", 0.55, 1);
    
    hero.addKeyBind("AIM", "key.aim", -1);
    hero.addKeyBind("GUN_RELOAD", "key.reload", 1);
    hero.addKeyBind("QUIVER_CYCLE", "key.quiverCycle", 1);
    hero.addKeyBind("HORIZONTAL_BOW", "key.horizontalBow", 2);
	
    hero.setHasPermission((entity, permission) => permission == "USE_CROSSBOW");
    hero.supplyFunction("canAim", entity => entity.getData('fiskheroes:reload_timer') == 0 && (entity.getHeldItem().name() == "fisktag:weapon" && entity.getHeldItem().nbt().getString('WeaponType') == 'unconventional:tigress_yj_crossbow'));
    
    hero.setKeyBindEnabled(isKeyBindEnabled);

    hero.setDefaultScale(0.9);
}

function isKeyBindEnabled(entity, keyBind) {
    var nbt_gun = entity.getHeldItem().nbt();
    switch (keyBind) {
    case "GUN_RELOAD":
        return ((entity.getHeldItem().name() == "fisktag:weapon" && (nbt_gun.getString('WeaponType') == 'unconventional:tigress_yj_crossbow')) ) && !entity.getData("fiskheroes:aiming");
    case "QUIVER_CYCLE":
        return entity.getHeldItem().name() === "fiskheroes:compound_bow" && entity.getData("fiskheroes:equipped_quiver") != null;
    case "HORIZONTAL_BOW":
        return entity.getHeldItem().name() == "fiskheroes:compound_bow";
    default:
        return true;
    }
}