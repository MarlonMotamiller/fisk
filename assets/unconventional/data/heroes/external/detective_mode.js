var blue = "\u00A7b";
var red = "\u00A7c";
var strike = "\u00A7m";
var line = blue + strike + "+---------------------------+";
function keys(hero, detective, data) {
	if (data) {
		hero.addKeyBindFunc("func_DATA_DRIVE_HACK", (player, manager) => {
			var nbt = player.getWornChestplate().nbt();
			var flag = nbt.getBoolean('suit_data_drive_hacking');
			manager.setBoolean(nbt, 'suit_data_drive_hacking', flag == true ? false : true);
			if (PackLoader.getSide() == "CLIENT") {
				PackLoader.printChat(line);
				PackLoader.printChat(blue + " | Data Drive: " + (flag ? red + "Closed" : blue + "Cracked"));
			}
			return true;
		}, "Hack Suit Data Drive", 1);
		hero.addKeyBindFunc("func_COPY", (player, manager) => {
			var nbt = player.getWornChestplate().nbt();
			var nbt_held = player.getHeldItem().nbt();
			var SuitList = nbt_held.getStringList("Suits");
			var StoredList = nbt.getStringList("StoredList");
			if (SuitList.tagCount() == 0) {
				if (PackLoader.getSide() == "CLIENT") {
					PackLoader.printChat(line);
					PackLoader.printChat(blue + " | No Data To Copy");
					return false;
				}
				return false;
			}
			else {
				manager.setTagList(nbt, "StoredList" ,SuitList);
				player.playSound("unconventional:data.drive.copy", 1.0, (0.9 + Math.random() * 0.1));
				if (PackLoader.getSide() == "CLIENT") {
					PackLoader.printChat(line);
					PackLoader.printChat(blue + " | Data Copied:");
				}
				for (var i = 0; i < SuitList.tagCount(); ++i) {
					if (PackLoader.getSide() == "CLIENT") {
						PackLoader.printChat(blue + " | > " + SuitList.getString(i));
					}
				}
				return false;
			}
			return true;
		}, "Copy Data", 2);
		hero.addKeyBindFunc("func_PASTE", (player, manager) => {
			var nbt = player.getWornChestplate().nbt();
			var nbt_held = player.getHeldItem().nbt();
			var SuitList = nbt_held.getStringList("Suits");
			var StoredList = nbt.getStringList("StoredList");
			if (StoredList.tagCount() == 0) {
				if (PackLoader.getSide() == "CLIENT") {
					PackLoader.printChat(line);
					PackLoader.printChat(blue + " | No Data To Print");
					return false;
				}
				return false;
			}
			else {
				manager.setTagList(nbt_held, 'Suits', StoredList);
				player.playSound("unconventional:data.drive.paste", 1.0, (0.7 + Math.random() * 0.1));
				if (PackLoader.getSide() == "CLIENT") {
					PackLoader.printChat(line);
					PackLoader.printChat(blue + " | Data Pasted:");
				}

				for (var i = 0; i < StoredList.tagCount(); ++i) {
					if (PackLoader.getSide() == "CLIENT") {
						PackLoader.printChat(blue + " | > " + StoredList.getString(i));
					}
				}
				return false;
			}
			return true
		}, "Paste Data", 2);
		hero.addKeyBindFunc("func_DELETE", (player, manager) => {
		var nbt_held = player.getHeldItem().nbt();
		var SuitList = nbt_held.getStringList("Suits");
		if (SuitList.tagCount() == 0) {
			if (PackLoader.getSide() == "CLIENT") {
				PackLoader.printChat(line);
				PackLoader.printChat(red + " | Empty");
			}
			return false;
		}
		else {
			if (PackLoader.getSide() == "CLIENT") {
				PackLoader.printChat(line);
				PackLoader.printChat(red + " | Data Deleted:");
			}
			for (var i = 0; i < SuitList.tagCount(); ++i) {
				if (PackLoader.getSide() == "CLIENT") {
					PackLoader.printChat(red + " | > " + SuitList.getString(i));
				}
			}
			manager.removeTag(nbt_held, "Suits");
			player.playSound("unconventional:data.drive.delete", 1.0, (0.6 + Math.random() * 0.1));

			return false;
		}
	}, "Delete Data", 3);
	}
	if (detective) {
		hero.addKeyBindFunc("func_DETECTIVE_MODE", (entity, manager) => {
			var d_m = entity.getData("unconventional:dyn/goggle");
			manager.setData(entity, "unconventional:dyn/goggle", !d_m);
			if (PackLoader.getSide() == "CLIENT") {
				PackLoader.printChat(line);
				PackLoader.printChat(blue + " | Detective Mode: "+ (d_m ? red + "Disabled" : blue + "Enabled") );
				entity.playSound("unconventional:dm."+(d_m ? "a" : "d"), 1.0, 1);
			}

			return false;
		},"Detective Mode", 5);
		hero.addKeyBindFunc("DISPLAY", (entity, manager) => {
			var nbt = entity.getWornChestplate().nbt();
			var list_dome = manager.newTagList();
			manager.setData(entity, "unconventional:dyn/i", 0);

			var contained = entity.world().getEntitiesInRangeOf(entity.pos(), nbt.getFloat('range'));
			manager.setTagList(nbt, "DOME_ENTITIES", list_dome);

			if (entity.getData("unconventional:dyn/i") >= contained.size()) {
				manager.setData(entity, "unconventional:dyn/i", 0);
			}
			for (var i = 0; i < contained.size(); i++) {
				var other = contained.get(i);
				if (!entity.equals(other) && other.isLivingEntity()) {
					var target = manager.newCompoundTag();
					manager.setString(target, "EntityName", other.getEntityName() ? other.getEntityName() : "Unknown");
					manager.setString(target, "Name", other.getName() ? other.getName() : "Unknown");
					manager.setString(target, "Health", round(other.getHealth()) + "/" + round(other.getMaxHealth()));
					manager.setInteger(target, "Oxygen", round(other.getAir()));

					manager.appendTag(list_dome, target);
				}
			}
			
			display(entity, manager);

		return false;
		}, "Scan Target", 2);
		hero.addKeyBindFunc("func_CYCLE_TARGET", (entity, manager) => {
		var nbt = entity.getWornChestplate().nbt();
		var list_dome = nbt.getTagList('DOME_ENTITIES');
		var i = entity.getData('unconventional:dyn/i');
		var lenght = list_dome.tagCount();
		manager.setDataWithNotify(entity, 'unconventional:dyn/i', entity.isSneaking() ? i == 0 ? lenght-1 : i - 1 : i == lenght-1 ? 0 : i + 1);
		entity.playSound("unconventional:scan.zone.cycle", 1.0, ((entity.isSneaking() ? 0.7 : 0.9) + Math.random() * 0.1));
		if (lenght >= 1) {
			display(entity, manager);
		}
		return false;
	},"Cycle Target", 4);
	}
}

