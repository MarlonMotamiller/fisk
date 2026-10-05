// OUTBURST STATS
var max_range = 12;
var damage = 12;

function init(hero) {
    hero.setName("Radioactive Man");
    hero.setTier(9);

    hero.setHelmet("Head");
    hero.setChestplate("Chestpiece");
    hero.setLeggings("Pants");
    
    hero.addPowers("unconventional:nuclear_radiation_generation");
	
    hero.addKeyBind("ENERGY_PROJECTION", "Radiation Beam", 1);
	hero.addKeyBind("AIM", "Radiation Beam", 1);
	hero.addKeyBind("CHARGED_BEAM", "Radiation Outburst", 2);
	hero.addKeyBind("SHIELD", "Radiation Shield", 3);
	
    hero.addAttribute("FALL_RESISTANCE", 1.0, 1);
    hero.addAttribute("PUNCH_DAMAGE", 2.0, 0);
	hero.addAttribute("BASE_SPEED", -0.1, 1);
	hero.addAttribute("SPRINT_SPEED", -0.1, 1);
	
	hero.setModifierEnabled(isModifierEnabled);
    hero.setKeyBindEnabled(isKeyBindEnabled);
	hero.setTierOverride(getTierOverride);
	hero.setHasProperty((entity, property) => property == "BREATHE_SPACE");
	hero.supplyFunction("canAim", entity => entity.getHeldItem().isEmpty() && entity.getData('fiskheroes:time_since_damaged') > 10);
	
	hero.setAttributeProfile(getProfile);
    hero.setDamageProfile(getProfile);
	
    hero.addDamageProfile("PUNCH", {"types": {"RADIATION": 1.0, "BLUNT": 1.0}});
	hero.addDamageProfile("OVERDOSE", {"types": {"COSMIC": 1.0}});
	hero.addDamageProfile("BURST", {
		"types": {
          "RADIATION": 1,
          "ENERGY": 0.6
        },
		"properties": {
          "COOK_ENTITY": true,
          "HEAT_TRANSFER": 30,
		      "DAMAGE_DROPOFF": 0.4,
		      "EFFECTS": [
                {
                  "id": "minecraft:poison",
                  "duration": 200,
                  "amplifier": 2,
                  "chance": 1
                },
				{
                  "id": "minecraft:slowness",
                  "duration": 200,
                  "amplifier": 1,
                  "chance": 0.2
                },
				{
                  "id": "minecraft:wither",
                  "duration": 800,
                  "amplifier": 1,
                  "chance": 0.01
                }
		      ]
        }
	});
	hero.addAttributeProfile("CHARGE", chargeProfile);
	hero.addAttributeProfile("EXPLOSION", explosionProfile);

    hero.setTickHandler((entity, manager) => {
		manager.setData(entity, "fiskheroes:metal_heat", 0.001);
		manager.incrementData(entity, "fiskheroes:dyn/nanite_cooldown", 2000, 400, entity.getData('fiskheroes:beam_charge') < 0.3 && !entity.getData('fiskheroes:energy_projection') && !entity.getData('fiskheroes:shield_blocking'));
		manager.incrementData(entity, "fiskheroes:dyn/nanite_timer", 0, 30, entity.getData('fiskheroes:ticks_since_shield_damaged') > 0 && entity.getData('fiskheroes:ticks_since_shield_damaged') < 10);
    
		// SUICIDE
		if (entity.getData("fiskheroes:dyn/nanite_cooldown") == 0 && entity.getData("fiskheroes:beam_shooting_timer") == 1) {
			entity.hurt(hero, "OVERDOSE", "%s died from radiation poisoning.", 1000000000);
		}

		outburst(hero, entity, manager);
	});

	hero.addSoundEvent("EQUIP", "unconventional:radioactive_man_loop");
}

function outburst(hero, entity, manager) {
	if (entity.getData("fiskheroes:beam_shooting_timer") > 0) {
		var list = entity.world().getEntitiesInRangeOf(entity.pos(), max_range * entity.getData("fiskheroes:beam_shooting_timer"));
		for (var i = 0; i < list.size(); ++i) {
			var other = list.get(i);
			if (other.isLivingEntity() && !entity.equals(other) && entity.world().isUnobstructed(entity.pos().add(0, 1, 0), other.pos().add(0, 1, 0))) {
				other.hurtByAttacker(hero, "BURST", "%s was exposed to a lethal radiation dose by %s", damage, entity);
			}
		}
	}
}

function getTierOverride(entity) {
	var f = entity.getData('fiskheroes:dyn/nanite_cooldown') 
	return f >= 0.9 ? 9 : f >= 0.8 && f < 0.9 ? 8 : f >= 0.7 && f < 0.8 ? 7 : f >= 0.6 && f < 0.7 ? 6 : 5;
}

function getProfile(entity) {
    return entity.getData("fiskheroes:dyn/nanite_cooldown") == 0 && entity.getData("fiskheroes:beam_shooting_timer")==1 ? "EXPLOSION" : entity.getData("fiskheroes:beam_charging") ? "CHARGE" : "PUNCH";
}

function chargeProfile(profile) {
    profile.inheritDefaults();
	profile.addAttribute("JUMP_HEIGHT", -1000.0, 1);
    profile.addAttribute("BASE_SPEED", -1000.0, 1);
	profile.addAttribute("SPRINT_SPEED", -1000.0, 1);
}

function explosionProfile(profile) {
    profile.inheritDefaults();
	profile.addAttribute("JUMP_HEIGHT", -1000.0, 1);
    profile.addAttribute("BASE_SPEED", -1000.0, 1);
	profile.addAttribute("SPRINT_SPEED", -1000.0, 1);
}

function isModifierEnabled(entity, modifier) {
    switch (modifier.name()) {
	case "fiskheroes:energy_projection":
        return entity.getHeldItem().isEmpty();
	case "fiskheroes:thorns":
	case "fiskheroes:projectile_immunity":
        return entity.getData("fiskheroes:beam_charging") || entity.getData("fiskheroes:beam_shooting_timer")>0;
	case "fiskheroes:controlled_flight":
        return (modifier.id() ==  ("flight_") + entity.getData("fiskheroes:beam_charging"));
	case "fiskheroes:healing_factor":
        return (modifier.id() ==  ("healing_factor_") + Math.floor(entity.getData("fiskheroes:dyn/nanite_cooldown")/0.333));
    default:
        return true;
    }
}

function isKeyBindEnabled(entity, keyBind) {
	if (entity.getData("fiskheroes:beam_charging")) {
		return false;
	}
	else if (entity.getData("fiskheroes:shield")) {
		return keyBind == "SHIELD";
	}
    switch (keyBind) {
	case "ENERGY_PROJECTION":
        return entity.getHeldItem().isEmpty() && entity.getData("fiskheroes:aimed_timer") > 0.2;
	case "AIM":
        return entity.getHeldItem().isEmpty();
    default:
        return true;
    }
}