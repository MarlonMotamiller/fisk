var super_boost = implement("unconventional:external/boost_wanda");
var landing = implement("unconventional:external/superhero_landing");

function init(hero) {
    hero.setName("Wanda Maximoff");
    hero.setAliases("weird");
    hero.setTier(2);

    hero.setHelmet("item.superhero_armor.piece.hair");
    hero.setChestplate("item.superhero_armor.piece.jacket");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.shoes");

    hero.addPowers("unconventional:psionic_energy");

    hero.addKeyBind("AIM", "Aim/Psionic Blast", -1);
    //hero.addKeyBind("SHIELD", "Psionic Shield", 1);
    hero.addKeyBind("CHARGE_FIST", "Psionic Shield", 1);
    hero.addKeyBind("TELEKINESIS", "key.telekinesis", 2);
    super_boost.addKeyBind(hero, "key.boost", 2);
    hero.addKeyBind("PHASING", "Enable/Disable Phasing", 3);
    hero.addKeyBind("SPELL_MENU", "Cast Spell", 4);
    hero.addKeyBind("CHARGED_BEAM", "Psionic Beam", 5);

    hero.addAttribute("PUNCH_DAMAGE", 3.5, 0);
    hero.addAttribute("WEAPON_DAMAGE", 1.0, 0);
    hero.addAttribute("JUMP_HEIGHT", 0.5, 0);
    hero.addAttribute("FALL_RESISTANCE", 5.0, 0);

    hero.setModifierEnabled(isModifierEnabled);
    hero.setKeyBindEnabled(isKeyBindEnabled);

    hero.addSoundEvent("AIM_START", "unconventional:wanda_aim");

    hero.supplyFunction("canAim", entity => entity.getHeldItem().isEmpty() && entity.getData('fiskheroes:time_since_damaged') > 5);

    hero.addAttributeProfile("LANDING", profile => {
		profile.inheritDefaults();
		profile.addAttribute("FALL_RESISTANCE", 1.0, 1);
		profile.addAttribute("BASE_SPEED", -0.6, 1);
		profile.addAttribute("JUMP_HEIGHT", -1.0, 0);
	});
    hero.setAttributeProfile(entity => entity.getData("fiskheroes:dyn/superhero_landing_timer") ? "LANDING" : null);

    hero.setTickHandler((entity, manager) => {
        manager.incrementData(entity, "fiskheroes:dyn/booster_timer", 2, entity.getData("fiskheroes:flight_boost_timer"));

        var entityGrabbed = entity.world().getEntityById(entity.getData("fiskheroes:grab_id"));

        if (entityGrabbed.is("PLAYER") && entityGrabbed.getEquipmentInSlot(3).nbt().getString('HeroType').contains('fiskheroes:vision')) {
            manager.setData(entityGrabbed, "fiskheroes:intangible", entity.getData("unconventional:dyn/vision_intangible_toggle"));
        }
        if (entity.getData("fiskheroes:flying")) {
            manager.setData(entity, "unconventional:dyn/psionic_fists", true);
        }

        manager.setData(entity, "fiskheroes:shield", entity.getData("unconventional:dyn/psionic_fists"));
		super_boost.tick(entity, manager);
		landing.tick(entity, manager, entity.isSneaking() && !entity.isSprinting(), "unconventional:wanda.throw", 1, 0.6 - Math.random() * 0.3, 4, 10);
		
    });
}

function isModifierEnabled(entity, modifier) {
    var aiming = entity.getData("fiskheroes:aiming");
    var sneaking = entity.isSneaking();
    var empty = entity.getHeldItem().isEmpty();
    var large = entity.world().getEntityById(entity.getData("fiskheroes:grab_id")).getData("fiskheroes:scale") >= 1.3;
    var too_large = entity.world().getEntityById(entity.getData("fiskheroes:grab_id")).getData("fiskheroes:scale") >= 4.0;

    switch (modifier.name()) {
    case "fiskheroes:repulsor_blast":
        return !entity.getData("fiskheroes:telekinesis") && !entity.getData("fiskheroes:dyn/superhero_landing_timer");
    case "fiskheroes:shield":
        return !entity.getData("fiskheroes:aiming");
    case "fiskheroes:telekinesis":
        return !sneaking && aiming && !entity.getData("fiskheroes:dyn/superhero_landing_timer") && !too_large;
    default:
        return super_boost.isModifierEnabled(entity, modifier);
    }
}

function isKeyBindEnabled(entity, keyBind) {
    var aiming = entity.getData("fiskheroes:aiming");
    var sneaking = entity.isSneaking();
    var empty = entity.getHeldItem().isEmpty();
    var large = entity.world().getEntityById(entity.getData("fiskheroes:grab_id")).getData("fiskheroes:scale") >= 1.3;
    var too_large = entity.world().getEntityById(entity.getData("fiskheroes:grab_id")).getData("fiskheroes:scale") >= 4.0;
    var entityGrabbed = entity.world().getEntityById(entity.getData("fiskheroes:grab_id"));

    switch (keyBind) {
    case "AIM":
        return entity.getData("unconventional:dyn/psionic_fists");
    case "SHIELD":
        return entity.getHeldItem().isEmpty() && entity.getData('fiskheroes:time_since_damaged') > 5;
    case "SPELL_MENU":
        return !sneaking && !aiming;
    case "PHASING":
        return entityGrabbed.getEquipmentInSlot(3).nbt().getString('HeroType').contains('fiskheroes:vision');
    case "TELEKINESIS":
        return !sneaking && aiming && !entity.getData("fiskheroes:dyn/superhero_landing_timer") && !too_large;
    case "CHARGED_BEAM":
        return empty && (!entity.getData("fiskheroes:shield_blocking") && !entity.getData("fiskheroes:flying") && !aiming || !entity.getData('fiskheroes:time_since_damaged') > 5);
    default:
        return super_boost.isKeyBindEnabled(entity, keyBind);
    }
}