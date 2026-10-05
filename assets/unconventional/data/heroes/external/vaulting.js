function sliding(entity, manager, cooldown, recovery) {
	if (entity.isSneaking() 
		&& entity.getData("unconventional:dyn/sprint_cooldown") > 0 
		&& entity.isOnGround() 
		&& !entity.isInWater() 
		&& entity.getData("unconventional:dyn/sliding_cooldown") == 0 
		&& entity.getData("fiskheroes:dyn/superhero_landing_timer") == 0) {
			
		manager.setData(entity, "unconventional:dyn/sliding", true);
		manager.setData(entity, "fiskheroes:flying", true);
	}
	if (entity.getData("unconventional:dyn/sliding_timer")>0) {
		manager.setData(entity, "fiskheroes:flight_boost_timer", 0.8575);
	}
	if (entity.getData("unconventional:dyn/sliding_cooldown")==1) {
		manager.setData(entity, "unconventional:dyn/sliding", false);
	}
	manager.setData(entity, "fiskheroes:flying", false);
	manager.incrementData(entity, "unconventional:dyn/sliding_timer", 6, entity.getData("unconventional:dyn/sliding"));
	manager.incrementData(entity, "unconventional:dyn/sliding_cooldown", cooldown, recovery, entity.getData("unconventional:dyn/sliding"));
	manager.incrementData(entity, "unconventional:dyn/sprint_cooldown", 1, entity.isSprinting());
}

function grappling(entity, manager) {
	var ground_distance = entity.world().blockAt(entity.pos().add(0, -2, 0)).isSolid();
	manager.setData(entity, "unconventional:dyn/grapple", !entity.getData("fiskheroes:gliding") && entity.getData("unconventional:dyn/trick_timer")==0 && !ground_distance && !entity.isPunching() && entity.getHeldItem().name() == "fiskheroes:grappling_gun" && entity.motionY() > 0.6); 
	manager.incrementData(entity, "unconventional:dyn/grapple_timer", 6, entity.getData("unconventional:dyn/grapple") && entity.getData("unconventional:dyn/trick_timer")==0);
}

function gliding(entity, manager) {
	if (entity.getData("fiskheroes:gliding")) {
		manager.setData(entity, "fiskheroes:flying", false);
		manager.setData(entity, "fiskheroes:flight_boost_timer", 1);
	}
}

function flips(entity, manager, tricks) {
	var pitch = Math.round(Math.min(Math.max(-entity.rotPitch() / (90 / 5), 1), 5))-1
	var toggle = entity.getData('unconventional:dyn/trick_toggle');
	var timer = entity.getData('unconventional:dyn/trick_timer');
	var ticks_since_on_ground = entity.getData('unconventional:dyn/ticks_since_on_ground');
	var count = entity.getData('unconventional:dyn/trick_count');
	if  (ticks_since_on_ground == 1) {
		manager.setData(entity, 'unconventional:dyn/trick_count', 0);
	}
	if  (timer == 1) {
		manager.setData(entity, 'unconventional:dyn/trick', 0);
		manager.setData(entity, 'unconventional:dyn/trick_toggle', false);
		manager.setData(entity, 'unconventional:dyn/trick_timer', 0);
	}
	else if (timer == 0 && !toggle) {
		if (entity.isSprinting() && entity.motionY() > 0.5 && !entity.isOnGround() && entity.getData("fiskheroes:prev_on_ground") && entity.getData("unconventional:dyn/grapple_timer")==0) {
			manager.setData(entity, 'unconventional:dyn/trick_count', count <=1? count+1 : 0);
			manager.setData(entity, 'unconventional:dyn/ticks_since_on_ground', 0);
			manager.setData(entity, 'unconventional:dyn/trick_toggle', true);
		}
		manager.setData(entity, 'unconventional:dyn/trick', (entity.isOnGround() || (timer<1 && !toggle && !entity.isOnGround())) 
		? tricks[pitch].id[Math.floor(Math.random() * tricks[pitch].id.length)] 
		: entity.getData('unconventional:dyn/trick'));
		
	}
	manager.incrementData(entity, "unconventional:dyn/trick_timer", 16, 0, toggle);
	manager.incrementData(entity, "unconventional:dyn/ticks_since_on_ground", 2, 0, entity.isOnGround() || entity.isInWater());
}


function isModifierEnabled(entity, modifier) {
    if (modifier.name() == "fiskheroes:controlled_flight") {
        return entity.getData("unconventional:dyn/sliding") || entity.getData("fiskheroes:gliding");
    }
    return true;
}

function profiles(hero) {
	hero.addAttributeProfile("SLIDING", profile => {
    profile.inheritDefaults();
    profile.addAttribute("BASE_SPEED", 1.5, 1);
    profile.addAttribute("SPRINT_SPEED", -0.25, 1);
	});
    hero.addAttributeProfile("LANDING", profile =>{
    profile.inheritDefaults();
    profile.addAttribute("FALL_RESISTANCE", 1.0, 1);
	});
}

function getAttributeProfile(entity) {
	if (entity.getData("unconventional:dyn/sliding_timer")) {
        return "SLIDING";
    } 
    if (entity.getData("fiskheroes:dyn/superhero_landing_timer")) {
        return "LANDING";
    }
    
    return null;
}