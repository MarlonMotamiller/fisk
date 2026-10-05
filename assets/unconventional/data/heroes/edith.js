function init(hero) {
    hero.setName("Tony Stark");
    hero.setTier(1);
    
    hero.setHelmet("E.D.I.T.H.");
    
    hero.addPowers("unconventional:stark_satellites");
    
    hero.addKeyBind("SPELL_MENU", "Main Menu", 1);
    hero.addKeyBind("SHADOWDOME", "Blackout Illusion", 2);
	hero.addKeyBindFunc("func_OWNER_UNLOCK", funcOwner, "\u00A7cUnLock", 5);
	hero.addKeyBindFunc("func_OWNER", funcOwner, "Lock", 5);
    
    hero.setTierOverride(entity => 0);
	hero.setModifierEnabled(isPowerEnabled);
	hero.setKeyBindEnabled(isKeyBindEnabled);	
	hero.setTickHandler((entity, manager) => {
        var nbt = entity.getWornHelmet().nbt();
        if (nbt.getBoolean("SelectCooldown")) {
            manager.setBoolean(nbt, "SelectCooldown", false);
        }
    });
}

function funcOwner(player, manager) {
	var nbt = player.getWornHelmet().nbt();
	var display = nbt.getCompoundTag("display");
	if (!nbt.getBoolean('LOCKED')) {
		manager.setString(nbt, "OWNER", player.getUUID());
		manager.setBoolean(nbt, "LOCKED", true);
		manager.setCompoundTag(nbt, "display", display);
		manager.setString(display, "Name", "\u00A7r" + player.getName() + "'s E.D.I.T.H.");
	}
	else if (nbt.getBoolean('LOCKED') && nbt.getString('OWNER') == player.getUUID() ) {
		manager.setString(nbt, "OWNER", "null");
		manager.setBoolean(nbt, "LOCKED", false);
		manager.removeTag(display, "Name");
	}
    manager.setBoolean(nbt, "SelectCooldown", true);
    return true;
}

function isPowerEnabled(entity, power) {
	var nbt = entity.getWornHelmet().nbt();
	var owner = nbt.getString('OWNER');
	var locked = nbt.getBoolean('LOCKED');
	if (locked && owner != entity.getUUID()) {
		return false;
	}
    return true;
}

function isKeyBindEnabled(entity, keyBind) {
	var nbt = entity.getWornHelmet().nbt();
	var owner = nbt.getString('OWNER');
	var locked = nbt.getBoolean('LOCKED');
	if (locked && owner != entity.getUUID()) {
		return false;
	}	
    switch (keyBind) {
	case "func_OWNER_UNLOCK":
		return locked;
	case "func_OWNER":
		return !locked && !nbt.getBoolean("SelectCooldown");
    default:
        return true;
    }
	return true;
}