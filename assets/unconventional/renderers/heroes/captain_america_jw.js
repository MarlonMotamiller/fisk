extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "unconventional:marvel/captain_america_jw_layer1",
    "layer2": "unconventional:marvel/captain_america_jw_layer2",
    "shield": "unconventional:marvel/captain_americas_shield",
    "shield_bloody": "unconventional:marvel/bloody_cap_shield"
});

var utils = implement("fiskheroes:external/utils");

function hasBloodyShield() {
	return true;
}

function init(renderer) {
    parent.init(renderer);
}

function initEffects(renderer) {
    parent.initEffects(renderer);

    var equipped = renderer.bindProperty("fiskheroes:equipped_item");
    equipped.setItems([
        { "anchor": "body", "scale": 1.0, "offset": [0.0, 5.0, 2.75], "rotation": [90.0, -180.0, 0.0] }
    ]).slotIndex = 0;
    equipped.addOffset("QUIVER", -0.5, 0.0, 2.36);

    renderer.bindProperty("fiskheroes:equipped_item").setItems([
        { "anchor": "rightLeg", "scale": 0.6, "offset": [-2.4, 0.0, 1.25], "rotation": [90.0, 0.0, 0.0] }
    ]).slotIndex = 1;

	if (hasBloodyShield()) {
		utils.addLivery(renderer, "SHIELD", "shield").setCondition(entity => entity.getHeldItem().damage() < 75 && getDamageOfEquipment(entity, 0) < 75);
		utils.addLivery(renderer, "SHIELD", "shield_bloody").setCondition(entity => entity.getHeldItem().damage() >= 75 || getDamageOfEquipment(entity, 0) >= 75);
	}
	else {
		utils.addLivery(renderer, "SHIELD", "shield");
	}
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);

    addAnimation(renderer, "cap_jw.THROW", "unconventional:shield_throw")
    .setData((entity, data) => {
        data.load(0, Math.max(entity.getInterpolatedData("unconventional:dyn/shield_throw_timer") - (entity.isPunching() || entity.getHeldItem().name() == "fiskheroes:captain_americas_shield" && entity.as("PLAYER").isBlocking()), 0));
    }).priority = -8;

    addAnimation(renderer, "shield.BLOCKING", "unconventional:aiming_shield_block")
    .setData((entity, data) => {
        data.load(entity.getHeldItem().name() == "fiskheroes:captain_americas_shield" && entity.as("PLAYER").isBlocking());
    });

    renderer.reprioritizeDefaultAnimation("PUNCH", -9);

}

function getDamageOfEquipment(entity, index) {
    var nbt = entity.getWornChestplate().nbt();
    var equipment = nbt.getTagList("Equipment");
    for (var i=0; i<equipment.tagCount(); i++) {
        if (equipment.getCompoundTag(i).getByte("Index") == index) {
            return equipment.getCompoundTag(i).getCompoundTag("Item").getShort("Damage");
        }
    }
    return 0.0;
}