var utils = implement("unconventional:external/utils");
var gunUtils = utils.gunUtils();

function init(hero) {
    hero.setName("Captain America/John Walker");
    hero.setTier(6);
    
    hero.setHelmet("item.superhero_armor.piece.helmet");
    hero.setChestplate("item.superhero_armor.piece.chestpiece");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.boots");
    hero.addPrimaryEquipment("fiskheroes:captain_americas_shield", true);
	hero.addPrimaryEquipment("fisktag:weapon{WeaponType:unconventional:m1911}", true, item => item.nbt().getString("WeaponType") == 'unconventional:m1911');

    hero.addPowers("unconventional:super_soldier_serum_3", "unconventional:shield_throwing");
	
    hero.addAttribute("PUNCH_DAMAGE", 7.5, 0);
    hero.addAttribute("WEAPON_DAMAGE", 4.0, 0);
    hero.addAttribute("JUMP_HEIGHT", 1.5, 0);
    hero.addAttribute("FALL_RESISTANCE", 6.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.3, 1);

    gunUtils.addKeyBind(hero);
    hero.addKeyBind("SHIELD_THROW", "key.shieldThrow", 1);
   
    hero.setHasPermission((entity, permission) => gunUtils.hasPermission(entity, permission) || permission == "USE_SHIELD");
    hero.supplyFunction("canAim", entity => gunUtils.canAim(entity));

    hero.setKeyBindEnabled(isKeyBindEnabled);

}

function isKeyBindEnabled(entity, keyBind) {
    switch (keyBind) {
    case "SHIELD_THROW":
        return entity.getHeldItem().name() == "fiskheroes:captain_americas_shield";
    default:
        return gunUtils.isKeyBindEnabled(entity, keyBind);
    }
}