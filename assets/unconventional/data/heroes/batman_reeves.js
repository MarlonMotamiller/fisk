var vaulting = implement("unconventional:external/vaulting");
function init(hero) {
    hero.setName("Batman");
    hero.setVersion("Reeves");
    hero.setTier(6);
    
    hero.setHelmet("item.superhero_armor.piece.helmet");
    hero.setChestplate("item.superhero_armor.piece.chestpiece");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.boots");
    hero.addPrimaryEquipment("fiskheroes:grappling_gun", true);
    
    hero.addPowers("unconventional:the_batsuit");
	
    hero.addAttribute("PUNCH_DAMAGE", 6.0, 0);
    hero.addAttribute("WEAPON_DAMAGE", 2.0, 0);
    hero.addAttribute("JUMP_HEIGHT", 1.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 8.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.3, 1);

    hero.addKeyBind("UTILITY_BELT", "Toggle Utility Belt", 1);

    hero.setHasPermission((entity, permission) => permission == "USE_GRAPPLING_GUN");

    hero.setTickHandler((entity, manager) => {
		vaulting.grappling(entity, manager);
    });

}