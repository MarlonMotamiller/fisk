var utils = implement("unconventional:external/utils");
var gunUtils = utils.gunUtils();

function init(hero) {
    hero.setName("Taskmaster");
    hero.setTier(6);
    
    hero.setHelmet("item.superhero_armor.piece.helmet");
    hero.setChestplate("item.superhero_armor.piece.chestpiece");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.boots");
    hero.addPrimaryEquipment("fiskheroes:captain_americas_shield{Electromagnetic:1,display:{Name:\u00A7rTaskmaster's Shield}}", true);
    hero.addPrimaryEquipment("fisktag:weapon{WeaponType:unconventional:taskmastersword}", true, item => item.nbt().getString("WeaponType") == 'unconventional:taskmastersword');
    hero.addPrimaryEquipment("fisktag:weapon{WeaponType:unconventional:rhino}", true, item => item.nbt().getString("WeaponType") == 'unconventional:rhino');
    hero.addEquipment("fiskheroes:compound_bow");
    hero.addEquipment("fiskheroes:quiver");

    hero.addPowers("unconventional:taskmaster_armor");
	
    hero.addAttribute("PUNCH_DAMAGE", 5.5, 0);
    hero.addAttribute("WEAPON_DAMAGE", 4.5, 0);
    hero.addAttribute("JUMP_HEIGHT", 1.5, 0);
    hero.addAttribute("FALL_RESISTANCE", 8.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.25, 1);
    hero.addAttribute("BOW_DRAWBACK", 0.55, 1);
	
	
	gunUtils.addKeyBind(hero);
    hero.addKeyBind("QUIVER_CYCLE", "key.quiverCycle", 1);
    hero.addKeyBind("HORIZONTAL_BOW", "key.horizontalBow", 2);
    hero.addKeyBind("SHIELD_THROW", "key.shieldThrow", 1);
    hero.addKeyBindFunc("WEAPON", weaponKey, "Cycle Weapons", 1);
    
    hero.setHasPermission(hasPermission);
    hero.supplyFunction("canAim", entity => gunUtils.canAim(entity));

    hero.setKeyBindEnabled(isKeyBindEnabled);
	
	hero.setAttributeProfile(getProfile);
    hero.addAttributeProfile("CLAWS", profile => {
		profile.inheritDefaults();
		profile.addAttribute("PUNCH_DAMAGE", 6.5, 0);
	});
    hero.addAttributeProfile("BLADES", profile => {
		profile.inheritDefaults();
		profile.addAttribute("PUNCH_DAMAGE", 7.5, 0);
	});
    hero.setDamageProfile(getProfile);
    hero.addDamageProfile("CLAWS", {
        "types": {
            "SHARP": 1.0
        },
        "properties": {
            "HIT_COOLDOWN": 14
        }
    });

    hero.addDamageProfile("BLADES", {
        "types": {
            "SHARP": 1.0
        },
        "properties": {
            "HIT_COOLDOWN": 24
        }
    });

    hero.setHasProperty((entity, property) => property == "MASK_TOGGLE");
    hero.addSoundEvent("MASK_OPEN", "fiskheroes:cowl_mask_open");
    hero.addSoundEvent("MASK_CLOSE", "fiskheroes:cowl_mask_close");

    hero.setTickHandler((entity, manager) => {
		if (!entity.getHeldItem().isEmpty()) {
			manager.setData(entity, 'unconventional:dyn/weapon', 0);
			manager.setData(entity, 'unconventional:dyn/weapon1', false);
			manager.setData(entity, 'unconventional:dyn/weapon2', false);
		}
		manager.setData(entity, 'fiskheroes:blade', entity.getData('unconventional:dyn/weapon2') || entity.getData('unconventional:dyn/weapon1'))
		manager.incrementData(entity, 'unconventional:dyn/weapon2_timer', 5, entity.getData('unconventional:dyn/weapon2'));
    });
}

function getProfile(entity) {
    return entity.getData("unconventional:dyn/weapon1") ? "CLAWS" : entity.getData("unconventional:dyn/weapon2") ? "BLADES" : null;
}

function weaponKey(player, manager) {
	var weapon = player.getData("unconventional:dyn/weapon");
	manager.setData(player, 'unconventional:dyn/weapon', player.isSneaking() ? (weapon == 0 ? 2 : weapon-1) : (weapon == 2 ? 0 : weapon+1));
	manager.setData(player, 'unconventional:dyn/weapon1', false);
	manager.setData(player, 'unconventional:dyn/weapon2', false);
	manager.setData(player, 'fiskheroes:blade', false);

	if (weapon > 0 && weapon < 3) {
		manager.setData(player, 'unconventional:dyn/weapon'+weapon, true);
	}
    return true;
}

function isKeyBindEnabled(entity, keyBind) {
    switch (keyBind) {
    case "WEAPON":
        return entity.getHeldItem().isEmpty();
    case "SHIELD_THROW":
        return entity.getHeldItem().name() == "fiskheroes:captain_americas_shield";
    case "QUIVER_CYCLE":
        return entity.getHeldItem().name() === "fiskheroes:compound_bow" && entity.getData("fiskheroes:equipped_quiver") != null;
    case "HORIZONTAL_BOW":
        return entity.getHeldItem().name() == "fiskheroes:compound_bow";
    default:
        return gunUtils.isKeyBindEnabled(entity, keyBind);
    }
}

function hasPermission(entity, permission) {
	var nbt = entity.getWornChestplate().nbt();	
    return gunUtils.hasPermission(entity, permission) || permission == "USE_SHIELD" || (permission == "MELEE_TASKMASTER_SWORD" == (nbt.getTagList("Equipment").getCompoundTag(0).getCompoundTag("Item").getShort("id") == PackLoader.getNumericalItemId('fiskheroes:captain_americas_shield')));
}