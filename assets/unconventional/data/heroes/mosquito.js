function init(hero) {
    hero.setName("Mosquito");
    hero.setTier(10);

    hero.setChestplate("item.superhero_armor.piece.chestplate");

    hero.addPowers("unconventional:mosquito_physiology");
    hero.addAttribute("FALL_RESISTANCE", 1.0, 1);
	hero.addAttribute("BASE_SPEED", -0.3, 1);
	hero.addAttribute("MAX_HEALTH", -16.0, 0);

	hero.addKeyBind("AIM", "key.aim", -1);

	///hero.setDefaultScale(0.0625);
    hero.setDefaultScale(0.0625);
	
	hero.setTierOverride(entity => entity.world().getDimension() == -1 ? 10 : 5);
	hero.addAttributeProfile("NETHER", netherProfile);
    hero.setAttributeProfile(getProfile);
	hero.setModifierEnabled(isModifierEnabled);
	hero.supplyFunction("canAim", entity => entity.getHeldItem().isEmpty());
    hero.setTickHandler((entity, manager) => {
		if (entity.world().getDimension() == -1) {
			manager.setData(entity, "fiskheroes:scale", 1)
		}
		if (!entity.isSneaking() && !entity.isOnGround() && entity.motionY() < -0.8) {
            manager.setData(entity, "fiskheroes:flying", true);
        }
		manager.setData(entity, "fiskheroes:shield", !entity.getData('fiskheroes:aiming') && entity.getData('fiskheroes:flight_boost_timer') == 0 && !entity.isOnGround());
		manager.setData(entity, "fiskheroes:shield_blocking", !entity.getData('fiskheroes:aiming') && entity.getData('fiskheroes:flight_boost_timer') == 0 && !entity.isOnGround());
	});
	
	hero.addSoundEvent("HURT", "unconventional:creetle_hurt");
	hero.addSoundEvent("STEP", "unconventional:creetle_step");
	
}

function getProfile(entity) {
    return entity.world().getDimension() == -1 ? "NETHER" : null;
}

function netherProfile(profile) {
	profile.inheritDefaults();
	profile.addAttribute("BASE_SPEED", 0.2, 1);
	profile.addAttribute("MAX_HEALTH", 0.0, 0);
	profile.addAttribute("STEP_HEIGHT", 1.0, 0);
}

function isModifierEnabled(entity, modifier) {	
	switch (modifier.name()) {
	case "fiskheroes:energy_blast":
		return modifier.id() == 'sting_nether' == (entity.world().getDimension() == -1);
	case "fiskheroes:controlled_flight":
		return modifier.id() == 'flight_nether' == (entity.world().getDimension() == -1);
	default:
		return true;
	}
}