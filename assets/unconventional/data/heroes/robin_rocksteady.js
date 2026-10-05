var vaulting = implement("unconventional:external/vaulting");
var detective_mode = implement("unconventional:external/detective_mode");
var detectiveModeRange = 20; // RANGE IN BLOCKS

function init(hero) {
    hero.setName("Robin/Arkham Knight");
    hero.setVersion("Rocksteady");
    hero.setTier(6);
    
    hero.setHelmet("item.superhero_armor.piece.mask");
    hero.setChestplate("item.superhero_armor.piece.chestpiece");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.boots");
    hero.addPrimaryEquipment("fisktag:weapon{WeaponType:unconventional:robin_rocksteady_bostaff}", true, item => item.nbt().getString("WeaponType") == 'unconventional:robin_rocksteady_bostaff');
    hero.addPrimaryEquipment("fiskheroes:grappling_gun", true);
    hero.addPrimaryEquipment("fisktag:weapon{WeaponType:unconventional:explosive_gel}", true, item => item.nbt().getString("WeaponType") == 'unconventional:explosive_gel');
    
    hero.addPowers("unconventional:robin_armor_ak");
	
    hero.addAttribute("PUNCH_DAMAGE", 6.0, 0);
    hero.addAttribute("WEAPON_DAMAGE", 4.5, 0);
    hero.addAttribute("JUMP_HEIGHT", 1.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 6.5, 0);
    hero.addAttribute("SPRINT_SPEED", 0.3, 1);

    hero.addKeyBind("AIM", "key.aim", -1);
    hero.addKeyBind("GUN_RELOAD", "key.reload", 1);
    hero.addKeyBind("UTILITY_BELT", "Toggle Utility Belt", 1);

	detective_mode.keys(hero, true, false);
	
	hero.setModifierEnabled((entity, modifier) => vaulting.isModifierEnabled(entity, modifier));
	hero.setKeyBindEnabled(isKeyBindEnabled);

    hero.setHasPermission((entity, permission) => permission == "USE_EXPLOSIVE_GEL" || permission == "USE_GRAPPLING_GUN" || permission == "MELEE_BOSTAFF_SHIELD" ==!entity.getData("fiskheroes:gliding"));
    hero.supplyFunction("canAim", entity => entity.getHeldItem().name() == "fisktag:weapon" && entity.getHeldItem().nbt().getString("WeaponType").startsWith('unconventional:explosive_gel'));

	vaulting.profiles(hero)
    hero.setAttributeProfile(entity => vaulting.getAttributeProfile(entity));

    hero.setHasProperty((entity, property) => property == "MASK_TOGGLE");
    hero.addSoundEvent("MASK_OPEN", "fiskheroes:cowl_mask_open");
    hero.addSoundEvent("MASK_CLOSE", "fiskheroes:cowl_mask_close");

    hero.setTickHandler((entity, manager) => {
        var bostaff = entity.getHeldItem().name() == "fisktag:weapon" && entity.getHeldItem().nbt().getString("WeaponType") == 'unconventional:robin_rocksteady_bostaff';
        manager.incrementData(entity, "unconventional:dyn/bostaff_timer", 10, 14, bostaff);
        manager.incrementData(entity, "unconventional:dyn/shield_timer", 6, (entity.getHeldItem().name() == "fisktag:weapon" && entity.getHeldItem().isWeapon()) && entity.as("PLAYER").isUsingItem());

		vaulting.sliding(entity, manager, 15, 7);
        vaulting.grappling(entity, manager);
		vaulting.gliding(entity, manager);
		detective_mode.tick(entity, manager, detectiveModeRange);
    });
}

function isKeyBindEnabled(entity, keyBind) {
    switch (keyBind) {
    case "DISPLAY":
        return entity.getData("unconventional:dyn/goggle") && entity.getHeldItem().name() != 'fiskheroes:suit_data_drive';
    case "GUN_RELOAD":
        return ((entity.getHeldItem().name() == "fisktag:weapon" && entity.getHeldItem().nbt().getString("WeaponType").startsWith('unconventional:explosive_gel') && !entity.getHeldItem().isWeapon()) )&& !entity.getData("fiskheroes:aiming");
    case "UTILITY_BELT":
        return !entity.getHeldItem().nbt().getString("WeaponType").startsWith('unconventional:explosive_gel');
    case "func_CYCLE_TARGET":
        return entity.getData("unconventional:dyn/goggle");
    default:
        return true;
    }
}