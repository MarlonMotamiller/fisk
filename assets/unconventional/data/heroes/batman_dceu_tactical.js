var vaulting = implement("unconventional:external/vaulting");
function init(hero) {
    hero.setName("Batman/Tactical");
    hero.setVersion("DCEU");
    hero.setTier(6);

    hero.setHelmet("item.superhero_armor.piece.helmet");
    hero.setChestplate("item.superhero_armor.piece.chestpiece");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.boots");
    hero.addPrimaryEquipment("fiskheroes:grappling_gun", true);

    hero.addPowers("unconventional:batsuit_tactical");
    hero.addAttribute("PUNCH_DAMAGE", 6.5, 0);
    hero.addAttribute("WEAPON_DAMAGE", 3.5, 0);
    hero.addAttribute("JUMP_HEIGHT", 1.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 10.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.3, 1);
    hero.addAttribute("IMPACT_DAMAGE", 0.5, 1);

    hero.addKeyBind("UTILITY_BELT", "key.utilityBelt", 1);

    hero.setHasProperty((entity, property) => property == "MASK_TOGGLE");
    hero.setHasPermission((entity, permission) => permission == "USE_GRAPPLING_GUN");


    hero.setTickHandler((entity, manager) => {
		vaulting.grappling(entity, manager);
		vaulting.gliding(entity, manager);
    });
}
