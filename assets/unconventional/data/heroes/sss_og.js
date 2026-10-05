function init(hero) {
    hero.setName("Super Soldier/Erskine's Formula");
    hero.setTier(5);
    
    hero.setChestplate("Serum");

    hero.addPowers("unconventional:sss_og");
	
    hero.addAttribute("PUNCH_DAMAGE", 6.0, 0);
    hero.addAttribute("JUMP_HEIGHT", 1.5, 0);
    hero.addAttribute("FALL_RESISTANCE", 6.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.35, 1);

    hero.setDefaultScale(1.075);
	
}