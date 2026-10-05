function isHoldingGun(entity) {
	return entity.getHeldItem().isGun() || (entity.getHeldItem().name() == "fisktag:weapon" && !entity.getHeldItem().isWeapon());
}

function gunUtils() {
	return {
		addKeyBind: (hero) => {
			hero.addKeyBind("NOAIM", "", -1);
			hero.addKeyBind("AIM", "key.aim", -1);
			hero.addKeyBind("GUN_RELOAD", "key.reload", 1);
		},
		isKeyBindEnabled: (entity, keyBind) => {
            if (keyBind == "NOAIM") {
                return entity.getData('fiskheroes:reload_timer') > 0 && isHoldingGun(entity);
            }
			else if (keyBind == "GUN_RELOAD") {
                return isHoldingGun(entity) && !entity.getData("fiskheroes:aiming");
            }
            return true;
        },
		hasPermission: (entity, permission) => {
			return permission == "USE_GUN" == (entity.getData('fiskheroes:reload_timer') == 0);
		},
		canAim: (entity) => {
			return entity.getData('fiskheroes:reload_timer') == 0 && isHoldingGun(entity);
		}
	};
}