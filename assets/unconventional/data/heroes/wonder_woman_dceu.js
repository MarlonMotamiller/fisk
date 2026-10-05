function init(hero) {
    hero.setName("Wonder Woman");
    hero.setVersion("DCEU");
    hero.setTier(8);
    
    hero.setHelmet("Tiara");
    hero.setChestplate("Chestplate");
    hero.setLeggings("Skirt");
    hero.setBoots("Boots");
    
    hero.addPrimaryEquipment("fiskheroes:captain_americas_shield{display:{Name:\u00A7rWonder Woman's Shield}}", true);
    hero.addPrimaryEquipment("fisktag:weapon{WeaponType:unconventional:wonder_woman_dceu_sword}", true, item => item.nbt().getString("WeaponType") == 'unconventional:wonder_woman_dceu_sword');

    hero.addPowers("unconventional:bracelets_of_submission", "unconventional:amazon_olympian_physiology", "unconventional:lasso_of_truth", "unconventional:shield_throwing");
	
    hero.addAttribute("BASE_SPEED_LEVELS", 1.0, 0);
    hero.addAttribute("BOW_DRAWBACK", 0.85, 1);
    hero.addAttribute("FALL_RESISTANCE", 1, 1);
    hero.addAttribute("JUMP_HEIGHT", 1.5, 0);
    hero.addAttribute("PUNCH_DAMAGE", 10.5, 0);
	hero.addAttribute("WEAPON_DAMAGE", 4.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.7, 1);
    hero.addAttribute("STEP_HEIGHT", 0.5, 0);

    hero.addKeyBind("CHARGED_BEAM", "Divine Wave Emission", 1);
	 hero.addKeyBind("SHIELD_THROW", "key.shieldThrow", 1);
    hero.addKeyBind("SHIELD", "Block", 2);
    hero.addKeyBind("SUPER_SPEED", "key.superSpeed", 3);
	hero.addKeyBind("SLOW_MOTION", "key.slowMotionHold", 4);
	hero.addKeyBindFunc("func_WEB_SWINGING", webSwingingKey, "Lasso of Hestia", 5);
    
    hero.setHasPermission(hasPermission);

	hero.setModifierEnabled(isModifierEnabled);
    hero.setKeyBindEnabled(isKeyBindEnabled);
	hero.setDamageProfile(getDamageProfile);
	hero.addDamageProfile("SWORD_MAGIC", {
        "types": {
            "SHARP": 1.0,
            "MAGIC": 1.0
        }
    });
	
	hero.addDamageProfile("LASSO_BURN", {
        "types": {
            "MAGIC": 1
        },
		"properties": {
		  "REDUCE_KNOCKBACK": 1,
		  "EFFECTS": [
			{
				"id": "fiskheroes:tutridium",
				"duration": 20,
				"amplifier": 0,
				"chance": 1
			}
		]
        }
    });
	
	hero.setTickHandler((entity, manager) => {
		var nbt = entity.getWornChestplate().nbt();	
		var nbt_item = entity.getHeldItem().nbt();	
		
		manager.incrementData(entity, "unconventional:dyn/weapon1_timer", 8, entity.getData("fiskheroes:web_swinging"));
		// /LEAP
		manager.incrementData(entity, "unconventional:dyn/leap_cooldown", 200, 150, entity.isSprinting() && !entity.isPunching() && entity.isOnGround() && !entity.getData('fiskheroes:flying'), !entity.isSprinting() || entity.isPunching() || entity.getData('fiskheroes:flying'))
		// manager.incrementData(entity, "unconventional:dyn/leap_timer", 7, entity.isSprinting() && entity.getData('fiskheroes:flying'))
		
		if (!entity.isSprinting()) {
			manager.setData(entity, "fiskheroes:flying", false);
		}
		
		// /CHARGED_BEAM
		manager.incrementData(entity, "unconventional:dyn/shield_timer", 2, 15, entity.getData('fiskheroes:beam_shooting_timer')>0);
		manager.incrementData(entity, "unconventional:dyn/shield_shock_timer", 10, entity.getData('fiskheroes:beam_charge')>0.0 && !entity.getData('fiskheroes:beam_charging'));
		
		// /BLOCKING_CONS
		manager.incrementData(entity, "unconventional:dyn/shield_damaged_timer", 0, 5, entity.getHeldItem().isEmpty() && entity.getData('fiskheroes:ticks_since_shield_damaged') > 0 && entity.getData('fiskheroes:ticks_since_shield_damaged') < 1.5);
		if (entity.getData("unconventional:dyn/shield_damaged_timer") == 0) {
			manager.setData(entity, "unconventional:dyn/punch", Math.floor(Math.random()*8));
		}
		
		var shield_req = entity.getHeldItem().isEmpty() && entity.getData('fiskheroes:ticks_since_shield_damaged') > 0 && entity.getData('fiskheroes:ticks_since_shield_damaged') < 3;
		for (var i = 0; i<7; i++) {
			manager.incrementData(entity, "unconventional:dyn/shield_"+(i+1)+"_timer", 3, 5, entity.getData("unconventional:dyn/punch") == i && shield_req);
		}
		
		///Lasso
		var lasso_entity = entity.world().getEntityById(entity.getData('fiskheroes:web_rope_id'));
		if (entity.world().getEntityById(entity.getData('fiskheroes:web_rope_id')).exists() && entity.isSneaking()) {
			var list = entity.world().getEntitiesInRangeOf(lasso_entity.pos().add(0, 0, 0), 1);
			list.forEach(other => {
				if (!entity.equals(other) && !lasso_entity.equals(other) && !lasso_entity.isOnGround() && other.isLivingEntity()) {
					other.hurtByAttacker(hero, "LASSO_BURN", "%s coudln't handle the truth", 1, entity);
				}
			});
		}

	});

}

