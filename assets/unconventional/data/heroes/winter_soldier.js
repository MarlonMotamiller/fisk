var utils = implement("unconventional:external/utils");
var gunUtils = utils.gunUtils();
function init(hero) {
    hero.setName("Winter Soldier");
    hero.setTier(6);
    
    hero.setHelmet("item.superhero_armor.piece.mask");
    hero.setChestplate("item.superhero_armor.piece.chestpiece");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.boots");

    hero.addPowers("unconventional:winter_soldier_program", "unconventional:titanium_arm");
	hero.addPrimaryEquipment("fisktag:weapon{WeaponType:unconventional:m4a1}", true, item => item.nbt().getString("WeaponType") == 'unconventional:m4a1');
	hero.addPrimaryEquipment("fisktag:weapon{WeaponType:unconventional:scorpion_vz}", true, item => item.nbt().getString("WeaponType") == 'unconventional:scorpion_vz');
	hero.addPrimaryEquipment("fisktag:weapon{WeaponType:unconventional:p220st}", true, item => item.nbt().getString("WeaponType") == 'unconventional:p220st');
	hero.addPrimaryEquipment("fisktag:weapon{WeaponType:unconventional:cop_357_derringer}", true, item => item.nbt().getString("WeaponType") == 'unconventional:cop_357_derringer');
	hero.addPrimaryEquipment("fisktag:weapon{WeaponType:unconventional:gerber_mk_ii}", true, item => item.nbt().getString("WeaponType") == 'unconventional:gerber_mk_ii');
	
    hero.addAttribute("PUNCH_DAMAGE", 7.0, 0);
    hero.addAttribute("WEAPON_DAMAGE", 4.0, 0);
    hero.addAttribute("JUMP_HEIGHT", 1.5, 0);
    hero.addAttribute("FALL_RESISTANCE", 6.5, 0);
    hero.addAttribute("SPRINT_SPEED", 0.35, 1);
   
	gunUtils.addKeyBind(hero);
    hero.addKeyBindFunc("SWITCH_MODE", switchMode,"Switch Mode", 1);
    hero.addKeyBind("SHIELD_THROW", "key.shieldThrow", 1);
    hero.addKeyBind("UTILITY_BELT", "Toggle Smoke Bombs", 1);
    hero.addKeyBind("SHIELD", "Block", 2);

	hero.setHasPermission((entity, permission) => gunUtils.hasPermission(entity, permission) || permission == "USE_SHIELD");
    hero.supplyFunction("canAim", entity => gunUtils.canAim(entity));
	
    hero.setKeyBindEnabled(isKeyBindEnabled);
	hero.setTickHandler((entity, manager) => {
		var nbt = entity.getWornChestplate().nbt();	
		if (nbt.getBoolean("SelectCooldown")) {
			manager.setBoolean(nbt, "SelectCooldown", false);
		}
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

function switchMode(player, manager) {
	var nbt = player.getWornChestplate().nbt();	
	var nbt_gun = player.getHeldItem().nbt();
	if (!nbt.getBoolean("SelectCooldown")) {
		if (nbt_gun.getString("WeaponType") == 'unconventional:m4a1') {
			manager.setShort(nbt, "Ammo_bullets", nbt_gun.getShort('Ammo'));
			
			manager.setString(nbt_gun, "WeaponType", 'unconventional:m4a1_grenade_launcher');
			manager.setShort(nbt_gun, "Ammo", nbt.getShort('Ammo_grenade'));
			manager.setBoolean(nbt, "SelectCooldown", true);
		}
		else if (nbt_gun.getString("WeaponType") == 'unconventional:m4a1_grenade_launcher' ) {
			manager.setShort(nbt, "Ammo_grenade", nbt_gun.getShort('Ammo'));
			
			manager.setString(nbt_gun, "WeaponType", 'unconventional:m4a1');
			manager.setShort(nbt_gun, "Ammo", nbt.getShort('Ammo_bullets'));
			manager.setBoolean(nbt, "SelectCooldown", true);
		}
	}
    return true;
}

function isKeyBindEnabled(entity, keyBind) {
	var nbt = entity.getWornChestplate().nbt();	
	var fisktag_gun = entity.getHeldItem().name() == "fisktag:weapon";
	var weaponType = entity.getHeldItem().nbt().getString("WeaponType")
	var m4a1 = weaponType == 'unconventional:m4a1';
	var m4a1_grenade = weaponType == 'unconventional:m4a1_grenade_launcher';
    switch (keyBind) {
	case "NOAIM":
        return entity.getData('fiskheroes:reload_timer') > 0 && utils.isHoldingGun(entity);
    case "GUN_RELOAD":
        return utils.isHoldingGun(entity) && !entity.getData("fiskheroes:aiming") && !(entity.isSneaking() && fisktag_gun && (m4a1 || m4a1_grenade));
    case "SWITCH_MODE":
        return !nbt.getBoolean("SelectCooldown") && !entity.getData("fiskheroes:aiming") && (entity.isSneaking() && fisktag_gun && (m4a1 || m4a1_grenade));
	case "SHIELD_THROW":
        return entity.getHeldItem().name() == "fiskheroes:captain_americas_shield";
    case "UTILITY_BELT":
	case "SHIELD":
        return entity.getHeldItem().isEmpty();
    default:
        return true;
    }
}