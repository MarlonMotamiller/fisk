var utils = implement("unconventional:external/utils");
var gunUtils = utils.gunUtils();

function init(hero) {
    hero.setName("Ghost");
    hero.setTier(5);
    
    hero.setHelmet("item.superhero_armor.piece.helmet");
    hero.setChestplate("item.superhero_armor.piece.chestpiece");
    hero.setLeggings("item.superhero_armor.piece.legs");
    hero.setBoots("item.superhero_armor.piece.boots");
    
    hero.addPowers("unconventional:quantum_mutation");
	
    hero.addAttribute("FALL_RESISTANCE", 8.0, 0);
    hero.addAttribute("PUNCH_DAMAGE", 6.5, 0);
    hero.addAttribute("SPRINT_SPEED", 0.35, 1);
	hero.addAttribute("WEAPON_DAMAGE", 3.0, 0);
	hero.addAttribute("STEP_HEIGHT", 1.0, 0);

    gunUtils.addKeyBind(hero);
    hero.addKeyBind("INTANGIBILITY", "Phase", 1);
    hero.addKeyBind("INVISIBILITY", "Invisibility", 2);
	
	hero.setHasPermission((entity, permission) => gunUtils.hasPermission(entity, permission));
    hero.supplyFunction("canAim", entity => gunUtils.canAim(entity));
	
    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.setModifierEnabled(isModifierEnabled);

    hero.setTickHandler((entity, manager) => {
		var cooldown = entity.getData("fiskheroes:dyn/intangibility_cooldown");
		manager.setData(entity, "fiskheroes:flying", entity.getData("fiskheroes:intangible"));
		manager.setData(entity, "fiskheroes:hovering", entity.getData("fiskheroes:intangible"));
        if (cooldown == 1) {
            manager.setData(entity, "fiskheroes:intangible", false)
        }
    });

    hero.addSoundEvent("EQUIP", "unconventional:ghost_loop");
    
}

function isModifierEnabled(entity, modifier) {
	var x = entity.posX();
    var y = entity.posY();
    var z = entity.posZ();
    var blockxp = entity.world().getBlock(x+0.25, y, z) != "minecraft:air";
    var blockxn = entity.world().getBlock(x-0.25, y, z) != "minecraft:air";
	var blockyp = entity.world().getBlock(x, y+0.25, z) != "minecraft:air";
    var blockyn = entity.world().getBlock(x, y-0.25, z) != "minecraft:air";
    var blockzp = entity.world().getBlock(x, y, z-0.25) != "minecraft:air";
    var blockzn = entity.world().getBlock(x, y, z+0.25) != "minecraft:air";
	
	switch (modifier.name()) {
	case "fiskheroes:flight":
        return entity.getData("fiskheroes:intangible") && ( (blockxp) || (blockxn) || (blockzp) || (blockzn) && !entity.isInWater()) && !entity.isInWater();
	case "fiskheroes:invisibility":
        return !entity.isPunching() && !entity.getData("fiskheroes:aiming");

    default:
        return true;
    }
}

function isKeyBindEnabled(entity, keyBind) {
	switch (keyBind) {
    case "INTANGIBILITY":
        return !utils.isHoldingGun(entity) && !entity.getData("fiskheroes:aiming");
    default:
        return gunUtils.isKeyBindEnabled(entity, keyBind);
    }
}