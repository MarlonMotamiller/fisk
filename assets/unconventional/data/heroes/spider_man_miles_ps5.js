var landing = implement("unconventional:external/superhero_landing");

function init(hero) {
    hero.setName("Spider-Man/Miles Morales");
    hero.setVersion("PS5");
    hero.setTier(7);

    hero.setHelmet("item.superhero_armor.piece.mask");
    hero.setChestplate("item.superhero_armor.piece.chestpiece");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.boots");

    hero.addPowers("unconventional:mutated_spider_physiology", "unconventional:web_shooters_miles_ps5");

    hero.addAttribute("FALL_RESISTANCE", 11.5, 0);
    hero.addAttribute("JUMP_HEIGHT", 1.5, 0);
    hero.addAttribute("PUNCH_DAMAGE", 7.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.45, 1);
    hero.addAttribute("STEP_HEIGHT", 0.5, 0);
    hero.addAttribute("IMPACT_DAMAGE", 0.4, 1);

    hero.addKeyBind("UTILITY_BELT", "key.webShooters", 1);
    hero.addKeyBind("CHARGED_BEAM", "Venom Burst", 1);
    hero.addKeyBind("WEB_ZIP", "key.webZip", 2);
    hero.addKeyBindFunc("func_WEB_SWINGING", (player, manager) => {
		var flag = player.getData("fiskheroes:web_swinging");
		if (!flag) {
			manager.setDataWithNotify(player, "fiskheroes:prev_utility_belt_type", player.getData("fiskheroes:utility_belt_type"));
			manager.setDataWithNotify(player, "fiskheroes:utility_belt_type", -1);
		}
		manager.setDataWithNotify(player, "fiskheroes:web_swinging", !flag);
		return true;
	}, "key.webSwinging", 3);
    hero.addKeyBind("SLOW_MOTION", "key.slowMotion", 4);
    hero.addKeyBind("INVIS", "Camouflage", 4);
    hero.addKeyBind("CHARGE_ENERGY", "Venom", 5);

    hero.addSoundEvent("PUNCH", "unconventional:miles_venom_punch");
    
    hero.setModifierEnabled(isModifierEnabled);
    hero.setKeyBindEnabled(isKeyBindEnabled);

    hero.supplyFunction("canDischargeEnergy", false);

    hero.addDamageProfile("BURST", {
		"types": {
          "ENERGY": 1.0,
          "ELECTRICITY": 1.0
        },
        "properties": {
          "COOK_ENTITY": true,
          "HEAT_TRANSFER": 30,
          "DAMAGE_DROPOFF": 0.4,
          "EFFECTS": [
            {
              "id": "fiskheroes:flashbang",
              "duration": 140,
              "amplifier": 2,
              "chance": 1
            },
            {
              "id": "fiskheroes:disable_speed",
              "duration": 80,
              "amplifier": 1,
              "chance": 0.4
            }
          ]
        }
	});

    hero.setTickHandler((entity, manager) => {
        var venom = entity.getData("unconventional:dyn/venom_boost_cooldown");
		var charging = entity.getData("fiskheroes:energy_charging");
        //VENOM
        //1/3 - bar 1 full
        //2/3 - bar 2 full
        //3/3 - bar 3 full
            //NOTE: numbers are exact.

        manager.incrementData(entity, "unconventional:dyn/sneaking_timer", 40, (entity.isSneaking() && entity.isOnGround() && !entity.getData("fiskheroes:moving")));
        manager.incrementData(entity, "unconventional:dyn/perch_timer", 6, entity.getData("unconventional:dyn/sneaking_timer") == 1);

        manager.setData(entity, "fiskheroes:invisible", entity.getData("unconventional:dyn/invisibility_timer") == 1);
 
		//Venom Set
            manager.setData(entity, "fiskheroes:energy_charge", !charging ? 0 : entity.getData("fiskheroes:energy_charge"));
        if (entity.getData("fiskheroes:web_aim_right_timer") + entity.getData("fiskheroes:web_aim_left_timer") + ((entity.getPunchTimer() && !charging) + entity.getData("fiskheroes:prev_web_swinging_timer")) != 0 && venom != 1) {
            manager.setData(entity, "unconventional:dyn/venom_boost_cooldown", venom>1 ? 1 : venom + 0.005);
            // manager.setData(entity, "unconventional:dyn/venom_boost_cooldown", 2/3);
        }
        //Venom Flight
        if (entity.getData("fiskheroes:flying") && entity.getData("unconventional:dyn/venom_boost_timer") == 0 && charging) {
            manager.setData(entity, "unconventional:dyn/venom_boost_cooldown", venom < 0 ? 0 : venom-1/3);
        }       
        if (entity.getData("unconventional:dyn/venom_boost_timer") == 1 && entity.getData("fiskheroes:flying")) {
            manager.setData(entity, "fiskheroes:flying", false);
        }
		manager.incrementData(entity, "unconventional:dyn/venom_boost_timer", 18, 0, entity.getData("fiskheroes:flying") || entity.getData("fiskheroes:flight_timer")>0);
		
        outburst(hero, entity, manager, 8, 8);
		landing.tick(entity, manager, entity.isSneaking() && !entity.isSprinting(), "fiskheroes:modifier.gliding.cape.disable", 1, 0.9 - Math.random() * 0.2, 4, 10);
		
    });
}

