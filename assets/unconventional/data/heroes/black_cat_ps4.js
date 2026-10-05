function init(hero) {
    hero.setName("Black Cat");
    hero.setAliases("mommy?", "sorry", "mommy", "bcps4");
	hero.setVersion("PS4");
    hero.setTier(4);
    
    hero.setHelmet("item.superhero_armor.piece.mask");
    hero.setChestplate("item.superhero_armor.piece.chestpiece");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.boots");
	
	hero.addPowers("unconventional:grapple_ropes_ps4", "unconventional:retractable_claws", "unconventional:grenades");
    
    hero.addAttribute("FALL_RESISTANCE", 10.0, 0);
    hero.addAttribute("PUNCH_DAMAGE", 5.5, 0);
    hero.addAttribute("SPRINT_SPEED", 0.45, 1);
    hero.addAttribute("JUMP_HEIGHT", 2.5, 0);
    hero.addAttribute("STEP_HEIGHT", 0.5, 0);
    
    hero.addKeyBind("BLADE", "Toggle Claws", 1);
    hero.addKeyBind("WEB_ZIP", "Grapple Zip", 2);
    hero.addKeyBindFunc("func_WEB_SWINGING", webSwingingKey, "Toggle Grapple Ropes", 3);
    
    hero.addKeyBind("UTILITY_BELT", "key.grenades", 4);
    hero.addKeyBindFunc("func_CYCLE_WEAPON_FLASHBAND", cycleGrenadeKey, "Cycle Grenade | \u00A7b\u00A7lFlashbang", 5);
    hero.addKeyBindFunc("func_CYCLE_WEAPON_EMP", cycleGrenadeKey, "Cycle Grenade | \u00A75\u00A7lE.M.P.", 5);

    hero.addAttributeProfile("CLAWS", clawsProfile);
    hero.setAttributeProfile(getProfile);
    hero.setDamageProfile(getProfile);
    hero.addDamageProfile("CLAWS", {"types": {"SHARP": 1.0}});

    hero.setModifierEnabled(isModifierEnabled);
    hero.setKeyBindEnabled(isKeyBindEnabled);
	hero.setTickHandler((entity, manager) => {
        var nbt = entity.getWornChestplate().nbt();
        if (nbt.getBoolean("SelectCooldown")) {
            manager.setBoolean(nbt, "SelectCooldown", false);
        }
    });

}

function getProfile(entity) {
    return entity.getData("fiskheroes:blade") ? "CLAWS" : null;
}

function clawsProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 6.5, 0);
}

function webSwingingKey(player, manager) {
    var flag = player.getData("fiskheroes:web_swinging");
    
    if (!flag) {
        manager.setDataWithNotify(player, "fiskheroes:prev_utility_belt_type", player.getData("fiskheroes:utility_belt_type"));
        manager.setDataWithNotify(player, "fiskheroes:utility_belt_type", -1);
    }
    
    manager.setDataWithNotify(player, "fiskheroes:web_swinging", !flag);
    return true;
}

function isModifierEnabled(entity, modifier) {
    var weapon = entity.getData('unconventional:dyn/grenade_switch');;
    switch (modifier.name()) {
    case "fiskheroes:web_swinging":
        return !entity.isSneaking() && entity.getHeldItem().isEmpty() && entity.getData("fiskheroes:utility_belt_type") == -1;
    case "fiskheroes:leaping":
        return modifier.id() == "springboard" == (entity.getData("fiskheroes:ticks_since_swinging") < 5);
    case "fiskheroes:equipment":
        return modifier.id() == "emp" == (weapon % 2 == 1);
    default:
        return true;
    
    }
}

function isKeyBindEnabled(entity, keyBind) {
    var weapon = entity.getData('unconventional:dyn/grenade_switch');
    switch (keyBind) {
        case "func_WEB_SWINGING":
            return entity.getHeldItem().isEmpty();
        case "func_CYCLE_WEAPON_FLASHBAND":
            return entity.getData("fiskheroes:utility_belt_type") == 0 && weapon % 2 == 0 && !entity.getWornChestplate().nbt().getBoolean("SelectCooldown");
        case "func_CYCLE_WEAPON_EMP":
            return entity.getData("fiskheroes:utility_belt_type") == 0 && weapon % 2 == 1 && !entity.getWornChestplate().nbt().getBoolean("SelectCooldown");
    default:
        return true;
    }
}

function cycleGrenadeKey(player, manager) {
    var weapon = player.getData("unconventional:dyn/grenade_switch");
    manager.setData(player, "unconventional:dyn/grenade_switch", (weapon + 1) % 2);
	var nbt = player.getWornChestplate().nbt();
    manager.setBoolean(nbt, "SelectCooldown", true);
    return true;
}