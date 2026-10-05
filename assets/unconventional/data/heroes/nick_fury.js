var utils = implement("unconventional:external/utils");
var gunUtils = utils.gunUtils();

function init(hero) {
    hero.setName("Nick Fury");
    hero.setTier(3);
   
    hero.setHelmet("Eyepatch");   
    hero.setChestplate("item.superhero_armor.piece.jacket");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.boots");
	hero.addPrimaryEquipment("fisktag:weapon{WeaponType:unconventional:sw_mp9}", true, item => item.nbt().getString("WeaponType") == 'unconventional:sw_mp9');
	
    hero.addPowers("unconventional:shield_uniform");
	
    hero.addAttribute("PUNCH_DAMAGE", 5.0, 0);
    hero.addAttribute("WEAPON_DAMAGE", 3.0, 0);
    hero.addAttribute("JUMP_HEIGHT", 0.5, 0);
    hero.addAttribute("FALL_RESISTANCE", 4.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.1, 1);

	gunUtils.addKeyBind(hero);
    
    hero.setHasPermission((entity, permission) => gunUtils.hasPermission(entity, permission));
    hero.supplyFunction("canAim", entity => gunUtils.canAim(entity));
    hero.setKeyBindEnabled((entity, keyBind) => gunUtils.isKeyBindEnabled(entity, keyBind));
}
