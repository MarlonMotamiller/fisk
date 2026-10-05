function init(hero) {
    hero.setName("Artemis");
    hero.setVersion("Young Justice");
    hero.setTier(2);
    
    hero.setHelmet("item.superhero_armor.piece.mask");
    hero.setChestplate("item.superhero_armor.piece.chestpiece");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.boots");
	hero.addEquipment("fiskheroes:compound_bow");
    hero.addEquipment("fiskheroes:quiver");
    
    hero.addPowers("fiskheroes:archery");
	
    hero.addAttribute("PUNCH_DAMAGE", 4.0, 0);
    hero.addAttribute("WEAPON_DAMAGE", 3.0, 0);
    hero.addAttribute("JUMP_HEIGHT", 1.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 3.5, 0);
    hero.addAttribute("SPRINT_SPEED", 0.1, 1);
    hero.addAttribute("BOW_DRAWBACK", 0.5, 1);
    
    hero.addKeyBind("QUIVER_CYCLE", "key.quiverCycle", 1);
    hero.addKeyBind("HORIZONTAL_BOW", "key.horizontalBow", 2);

    hero.setKeyBindEnabled(isKeyBindEnabled);

    hero.setDefaultScale(0.85);
}

function isKeyBindEnabled(entity, keyBind) {
    switch (keyBind) {
    case "QUIVER_CYCLE":
        return entity.getHeldItem().name() === "fiskheroes:compound_bow" && entity.getData("fiskheroes:equipped_quiver") != null;
    case "HORIZONTAL_BOW":
        return entity.getHeldItem().name() == "fiskheroes:compound_bow";
    default:
        return true;
    }
}