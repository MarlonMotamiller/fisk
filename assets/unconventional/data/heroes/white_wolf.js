var utils = implement("unconventional:external/utils");
var gunUtils = utils.gunUtils();
function init(hero) {
    hero.setName("Bucky Barnes");
    hero.setTier(6);
    
    hero.setChestplate("item.superhero_armor.piece.chestpiece");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.boots");

    hero.addPowers("unconventional:winter_soldier_program", "unconventional:vibranium_arm");
	hero.addPrimaryEquipment("fisktag:weapon{WeaponType:unconventional:m249_saw}", true, item => item.nbt().getString("WeaponType") == 'unconventional:m249_saw');
	hero.addPrimaryEquipment("fisktag:weapon{WeaponType:unconventional:p220st}", true, item => item.nbt().getString("WeaponType") == 'unconventional:p220st');
	hero.addPrimaryEquipment("fisktag:weapon{WeaponType:unconventional:gerber_mk_ii}", true, item => item.nbt().getString("WeaponType") == 'unconventional:gerber_mk_ii');
	
    hero.addAttribute("PUNCH_DAMAGE", 7.5, 0);
    hero.addAttribute("WEAPON_DAMAGE", 5.0, 0);
    hero.addAttribute("JUMP_HEIGHT", 2.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 7.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.4, 1);
   
	gunUtils.addKeyBind(hero);
    hero.addKeyBind("SHIELD_THROW", "key.shieldThrow", 1);
    hero.addKeyBind("SHIELD", "Block", 2);

    hero.setHasPermission((entity, permission) => gunUtils.hasPermission(entity, permission) || permission == "USE_SHIELD");
    hero.supplyFunction("canAim", entity => gunUtils.canAim(entity));

    hero.setKeyBindEnabled(isKeyBindEnabled);
	hero.setTickHandler((entity, manager) => {
		///BLOCKING_CONS
		var ticks_shield_dmgd = entity.getData('fiskheroes:ticks_since_shield_damaged');
		manager.incrementData(entity, "unconventional:dyn/shield_damaged_timer", 0, 5, entity.getHeldItem().isEmpty() && ticks_shield_dmgd > 0 && ticks_shield_dmgd < 3);
		if (entity.getData("unconventional:dyn/shield_damaged_timer") == 0) {
			manager.setData(entity, "unconventional:dyn/punch", Math.floor(Math.random()*4));
		}
		
		var shield_req = entity.getHeldItem().isEmpty() && ticks_shield_dmgd > 0 && ticks_shield_dmgd < 6
		for (var i = 0; i<3; i++) {
			manager.incrementData(entity, "unconventional:dyn/shield_"+(i+1)+"_timer", 3, 5, entity.getData("unconventional:dyn/punch") == i && shield_req);
		}
	});
}

function isKeyBindEnabled(entity, keyBind) {
    switch (keyBind) {
    case "SHIELD_THROW":
        return entity.getHeldItem().name() == "fiskheroes:captain_americas_shield";
	case "SHIELD":
        return entity.getHeldItem().isEmpty();
    default:
        return gunUtils.isKeyBindEnabled(entity, keyBind);
    }
}