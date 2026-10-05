function init(hero) {
    hero.setName("Electro");
    hero.setAliases("sparkles", "sparklez");
    hero.setVersion("Webb");	
    hero.setTier(5);

    hero.setHelmet("Head");
    hero.setChestplate("Chestpiece");
    hero.setLeggings("Pants");
    hero.setBoots("Boots");
	hero.addPrimaryEquipment("fiskheroes:subatomic_battery", false);
    
    hero.addPowers("unconventional:electrostatic_generation");
	
    hero.addKeyBind("AIM", "Electricity Beam", 1);	
    hero.addKeyBind("ENERGY_PROJECTION", "Electricity Beam", 1);	
    hero.addKeyBind("TELEPORT", "key.teleport", 3);
	
    hero.addAttribute("FALL_RESISTANCE", 7.0, 0);
    hero.addAttribute("PUNCH_DAMAGE", 4.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.10, 1);
	
	hero.setModifierEnabled(isModifierEnabled);
    hero.setKeyBindEnabled(isKeyBindEnabled);
	
    hero.setHasProperty((entity, property) => property == "MASK_TOGGLE");

    hero.addDamageProfile("CLAWS", {"types": {"ELECTRICITY": 1.0, "BLUNT": 1.0}});

    hero.supplyFunction("canAim",entity => entity.getHeldItem().isEmpty());

    hero.setTickHandler((entity, manager) => {
		var energy_proj = entity.getData('fiskheroes:energy_projection')
		var shadowform = entity.getData('fiskheroes:shadowform')
		var tp_delay = entity.getData('fiskheroes:teleport_delay')
		var battery = entity.getWornChestplate().nbt().getTagList('Equipment').getCompoundTag(0).getCompoundTag("Item")
		
		if (energy_proj || shadowform || (tp_delay > 0)) {
			if (battery.getFloat("Damage") > 0) {
				manager.setFloat(battery, 'Damage', battery.getFloat("Damage") - 0.35);
			}
		}
        manager.setData(entity, "fiskheroes:shadowform", entity.getData("fiskheroes:flying") && entity.isSprinting());

    });
}

function isModifierEnabled(entity, modifier) {
	var battery_damage = entity.getWornChestplate().nbt().getTagList('Equipment').getCompoundTag(0).getCompoundTag("Item").getFloat('Damage');
	
    switch (modifier.name()) {
	case "fiskheroes:energy_projection":
        return (modifier.id() ==  ("energy_proj_") + Math.round(battery_damage/200) ) && entity.getHeldItem().isEmpty() && !entity.getData("fiskheroes:shadowform");
	case "fiskheroes:teleportation":
        return modifier.id() ==  ("tp_") + Math.round(battery_damage/200) ;
	case "fiskheroes:controlled_flight":
        return modifier.id() ==  ("flight_") + Math.round(battery_damage/200) ;
    default:
        return true;
    }
}

function isKeyBindEnabled(entity, keyBind) {
    switch (keyBind) {
	case "ENERGY_PROJECTION":
        return entity.getHeldItem().isEmpty() && !entity.getData("fiskheroes:shadowform") && entity.getData("fiskheroes:aiming_timer") >= 1;
    case "AIM":
        return entity.getHeldItem().isEmpty() && !entity.getData("fiskheroes:shadowform");
    default:
        return true;
    }
}