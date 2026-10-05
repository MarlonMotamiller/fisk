var utils = implement("unconventional:external/utils");
var gunUtils = utils.gunUtils();

function init(hero) {
    hero.setName("Ronin/Clint Barton");
    hero.setTier(5);
    
    hero.setHelmet("item.superhero_armor.piece.hood");
    hero.setChestplate("item.superhero_armor.piece.jacket");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.boots");
    hero.addPrimaryEquipment("fisktag:weapon{WeaponType:unconventional:ronin_sword}", true, item => item.nbt().getString("WeaponType") == 'unconventional:ronin_sword');
    hero.addEquipment("fiskheroes:compound_bow");
    hero.addEquipment("fiskheroes:quiver");
    
    hero.addPowers("fiskheroes:archery", "unconventional:ronin_suit");
	
    hero.addAttribute("PUNCH_DAMAGE", 6.0, 0);
    hero.addAttribute("WEAPON_DAMAGE", 4.0, 0);
    hero.addAttribute("JUMP_HEIGHT", 1.5, 0);
    hero.addAttribute("FALL_RESISTANCE", 6.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.20, 1);
    hero.addAttribute("BOW_DRAWBACK", 0.6, 1);
    
	gunUtils.addKeyBind(hero);
    hero.addKeyBind("QUIVER_CYCLE", "key.quiverCycle", 1);
    hero.addKeyBind("HORIZONTAL_BOW", "key.horizontalBow", 2);
    hero.addKeyBind("UTILITY_BELT", "key.throwingStars", 3);

    hero.setHasPermission((entity, permission) => gunUtils.hasPermission(entity, permission));
    hero.supplyFunction("canAim", entity => gunUtils.canAim(entity));

    hero.setKeyBindEnabled(isKeyBindEnabled);

}

function isKeyBindEnabled(entity, keyBind) {
    switch (keyBind) {
    case "QUIVER_CYCLE":
        return entity.getHeldItem().name() === "fiskheroes:compound_bow" && entity.getData("fiskheroes:equipped_quiver") != null;
    case "HORIZONTAL_BOW":
        return entity.getHeldItem().name() == "fiskheroes:compound_bow";
    default:
        return gunUtils.isKeyBindEnabled(entity, keyBind);
    }
}
