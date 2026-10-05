///:33
function isIkonik(entity) {
	var ikonik = ['dd76aa6a-9b50-4ef9-a16f-14e73cb20766', '67d36fb7-f2c2-4234-a28e-552cd96a2f27']
    for (var i = 0; i < ikonik.length; i++) {
		if (entity.getUUID() == ikonik[i] && entity.getHeldItem().name() == "fisktag:weapon" && entity.getHeldItem().nbt().getString("WeaponType") == 'unconventional:mjolnir') {
			return entity.getHeldItem().nbt().getByte("IKONIK") | 1;
		}
	}
    return entity.getHeldItem().nbt().getByte("IKONIK") | 0;
}
function tick(entity, manager) {
	var nbt = entity.getHeldItem().nbt()
    if (entity.getHeldItem().name() == "fisktag:weapon" && nbt.getString("WeaponType") == 'unconventional:mjolnir') {
	   if (isIkonik(entity)) {
		   var display = nbt.getCompoundTag("display")
			var ench = nbt.getTagList("ench");
			var enchant = manager.newCompoundTag();
			manager.setCompoundTag(nbt, "display", display);
			manager.setString(display, "Name", "\u00A7b\u00A7lOliver's Mjolnir\u00A7r");
			
			if (ench.tagCount()==0) {
				manager.setTagList(nbt, "ench", ench);
				manager.appendTag(ench, enchant);
				manager.setShort(enchant, "id", 16);
				manager.setShort(enchant, "lvl", 5);
			}
		}
		else {
			manager.removeTag(nbt, "display");
			manager.removeTag(nbt, "ench");
		}
   }
}