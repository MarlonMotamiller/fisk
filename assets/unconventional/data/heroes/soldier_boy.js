var utils = implement("unconventional:external/utils");
var gunUtils = utils.gunUtils();

function init(hero) {
    hero.setName("Soldier Boy");
    hero.setVersion("The Boys");
    hero.setTier(8);
   
    hero.setHelmet("item.superhero_armor.piece.helmet");   
    hero.setChestplate("item.superhero_armor.piece.chestpiece");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.boots");
    hero.addPrimaryEquipment("fisktag:weapon{WeaponType:unconventional:soldier_boy_shield}", true, item => item.nbt().getString("WeaponType") == 'unconventional:soldier_boy_shield');
	hero.addPrimaryEquipment("fisktag:weapon{WeaponType:unconventional:m1911}", true, item => item.nbt().getString("WeaponType") == 'unconventional:m1911');

    hero.addPowers("unconventional:compound_v_soldier_boy");
	
    hero.addAttribute("PUNCH_DAMAGE", 9.5, 0);
    hero.addAttribute("WEAPON_DAMAGE", 4.5, 0);
    hero.addAttribute("JUMP_HEIGHT", 1.5, 0);
    hero.addAttribute("FALL_RESISTANCE", 8.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.35, 1);

	gunUtils.addKeyBind(hero);
    hero.addKeyBind("CHARGED_BEAM", "Charged Beam", 2);
   
    hero.addAttributeProfile("BEAM", profile => {
		profile.inheritDefaults();
		profile.addAttribute("BASE_SPEED", -0.08, 0);
	});
    hero.setAttributeProfile(entity => entity.getData("fiskheroes:beam_charging") || entity.getData("fiskheroes:beam_shooting") ? "BEAM" : null);
	
    hero.setHasPermission((entity, permission) => gunUtils.hasPermission(entity, permission) || permission == "USE_SOLDIER_BOY_SHIELD");
    hero.supplyFunction("canAim", entity => gunUtils.canAim(entity));

    hero.setKeyBindEnabled(isKeyBindEnabled);

    hero.setTickHandler((entity, manager) => {
        manager.incrementData(entity, "unconventional:dyn/shield_timer", 0, (entity.getHeldItem().name() == "fisktag:weapon" && entity.getHeldItem().isWeapon()) && entity.as("PLAYER").isUsingItem());

    });
}

function isKeyBindEnabled(entity, keyBind) {
    switch (keyBind) {
    case "CHARGED_BEAM":
        return !entity.getData("fiskheroes:aiming") && !(entity.getHeldItem().name() == "fisktag:weapon" && !entity.getHeldItem().isWeapon()) && !entity.as("PLAYER").isUsingItem();
    default:
        return gunUtils.isKeyBindEnabled(entity, keyBind);
    }
}