function webSwingingKey(player, manager) {
    var flag = player.getData("fiskheroes:web_swinging");
    manager.setDataWithNotify(player, "fiskheroes:web_swinging", !flag);
    return true;
}


function isModifierEnabled(entity, modifier) {
	var nbt = entity.getWornChestplate().nbt();
    switch (modifier.name()) {
        case "fiskheroes:controlled_flight":
            return entity.isSprinting() || entity.getData('fiskheroes:flight_timer') > 0 || entity.getData('fiskheroes:flight_boost_timer') > 0;
		case "fiskheroes:web_swinging":
            return entity.getData("fiskheroes:web_swinging") ? entity.getHeldItem().isEmpty() : entity.getHeldItem().isEmpty() && entity.getData('fiskheroes:web_swinging_timer') == 0;
		case "fiskheroes:super_speed":
            return !entity.getData('fiskheroes:flying');
		case "fiskheroes:leaping":
            return modifier.id() == 'leap_'+Math.floor(10*entity.getData("unconventional:dyn/leap_cooldown")/4);
        default:
            return true;
    }
}

function isKeyBindEnabled(entity, keyBind) {
	if (entity.getData('fiskheroes:flying')) {
		return false;
	}
    switch (keyBind) {
	case "SUPER_SPEED":
        return !entity.getData('fiskheroes:flying');
	case "SHIELD_THROW":
        return entity.getHeldItem().name() == "fiskheroes:captain_americas_shield";
	case "SHIELD":
        return entity.getHeldItem().isEmpty();
	case "CHARGED_BEAM":
        return !entity.getHeldItem().isWeapon();
    default:
        return true;
    }
}

function getDamageProfile(entity) {
	var weaponType = entity.getHeldItem().nbt().getString('WeaponType')
    return weaponType == "unconventional:wonder_woman_dceu_sword" || weaponType == "unconventional:wonder_woman_dceu_athena_sword"  ? "SWORD_MAGIC" : null;
}

function hasPermission(entity, permission) {
	var nbt = entity.getWornChestplate().nbt();	
	var nbt_item = entity.getHeldItem().nbt();	
    return permission == "USE_SHIELD" || (permission == "MELEE_WONDERWOMAN_SWORD" == (nbt.getTagList("Equipment").getCompoundTag(0).getCompoundTag("Item").getShort("id") == PackLoader.getNumericalItemId("fiskheroes:captain_americas_shield")));
}