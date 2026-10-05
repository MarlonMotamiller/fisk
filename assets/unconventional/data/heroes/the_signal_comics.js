function init(hero) {
    hero.setName("The Signal");
    hero.setVersion("Comics");
    hero.setTier(4);
    hero.hide();
    
    hero.setHelmet("item.superhero_armor.piece.helmet");
    hero.setChestplate("item.superhero_armor.piece.jacket");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.boots");
    
    hero.addPowers("unconventional:signal_umbrakinesis", "unconventional:escrima_sticks_signal", "unconventional:signal_suit");
	
    hero.addAttribute("PUNCH_DAMAGE", 5.5, 0);
    hero.addAttribute("WEAPON_DAMAGE", 2.5, 0);
    hero.addAttribute("JUMP_HEIGHT", 1.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 6.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.15, 1);
	
    hero.addKeyBind("BLADE", "Toggle Escrimas", 1);
    hero.addKeyBind("SHADOWFORM", "key.shadowForm", 1);
    hero.addKeyBind("UTILITY_BELT", "Toggle Utility Belt", 2);
    hero.addKeyBind("AIM", "key.shadowChain", 2);
    hero.addKeyBind("TELEKINESIS", "key.shadowChain", 2);
    hero.addKeyBind("SHADOWDOME", "key.shadowDome", 3);
    hero.addKeyBindFunc("Func_INVISIBLE", toggleInvisible, "key.invisibility", 4);

    hero.setModifierEnabled(isModifierEnabled);
    hero.setKeyBindEnabled(isKeyBindEnabled);

    hero.supplyFunction("canAim", canAim);

    hero.addAttributeProfile("ESCRIMA", escrimaProfile);
    hero.setAttributeProfile(getProfile);
    hero.setDamageProfile(getProfile);
    hero.addDamageProfile("ESCRIMA", {"types": {"SHARP": 1.0}});

    hero.setTickHandler((entity, manager) => {
        var invis_float = entity.getData("unconventional:dyn/invisible_float");
        var invis_float_test = entity.getData("unconventional:dyn/invisible_float_test");
        var invis_tick_rate = 0.05; // default:0.05
        var invis_transparent = 0.5; // default:0.8

        manager.setData(entity, "unconventional:dyn/invisible_opacity", false)

        if (entity.motion().length() > 0.08 || !entity.isOnGround()) {
            manager.setData(entity, "unconventional:dyn/invisible_opacity", true)
        }
        if (entity.getData("unconventional:dyn/invisible")) {
            if (!entity.getData("fiskheroes:invisible")) {
                if (invis_float < 1 && !entity.getData("unconventional:dyn/invisible_opacity")) {
                    manager.setData(entity, "unconventional:dyn/invisible_float", invis_float + invis_tick_rate)
                    manager.setData(entity, "unconventional:dyn/invisible_float_test", entity.getData("unconventional:dyn/invisible_float"))
                }

                if (invis_float >= 1) {
                    manager.setData(entity, "fiskheroes:invisible", true)
                }
            }

            if (entity.getData("unconventional:dyn/invisible_opacity")) {
                if (invis_float > invis_transparent && invis_float_test > invis_transparent) {
                    manager.setData(entity, "unconventional:dyn/invisible_float", invis_float - invis_tick_rate)
                }
                if (invis_float < invis_transparent && invis_float_test < invis_transparent) {
                    manager.setData(entity, "unconventional:dyn/invisible_float", invis_float + invis_tick_rate)
                }
                manager.setData(entity, "fiskheroes:invisible", false)
            }

        }
        
        if (!entity.getData("unconventional:dyn/invisible")) {
            if (invis_float_test != 0) {
                manager.setData(entity, "unconventional:dyn/invisible_float_test", 0)
            }
            if (invis_float > 0) {
                manager.setData(entity, "unconventional:dyn/invisible_float", invis_float - invis_tick_rate)
            }
            if (entity.getData("fiskheroes:invisible")) {
                manager.setData(entity, "fiskheroes:invisible", false)

            }

        }
    });
}

function toggleInvisible(player, manager) {
    manager.setData(player, "unconventional:dyn/invisible", !player.getData("unconventional:dyn/invisible"))

    return true;
    
}

function escrimaProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 10, 0);
}

function getProfile(entity) {
    return entity.getData("fiskheroes:blade") ? "ESCRIMA" : null;
}

function isModifierEnabled(entity, modifier) {
    switch (modifier.name()) {
    case "fiskheroes:flight":
        return entity.getData("fiskheroes:shadowform");
    case "fiskheroes:blade":
        return !entity.getData("fiskheroes:shadowform") && !entity.getData("fiskheroes:invisible") && !entity.getData("fiskheroes:telekinesis");
    case "fiskheroes:telekinesis":
        return entity.getHeldItem().isEmpty() && !entity.getData("fiskheroes:shadowform") && !entity.getData("fiskheroes:lightsout") && !entity.getData("fiskheroes:invisible");
    default:
        return true;
    }
}

function isKeyBindEnabled(entity, keyBind) {
    switch (keyBind) {
        case "SHADOWFORM":
            return entity.isSneaking() && !entity.getData("fiskheroes:telekinesis") || entity.getData("fiskheroes:shadowform");
        case "BLADE":
            return !entity.isSneaking() && !entity.getData("fiskheroes:telekinesis") && !entity.getData("fiskheroes:shadowform") && !entity.getData("fiskheroes:invisible");
        case "SHADOWDOME":
            return !entity.getData("fiskheroes:telekinesis") && !entity.getData("fiskheroes:invisible");
        case "TELEKINESIS":
            return !entity.isSneaking() && !entity.getData("fiskheroes:shadowform") && !entity.getData("fiskheroes:invisible");
        case "AIM":
            return !entity.isSneaking() && entity.getHeldItem().isEmpty() && entity.getData("fiskheroes:grab_id") > -1;
        case "UTILITY_BELT":
            return entity.isSneaking();
        case "Func_INVISIBLE":
            return !entity.getData("fiskheroes:telekinesis");
        default:
            return true;
    }
}

function canAim(entity) {
    return entity.getHeldItem().isEmpty() && entity.getData("fiskheroes:grab_id") > -1;
}