var utils = implement("unconventional:external/utils");
var gunUtils = utils.gunUtils();
var vaulting = implement("unconventional:external/vaulting");
function init(hero) {
    hero.setName("hero.fiskheroes.deathstroke_dceu.name");
    hero.setVersion("Rocksteady");
    hero.setTier(6);

    hero.setHelmet("item.superhero_armor.piece.helmet");
    hero.setChestplate("item.superhero_armor.piece.chestpiece");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.boots");
    hero.addPrimaryEquipment("fiskheroes:chokuto", true, item => !item.nbt().getBoolean("Dual"));
    hero.addPrimaryEquipment("fiskheroes:chokuto", true, item => !item.nbt().getBoolean("Dual"));
    hero.addPrimaryEquipment("fiskheroes:desert_eagle", true, item => !item.nbt().getBoolean("Dual"));
    hero.addPrimaryEquipment("fisktag:weapon{WeaponType:unconventional:deathstroke_rocksteady_bostaff}", true, item => item.nbt().getString("WeaponType") == 'unconventional:deathstroke_rocksteady_bostaff');
    hero.addPrimaryEquipment("fiskheroes:grappling_gun", true);

    hero.addPowers("unconventional:deathstroke_rocksteady_armor", "unconventional:enhanced_physiology");
    hero.addAttribute("PUNCH_DAMAGE", 7.0, 0);
    hero.addAttribute("WEAPON_DAMAGE", 4.5, 0);
    hero.addAttribute("JUMP_HEIGHT", 1.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 5.5, 0);
    hero.addAttribute("SPRINT_SPEED", 0.2, 1);

	gunUtils.addKeyBind(hero);
    hero.addKeyBind("UTILITY_BELT", "key.grenades", 1);
    hero.addKeyBindFunc("func_CYCLE_WEAPON_FLASHBAND", cycleGrenadeKey, "Cycle Grenade | \u00A7b\u00A7lFlashbang", 4);
    hero.addKeyBindFunc("func_CYCLE_WEAPON_EXPLOSIVE", cycleGrenadeKey, "Cycle Grenade | \u00A74\u00A7lExplosive", 4);
    hero.addKeyBindFunc("func_CYCLE_WEAPON_SMOKE", cycleGrenadeKey, "Cycle Grenade | \u00A77\u00A7lSmoke", 4);
    hero.addKeyBindFunc("func_CYCLE_WEAPON_NEURAL", cycleGrenadeKey, "Cycle Grenade | \u00A7a\u00A7lNeural", 4);

    hero.setModifierEnabled(isModifierEnabled);
    hero.setKeyBindEnabled(isKeyBindEnabled);

	vaulting.profiles(hero)
    hero.setAttributeProfile(entity => vaulting.getAttributeProfile(entity));

    hero.setHasPermission((entity, permission) => gunUtils.hasPermission(entity, permission) || permission == "USE_GRAPPLING_GUN");
	hero.supplyFunction("canAim", entity => gunUtils.canAim(entity));
		
    hero.setTickHandler((entity, manager) => {		
        
        var bostaff = entity.getHeldItem().name() == "fisktag:weapon" && entity.getHeldItem().nbt().getString("WeaponType") == 'unconventional:deathstroke_rocksteady_bostaff';
        manager.incrementData(entity, "unconventional:dyn/bostaff_timer", 10, 14, bostaff);
        var nbt = entity.getWornChestplate().nbt();
        if (nbt.getBoolean("SelectCooldown")) {
            manager.setBoolean(nbt, "SelectCooldown", false);
        }

		vaulting.sliding(entity, manager, 15, 7);
        vaulting.grappling(entity, manager);

    });
}

function isModifierEnabled(entity, modifier) {
    var weapon = entity.getData('unconventional:dyn/grenade_switch');
    switch (modifier.name()) {
	case "fiskheroes:equipment":
        return modifier.id() == "explosive" == (weapon % 4 == 1) 
        && modifier.id() == "smoke" == (weapon % 4 == 2) 
        && modifier.id() == "neural" == (weapon % 4 == 3);
    default:
        return vaulting.isModifierEnabled(entity, modifier);
    }
}

function isKeyBindEnabled(entity, keyBind) {
    var weapon = entity.getData('unconventional:dyn/grenade_switch');
    switch (keyBind) {
    case "UTILITY_BELT":
        return !utils.isHoldingGun(entity);
    case "func_CYCLE_WEAPON_FLASHBAND":
        return entity.getData("fiskheroes:utility_belt_type") == 0 && weapon % 4 == 0 && !entity.getWornChestplate().nbt().getBoolean("SelectCooldown");
    case "func_CYCLE_WEAPON_EXPLOSIVE":
        return entity.getData("fiskheroes:utility_belt_type") == 0 && weapon % 4 == 1 && !entity.getWornChestplate().nbt().getBoolean("SelectCooldown");
    case "func_CYCLE_WEAPON_SMOKE":
        return entity.getData("fiskheroes:utility_belt_type") == 0 && weapon % 4 == 2 && !entity.getWornChestplate().nbt().getBoolean("SelectCooldown");
    case "func_CYCLE_WEAPON_NEURAL":
        return entity.getData("fiskheroes:utility_belt_type") == 0 && weapon % 4 == 3 && !entity.getWornChestplate().nbt().getBoolean("SelectCooldown");
    default:
        return gunUtils.isKeyBindEnabled(entity, keyBind);
    }
}

function cycleGrenadeKey(player, manager) {
    var weapon = player.getData("unconventional:dyn/grenade_switch");
    manager.setData(player, "unconventional:dyn/grenade_switch", (weapon + 1) % 4);
	var nbt = player.getWornChestplate().nbt();
    manager.setBoolean(nbt, "SelectCooldown", true);
    return true;
}