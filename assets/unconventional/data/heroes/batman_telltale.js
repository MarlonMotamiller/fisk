function init(hero) {
    hero.setName("Batman");
    hero.setVersion("Telltale");
    hero.setTier(5);
    hero.hide();
    
    hero.setHelmet("item.superhero_armor.piece.helmet");
    hero.setChestplate("item.superhero_armor.piece.chestpiece");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.boots");
    hero.addPrimaryEquipment("fiskheroes:grappling_gun", true);
    
    hero.addPowers("unconventional:batsuit_tt");
	
    hero.addAttribute("PUNCH_DAMAGE", 5.5, 0);
    hero.addAttribute("WEAPON_DAMAGE", 3.0, 0);
    hero.addAttribute("JUMP_HEIGHT", 1.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 5.5, 0);
    hero.addAttribute("SPRINT_SPEED", 0.25, 1);
    hero.addAttribute("IMPACT_DAMAGE", 0.45, 1);

    hero.addKeyBind("UTILITY_BELT", "Toggle Utility Belt", 1);
    
    hero.setHasPermission((entity, permission) => permission == "USE_GRAPPLING_GUN");

}