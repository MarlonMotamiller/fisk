extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "unconventional:marvel/winter_soldier_layer1",
    "layer2": "unconventional:marvel/winter_soldier_layer2"
});

function init(renderer) {
    parent.init(renderer);
	leftArm_model = renderer.createResource("MODEL", "unconventional:leftArm_fp");
	leftArm_model.bindAnimation("unconventional:blocking_arm_vibranium").setData((entity, data) => {
		var shield_timer = entity.getInterpolatedData('fiskheroes:shield_blocking_timer')
        data.load(0, shield_timer);
        data.load(1, entity.getInterpolatedData('unconventional:dyn/shield_1_timer'));
        data.load(2, entity.getInterpolatedData('unconventional:dyn/shield_2_timer'));
        data.load(3, entity.getInterpolatedData('unconventional:dyn/shield_3_timer'));
        data.load(4, entity.getInterpolatedData('unconventional:dyn/shield_4_timer'));
        data.load(5, 0);
	})
	.priority = 1;
	leftArm_model.texture.set("layer1");
	leftArm = renderer.createEffect("fiskheroes:model").setModel(leftArm_model);
	leftArm.anchor.set("body");
	
	renderer.bindProperty("fiskheroes:energy_bolt").color.set(0x6EFF00);
    initEquipped(renderer)
}
function initEquipped(renderer) {
    renderer.bindProperty("fiskheroes:equipped_item").setItems([
        { "anchor": "body", "scale": 0.6, "offset": [2.0, 1.0, 3.5], "rotation": [0.0, 90.0, -60.0] }
    ]).addOffset("QUIVER", 0.0, 0.0, 2.5).slotIndex = 0;
	renderer.bindProperty("fiskheroes:equipped_item").setItems([
        { "anchor": "body", "scale": 0.6, "offset": [0.0, 1.0, 2.5], "rotation": [0.0, 90.0, -120.0] }
    ]).addOffset("QUIVER", 0.0, 0.0, 2.5).slotIndex = 1;
	renderer.bindProperty("fiskheroes:equipped_item").setItems([
        { "anchor": "leftLeg", "scale": 0.6, "offset": [2.4, 0.5, 1.0], "rotation": [90.0, 0.0, 0.0] }
    ]).slotIndex = 2;
	renderer.bindProperty("fiskheroes:equipped_item").setItems([
        { "anchor": "rightLeg", "scale": 0.6, "offset": [-2.6, 0.5, 0.5], "rotation": [90.0, 0.0, 0.0] }
    ]).slotIndex = 3;
	renderer.bindProperty("fiskheroes:equipped_item").setItems([
        { "anchor": "rightLeg", "scale": 0.7, "offset": [-2.5, -0.1, 0.0], "rotation": [180.0, 0.0, 0.0] }
    ]).slotIndex = 4;
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
	renderer.removeCustomAnimation("basic.BLOCKING");
	addAnimation(renderer, "bucky.BLOCKING", "unconventional:blocking_arm_vibranium").setData((entity, data) => {
		var shield_timer = entity.getInterpolatedData('fiskheroes:shield_blocking_timer')
        data.load(0, shield_timer);
        data.load(1, entity.getInterpolatedData('unconventional:dyn/shield_1_timer'));
        data.load(2, entity.getInterpolatedData('unconventional:dyn/shield_2_timer'));
        data.load(3, entity.getInterpolatedData('unconventional:dyn/shield_3_timer'));
        data.load(4, entity.getInterpolatedData('unconventional:dyn/shield_4_timer'));
		data.load(5, 1);
    }).priority = -12;

    addAnimation(renderer, "bucky.THROW", "unconventional:shield_throw")
    .setData((entity, data) => {
        data.load(0, Math.max(entity.getInterpolatedData("unconventional:dyn/shield_throw_timer") - (entity.isPunching() || entity.getHeldItem().name() == "fiskheroes:captain_americas_shield" && entity.as("PLAYER").isBlocking()), 0));
    }).priority = -8;

    addAnimation(renderer, "shield.BLOCKING", "unconventional:aiming_shield_block")
    .setData((entity, data) => {
        data.load(entity.getHeldItem().name() == "fiskheroes:captain_americas_shield" && entity.as("PLAYER").isBlocking());
    });
    renderer.reprioritizeDefaultAnimation("PUNCH", -9);
}

function render(entity, renderLayer, isFirstPersonArm) {
	var shield_timer = entity.getInterpolatedData('fiskheroes:shield_blocking_timer')
	if (renderLayer == "CHESTPLATE" && isFirstPersonArm) {
		leftArm.setOffset(-6.5-1.5*(1-shield_timer), 8, 1.5+1.5*(1-shield_timer)).setRotation(-25, -2.5, 10);
		leftArm.anchor.ignoreAnchor(isFirstPersonArm);
		leftArm.opacity = shield_timer>0 ? 1 : 0;
		leftArm.render();	
	}
}