var utils = implement("unconventional:external/utils");
var gunUtils = utils.gunUtils();
var vaulting = implement("unconventional:external/vaulting");
var detective_mode = implement("unconventional:external/detective_mode");
var detectiveModeRange = 20; // RANGE IN BLOCKS

function init(hero) {
    hero.setName("Arkham Knight");
    hero.setVersion("Rocksteady");
    hero.setTier(7);
    
    hero.setHelmet("item.superhero_armor.piece.helmet");
    hero.setChestplate("item.superhero_armor.piece.chestpiece");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.boots");
    hero.addPrimaryEquipment("fiskheroes:grappling_gun", true);
    hero.addPrimaryEquipment("fisktag:weapon{WeaponType:unconventional:arkham_knight_pistols}", true, item => item.nbt().getString("WeaponType") == 'unconventional:arkham_knight_pistols');
    hero.addPrimaryEquipment("fisktag:weapon{WeaponType:unconventional:arkham_knight_pistols_sniper}", false, item => item.nbt().getString("WeaponType")== 'unconventional:arkham_knight_pistols_sniper');
    
    hero.addPowers("unconventional:arkham_knight_suit", "unconventional:acrobatics");
	
    hero.addAttribute("PUNCH_DAMAGE", 6.0, 0);
    hero.addAttribute("WEAPON_DAMAGE", 3.0, 0);
    hero.addAttribute("JUMP_HEIGHT", 1.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 8.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.30, 1);

	gunUtils.addKeyBind(hero);
    hero.addKeyBind("UTILITY_BELT", "Toggle Utility Belt", 1);
	
    hero.addKeyBindFunc("SWITCH", (player, manager)=> {
		if (player.getData("unconventional:dyn/switch_cooldown") == 1) {
			manager.setData(player, "fiskheroes:blade", true)
			manager.setData(player, "unconventional:dyn/switch", true)
			manager.setData(player, "unconventional:dyn/switch_cooldown", 0)
		}
		return true;
	}, "Combine", 1);

    hero.addKeyBindFunc("REVERSE_ACROBATICS", revFlips, "Reverse Acrobatics", 4);
	
	
	detective_mode.keys(hero, true, false);

	hero.setModifierEnabled(isModifierEnabled);
    hero.setKeyBindEnabled(isKeyBindEnabled);

	hero.setHasProperty((entity, property) => property == "MASK_TOGGLE" == !entity.getData("unconventional:dyn/goggle"));
    hero.setHasPermission((entity, permission) => gunUtils.hasPermission(entity, permission) || permission == "USE_GRAPPLING_GUN");
    hero.supplyFunction("canAim", entity => gunUtils.canAim(entity));

	vaulting.profiles(hero)
    hero.setAttributeProfile(getAttributeProfile);

    hero.setTickHandler((entity, manager) => {
		var nbt = entity.getHeldItem().nbt();
		var weapontype = nbt.getString("WeaponType");
		var switch_timer = entity.getData("unconventional:dyn/switch_timer");
		var x = weapontype == "unconventional:arkham_knight_pistols" ? 35 : 20;
		manager.incrementData(entity, "unconventional:dyn/switch_timer", x, entity.getData("unconventional:dyn/switch"));
		manager.incrementData(entity, "unconventional:dyn/switch_cooldown", 1, true);
		manager.setData(entity, "fiskheroes:dyn/nanites", false);
		//STOLENFROMSABRI
		if (entity.getData("unconventional:dyn/switch_timer") == 1) {
            var weapon = weapontype == "unconventional:arkham_knight_pistols" ? "unconventional:arkham_knight_pistols_sniper" : "unconventional:arkham_knight_pistols";
            manager.setString(nbt, "WeaponType", weapon);
            manager.setDataWithNotify(entity, "unconventional:dyn/switch", false);
		}
		if (weapontype == "unconventional:arkham_knight_pistols") {
			if (entity.getData("unconventional:dyn/switch")) {
				if (switch_timer >= 0.3 && switch_timer<0.32) {
					entity.playSound("unconventional:arkham.knight.gun.combine.0", 1.0, (0.95 + Math.random() * 0.05));
				}
				else if (switch_timer >= 0.8 && switch_timer<0.82) {
					entity.playSound("unconventional:arkham.knight.gun.combine.1", 1.0, (0.95 + Math.random() * 0.05));
				}	
			}
			else if (switch_timer >= 0.45 && switch_timer<0.48 && !entity.getData("unconventional:dyn/switch")) {
				entity.playSound("unconventional:arkham.knight.gun.decombine.1", 1.0, (0.95 + Math.random() * 0.05));
			}	
		}
		else if (weapontype == "unconventional:arkham_knight_pistols_sniper") {
			if (switch_timer >= 0.75 && switch_timer<0.8 && entity.getData("unconventional:dyn/switch")) {
				entity.playSound("unconventional:arkham.knight.gun.decombine.0", 1.0, (0.95 + Math.random() * 0.05));
			}	
		}
		
		//FLIPS
		var tricks = [
			{ id: [1, 2]},
			{ id: [1, 2]},
			{ id: [3, 4]},
			{ id: [1, 2]},
			{ id: [5, 6]}
		];
		vaulting.flips(entity, manager, tricks)
		vaulting.sliding(entity, manager, 15, 7);
        vaulting.grappling(entity, manager);
		detective_mode.tick(entity, manager, detectiveModeRange);
    });
}

