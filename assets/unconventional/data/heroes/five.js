var utils = implement("unconventional:external/utils");
var gunUtils = utils.gunUtils();

function init(hero) {
    hero.setName("Five");
    hero.setVersion("The Umbrella Academy");
    hero.setTier(1);
    
    hero.setChestplate("item.superhero_armor.piece.jacket");
    hero.setLeggings("Shorts");
    hero.setBoots("item.superhero_armor.piece.shoes");
    hero.addPrimaryEquipment("fisktag:weapon{WeaponType:unconventional:fire_axe}", true, item => item.nbt().getString("WeaponType") == 'unconventional:fire_axe');
    
    hero.addPowers("unconventional:space_time_manipulation");
	
    hero.addAttribute("FALL_RESISTANCE", 4.0, 0);
    hero.addAttribute("JUMP_HEIGHT", 0.5, 0);
    hero.addAttribute("PUNCH_DAMAGE", 2.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.15, 1);
    hero.addAttribute("WEAPON_DAMAGE", 5.5, 0);

    gunUtils.addKeyBind(hero);
    hero.addKeyBind("SLOW_MOTION", "key.slowMotion", 4);
    hero.addKeyBindFunc("TELEPORT", teleport, "Teleport", 5);	
    
	hero.setHasPermission((entity, permission) => gunUtils.hasPermission(entity, permission));
    hero.supplyFunction("canAim", entity => gunUtils.canAim(entity));
	
    hero.setTierOverride(entity => 0);
	hero.setKeyBindEnabled((entity, keyBind) => gunUtils.isKeyBindEnabled(entity, keyBind));

    hero.setDefaultScale(0.85);

}

function teleport(player, manager) {
	manager.setData(player, 'fiskheroes:teleport_timer', 0);
	manager.setData(player, 'fiskheroes:teleport_delay', 10);
    return true;
}