function outburst(hero, entity, manager, damage, range) {
    var venom = entity.getData("unconventional:dyn/venom_boost_cooldown");
    
    if (entity.getData('fiskheroes:beam_shooting_timer') == 1 && venom == 1) {
        manager.setData(entity, "unconventional:dyn/venom_boost_cooldown", 0);
    }
	
	manager.setData(entity, "fiskheroes:hovering", entity.getData('fiskheroes:beam_charging'));

    if (entity.getData("fiskheroes:beam_shooting_timer") > 0) {
        var list = entity.world().getEntitiesInRangeOf(entity.pos(), range * entity.getData("fiskheroes:beam_shooting_timer"));
        for (var i = 0; i < list.size(); ++i) {
            var other = list.get(i);
            if (other.isLivingEntity() && !entity.equals(other) && entity.world().isUnobstructed(entity.pos().add(0, 1, 0), other.pos().add(0, 1, 0))) {
                other.hurtByAttacker(hero, "BURST", "%s was electrocuted by %s", damage, entity);
            }
        }
    }
}

function isModifierEnabled(entity, modifier) {
    var venomC = entity.getData("unconventional:dyn/venom_boost_cooldown");
    var venomT = entity.getData("unconventional:dyn/venom_boost_timer");
    var charging = entity.getData("fiskheroes:energy_charging");
    switch (modifier.name()) {
    case "fiskheroes:web_swinging":
        return entity.getHeldItem().isEmpty() && entity.getData("fiskheroes:utility_belt_type") == -1;
    case "fiskheroes:leaping":
        return modifier.id() == "springboard" == (entity.getData("fiskheroes:ticks_since_swinging") < 5);
    case "fiskheroes:controlled_flight":
        return entity.isSprinting() && entity.getData('fiskheroes:web_swinging_timer') == 0 && ((charging && venomC >= 1/3) || (venomC>0 && venomT>0));
    case "fiskheroes:invisibility":
        return !(entity.isPunching() && entity.getData("fiskheroes:web_aim_right_timer") + entity.getData("fiskheroes:web_aim_left_timer"));
    case "fiskheroes:damage_bonus":
        return entity.getData("fiskheroes:energy_charge") == 1;
    case "fiskheroes:flight":
    case "fiskheroes:hover":
        return entity.getData('fiskheroes:beam_charging');
    default:
        return true;
    }
}

function isKeyBindEnabled(entity, keyBind) {
    var charge = entity.getData("fiskheroes:energy_charge");
    var venomC = entity.getData("unconventional:dyn/venom_boost_cooldown");
    switch (keyBind) {
    case "UTILITY_BELT":
        return charge != 1;
    case "CHARGED_BEAM":
        return charge == 1 && venomC == 1 && entity.getData('fiskheroes:beam_shooting_timer') == 0;
    case "WEB_SWINGING":
        return entity.getHeldItem().isEmpty();
    case "INVIS":
        return entity.isSneaking();
    case "SLOW_MOTION":
        return !entity.isSneaking();
    case "CHARGE_ENERGY":
        return venomC >= 1/3;
    default:
        return true;
    }
}