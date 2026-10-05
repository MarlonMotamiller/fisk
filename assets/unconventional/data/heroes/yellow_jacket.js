function init(hero) {
    hero.setName("Yellow Jacket");
    hero.setTier(6);

    hero.setHelmet("item.superhero_armor.piece.helmet");
    hero.setChestplate("item.superhero_armor.piece.chestpiece");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.boots");

    hero.addPowers("unconventional:yellow_jacket_suit");
    hero.addAttribute("PUNCH_DAMAGE", 5.5, 0);
    hero.addAttribute("JUMP_HEIGHT", 0.5, 0);
    hero.addAttribute("FALL_RESISTANCE", 7.0, 0);

    hero.addKeyBind("SIZE_MANIPULATION", "key.sizeManipulation", 1);
    hero.addKeyBind("CHARGED_BEAM", "Charge Stingers", 2);
	hero.addKeyBind("MINIATURIZE_SUIT", "key.miniaturizeSuit", 3);
    hero.addKeyBind("BACKPACK", "Toggle Stingers", 5);

    hero.setModifierEnabled(isModifierEnabled);
	hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.setHasProperty((entity, property) => property == "BREATHE_SPACE");

    hero.setTickHandler((entity, manager) => {
		var nbt = entity.getWornChestplate().nbt()
        manager.incrementData(entity, "fiskheroes:dyn/booster_timer", 2, entity.getData("fiskheroes:flying"));
        manager.incrementData(entity, "fiskheroes:dyn/shrink_timer", 2, entity.getData("fiskheroes:scale")<0.5 && entity.getData('fiskheroes:flying'));
		
		if (entity.getData('fiskheroes:flying') || entity.getData('fiskheroes:aiming')) {
			manager.setData(entity, "fiskheroes:dyn/nanites", true)
		}
		
		if (entity.getData("fiskheroes:dyn/shrink_timer") == 1) {
			manager.setData(entity, "fiskheroes:dyn/flight_super_boost", 2);
			manager.setData(entity, "fiskheroes:flying", true);
			manager.setData(entity, "fiskheroes:flight_timer", entity.getData("fiskheroes:prev_flight_timer"));
			manager.setData(entity, "fiskheroes:flight_boost_timer", entity.getData("fiskheroes:prev_flight_boost_timer"));
		}
		else if (!(entity.isSprinting() && entity.getData("fiskheroes:flying")) && entity.getData("fiskheroes:dyn/flight_super_boost") > 0 ||entity.getData("fiskheroes:scale")>0.1) {
			manager.setData(entity, "fiskheroes:dyn/flight_super_boost", 0);
		}
		
		if (entity.as("DISPLAY").getDisplayType() != "HOLOGRAM") {
			if (entity.getData('fiskheroes:dyn/nanite_timer')==1 && entity.isSneaking()) {
				manager.setBoolean(nbt, "STINGERS", true);
			}
			else {
				manager.setBoolean(nbt, "STINGERS", false);
			}
		}
    });
}

function isModifierEnabled(entity, modifier) {	
	if (modifier.name() == "fiskheroes:controlled_flight") {
        var shrink = entity.getData("fiskheroes:dyn/flight_super_boost");
        return shrink != 1 && (modifier.id() == "flight_small") == (shrink > 0);
    }
	switch (modifier.name()) {
	case "fiskheroes:repulsor_blast":
		return entity.getData("fiskheroes:dyn/nanite_timer") == 1 && modifier.id() == 'repulsor_blast_small' == entity.getData("fiskheroes:scale")<0.1;
	case "fiskheroes:charged_beam":
		return entity.getData("fiskheroes:dyn/nanite_timer") == 1 && modifier.id() == 'charged_beam_small' == entity.getData("fiskheroes:scale")<0.1;
	default:
		return true;
	}
}

function isKeyBindEnabled(entity, keyBind) {
    switch (keyBind) {
    case "CHARGED_BEAM":
        return entity.getData("fiskheroes:flight_boost_timer") <1 && entity.getData("fiskheroes:dyn/nanite_timer") == 1;
    case "MINIATURIZE_SUIT":
        return entity.getData("fiskheroes:flight_boost_timer") <1;
	case "BACKPACK":
        return !entity.getData("fiskheroes:flying") && entity.getData("fiskheroes:flight_boost_timer") <1;
    default:
        return true;
    }
}
