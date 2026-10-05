var landing = implement("unconventional:external/superhero_landing");
var vaulting = implement("unconventional:external/vaulting");
var detective_mode = implement("unconventional:external/detective_mode");
var detectiveModeRange = 20; // RANGE IN BLOCKS

var blue = "\u00A7b";
function init(hero) {
    hero.setName("Batman/Arkham Knight");
    hero.setVersion("Rocksteady");
    hero.setTier(7);
    
    hero.setHelmet("item.superhero_armor.piece.helmet");
    hero.setChestplate("item.superhero_armor.piece.chestpiece");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.boots");
    hero.addPrimaryEquipment("fiskheroes:grappling_gun", true);
    hero.addPrimaryEquipment("fisktag:weapon{WeaponType:unconventional:explosive_gel}", true, item => item.nbt().getString("WeaponType") == 'unconventional:explosive_gel');
    
    hero.addPowers("unconventional:batsuit_ak");
	
    hero.addAttribute("PUNCH_DAMAGE", 6.5, 0);
    hero.addAttribute("WEAPON_DAMAGE", 3.0, 0);
    hero.addAttribute("JUMP_HEIGHT", 1.5, 0);
    hero.addAttribute("FALL_RESISTANCE", 7.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.35, 1);
    hero.addAttribute("IMPACT_DAMAGE", 0.6, 1);

    hero.addKeyBind("AIM", "key.aim", -1);
    hero.addKeyBind("GUN_RELOAD", "key.reload", 1);
    hero.addKeyBind("UTILITY_BELT", "Toggle Utility Belt", 1);
	
	detective_mode.keys(hero, true, true)

	hero.setModifierEnabled((entity, modifier) => vaulting.isModifierEnabled(entity, modifier));
    hero.setKeyBindEnabled(isKeyBindEnabled);

	hero.setHasProperty((entity, property) => property == "MASK_TOGGLE" == (entity.getHeldItem().isEmpty() && !entity.getData("unconventional:dyn/goggle") && !entity.getData("fiskheroes:gliding")));
    hero.setHasPermission((entity, permission) => (permission == "USE_EXPLOSIVE_GEL" == (entity.getData('fiskheroes:reload_timer') == 0)) || permission == "USE_GRAPPLING_GUN");
    hero.supplyFunction("canAim", entity => entity.getHeldItem().name() == "fisktag:weapon" && entity.getHeldItem().nbt().getString("WeaponType").startsWith('unconventional:explosive_gel'));

	vaulting.profiles(hero)
    hero.setAttributeProfile(entity => vaulting.getAttributeProfile(entity));

	
    hero.setTickHandler((entity, manager) => {

        var sequencer = entity.getHeldItem().name() == "fisktag:weapon" && entity.getHeldItem().nbt().getString("WeaponType") == 'unconventional:cryptographic_sequencer';
        manager.incrementData(entity, "unconventional:dyn/sequencer_timer", 10, 14, sequencer);
        var nbtC = entity.getWornChestplate().nbt();	
		landing.tick(entity, manager, entity.getData("fiskheroes:prev_gliding_timer") > 0, "fiskheroes:modifier.gliding.cape.disable", 1, 0.9 - Math.random() * 0.2, 2, 8);
		vaulting.sliding(entity, manager, 15, 7);
        vaulting.grappling(entity, manager);
		vaulting.gliding(entity, manager);
		detective_mode.tick(entity, manager, detectiveModeRange);
    });
}

function isKeyBindEnabled(entity, keyBind) {
    var nbt = entity.getWornChestplate().nbt();
	var suit_data_drive_hacking = nbt.getBoolean('suit_data_drive_hacking');
	var sneaking = entity.isSneaking();
	
    switch (keyBind) {
    case "func_DETECTIVE_MODE":
        return entity.getData("fiskheroes:mask_open") == false;
    case "DISPLAY":
        return entity.getData("unconventional:dyn/goggle") && entity.getHeldItem().name() != 'fiskheroes:suit_data_drive';
    case "func_CYCLE_TARGET":
        return entity.getData("unconventional:dyn/goggle");
    case "GUN_RELOAD":
        return ((entity.getHeldItem().name() == "fisktag:weapon" && entity.getHeldItem().nbt().getString("WeaponType").startsWith('unconventional:explosive_gel') && !entity.getHeldItem().isWeapon()) )&& !entity.getData("fiskheroes:aiming");
	case "UTILITY_BELT":
        return !entity.getHeldItem().nbt().getString("WeaponType").startsWith('unconventional:explosive_gel') && entity.getHeldItem().name() != 'fiskheroes:suit_data_drive';
	case "func_DATA_DRIVE_HACK":
			return suit_data_drive_hacking || entity.getHeldItem().name() == 'fiskheroes:suit_data_drive';	
			case "func_COPY":
				return suit_data_drive_hacking && !sneaking;
			case "func_PASTE":
				return suit_data_drive_hacking && sneaking;
			case "func_DELETE":
				return suit_data_drive_hacking;	
    default:
        return true;
    }
}