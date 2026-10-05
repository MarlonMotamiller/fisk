var vaulting = implement("unconventional:external/vaulting");
function init(hero) {
    hero.setName("Spoiler");
    hero.setVersion("Comics");
    hero.setTier(4);
    
    hero.setHelmet("item.superhero_armor.piece.hood");
    hero.setChestplate("item.superhero_armor.piece.chestpiece");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.boots");
    hero.addPrimaryEquipment("fiskheroes:tactical_tonfa{Dual:1}", true, item => item.nbt().getBoolean("Dual"));
    hero.addPrimaryEquipment("fiskheroes:grappling_gun", true);
    
    hero.addPowers("unconventional:spoiler_suit");

    hero.addAttribute("PUNCH_DAMAGE", 5.5, 0);
    hero.addAttribute("WEAPON_DAMAGE", 3.5, 0);
    hero.addAttribute("JUMP_HEIGHT", 1.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 5.5, 0);
    hero.addAttribute("SPRINT_SPEED", 0.2, 1);

    hero.addKeyBind("UTILITY_BELT", "Toggle Utility Belt", 1);    
    hero.addKeyBind("AIM", "key.aim", 3);
    
    hero.setKeyBindEnabled(isKeyBindEnabled);

    hero.setHasPermission((entity, permission) => permission == "USE_GRAPPLING_GUN");
    hero.supplyFunction("canAim", entity => entity.getHeldItem().name() == "fiskheroes:grappling_gun");

    hero.setDefaultScale(0.9);

    hero.setTickHandler((entity, manager) => {
        vaulting.grappling(entity, manager);
		vaulting.gliding(entity, manager);
    });
}

function isKeyBindEnabled(entity, keyBind) {
    switch (keyBind) {
    case "AIM":
        return entity.getHeldItem().name() == "fiskheroes:grappling_gun";
    default:
        return true;
    }
}