function display(entity, manager) {
	var i = entity.getData('unconventional:dyn/i');
	var nbt = entity.getWornChestplate().nbt();
	var list_dome = nbt.getTagList('DOME_ENTITIES');

	if (list_dome != null && list_dome.tagCount() > 0) {
		var tag = list_dome.getCompoundTag(i);
		var name = tag.getString('Name')
		var health = tag.getString('Health');
		var oxygen = tag.getInteger('Oxygen');
		if (PackLoader.getSide() == "CLIENT") {
			PackLoader.printChat(line);
            PackLoader.printChat(blue + " | Entities: " + "\u00A73" + (i+1) + "/" + list_dome.tagCount());
            PackLoader.printChat(blue + " | Currently Tracking: " + red + name);
            PackLoader.printChat(blue + " | Health: " + "\u00A7a" + health);
            PackLoader.printChat(blue + " | Oxygen: " + "\u00A73" + oxygen);
		}
	}
    else if (list_dome != null && list_dome.tagCount() == 0) {
		if (PackLoader.getSide() == "CLIENT") {
			PackLoader.printChat(line);
            PackLoader.printChat(blue + " | Entities: " + red + "No Entities Detected.");
		}
    }
    return false;
}

function tick(entity, manager, range) {
	var nbt = entity.getWornChestplate().nbt();
	
	var suit_data_drive_hacking = nbt.getBoolean('suit_data_drive_hacking');
	if (suit_data_drive_hacking && entity.getHeldItem().name() != 'fiskheroes:suit_data_drive') {
		manager.setBoolean(nbt, 'suit_data_drive_hacking', false)
	}
	
	manager.setFloat(nbt, 'range', range)
}

function round(x) {
	return Math.round(10*x)/10;
}