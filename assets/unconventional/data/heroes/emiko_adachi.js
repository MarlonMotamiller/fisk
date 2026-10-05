function init(hero) {
    hero.setName("Emiko Adachi");
    hero.setTier(4);
    hero.hide();
    
    hero.setChestplate("item.superhero_armor.piece.chestpiece");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.boots");
    hero.addEquipment("fiskheroes:compound_bow");
    hero.addEquipment("fiskheroes:quiver");
    
    hero.addPowers("fiskheroes:archery");
	
    hero.addAttribute("PUNCH_DAMAGE", 5.5, 0);
	hero.addAttribute("WEAPON_DAMAGE", 4.0, 0);
	hero.addAttribute("JUMP_HEIGHT", 1.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 5.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.2, 1);
    hero.addAttribute("BOW_DRAWBACK", 0.6, 1);
    
    hero.addKeyBind("QUIVER_CYCLE", "key.quiverCycle", 1);
    hero.addKeyBind("HORIZONTAL_BOW", "key.horizontalBow", 2);

    hero.setKeyBindEnabled(isKeyBindEnabled);

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