function revFlips(player, manager) {
	manager.setData(player, "unconventional:dyn/trick_reverse_toggle", true);

	return true
}

function getAttributeProfile(entity) {
    return vaulting.getAttributeProfile(entity);
}

function isModifierEnabled(entity, modifier) {
    var acrobatics_boost = entity.getData('unconventional:dyn/trick_count') == 2 ? 1 : 0; 
	var acrobatics_reverse = entity.getData('unconventional:dyn/trick_reverse_toggle');
	switch (modifier.name()) {
	case "fiskheroes:equipment":
        return !utils.isHoldingGun(entity);
	case "fiskheroes:leaping":
		if (acrobatics_reverse) {
			return modifier.id() == "acrobatics_reverse_leap_" + Math.round(Math.min(Math.max(-entity.rotPitch() / (-90 / 5), 1), 5)) + "_" + acrobatics_boost;
		}
		else {
			return modifier.id() == "acrobatics_leap_" + Math.round(Math.min(Math.max(-entity.rotPitch() / (90 / 5), 1), 5)) + "_" + acrobatics_boost;
		}
    default:
        return vaulting.isModifierEnabled(entity, modifier);
    }
}

function isKeyBindEnabled(entity, keyBind) {
	var item = entity.getEquipmentInSlot(3);
    var nbt = item.nbt();
	var nbt_gun = entity.getHeldItem().nbt();
	var suit_data_drive_hacking = nbt.getBoolean('suit_data_drive_hacking');
	var sneaking = entity.isSneaking();
	var gun = utils.isHoldingGun(entity);
    switch (keyBind) {
	case "func_DETECTIVE_MODE":
        return entity.getData("fiskheroes:mask_open") == false;
    case "DISPLAY":
        return entity.getData("unconventional:dyn/goggle");
    case "func_CYCLE_TARGET":
        return entity.getData("unconventional:dyn/goggle");
	case "NOAIM":
        return entity.getData('fiskheroes:reload_timer') > 0 && gun;
    case "GUN_RELOAD":
        return gun && !entity.getData("fiskheroes:aiming") && !(entity.isSneaking() && entity.getHeldItem().name() == "fisktag:weapon" && (nbt_gun.getString('WeaponType') == "unconventional:arkham_knight_pistols" || nbt_gun.getString('WeaponType') == "unconventional:arkham_knight_pistols_sniper"));
    case "SWITCH":
        return entity.getData('fiskheroes:reload_timer') == 0 && !entity.getData("fiskheroes:aiming") && (entity.isSneaking() && entity.getHeldItem().name() == "fisktag:weapon" && (nbt_gun.getString('WeaponType') == "unconventional:arkham_knight_pistols" || nbt_gun.getString('WeaponType') == "unconventional:arkham_knight_pistols_sniper"));
	case "UTILITY_BELT":
        return !gun;
    default:
        return true;
    }
}