extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "unconventional:dc/batman_dceu_tactical_layer1",
    "layer2": "unconventional:dc/batman_dceu_tactical_layer2",
    "cape": "unconventional:dc/batman_dceu_tactical_cape",
    "goggles": "unconventional:dc/bat_goggles"
});

var utils = implement("fiskheroes:external/utils");
var glide = implement("unconventional:external/gliding_anim");
var capes = implement("unconventional:external/capes");

var cape;
var goggles;

function hasGoggles() {
    return true;
}

function init(renderer) {
    parent.init(renderer);
}

function initEffects(renderer) {
    var physics = renderer.createResource("CAPE_PHYSICS", null);
    physics.maxFlare = 0.4;
    physics.flareDegree = 1.5;
    physics.flareFactor = 1.2;
    physics.flareElasticity = 5;

    cape = capes.createGlider(renderer, 24, "fiskheroes:cape_batman.mesh.json", physics);
    cape.effect.texture.set("cape");

	if (hasGoggles()) {
		goggles = renderer.createEffect("fiskheroes:model").setModel(utils.createModel(renderer, "unconventional:bat_goggles", "goggles"));
		goggles.setScale(1.0);
		goggles.anchor.set("head");
	}

    renderer.bindProperty("fiskheroes:equipment_wheel").color.set(0x000000);
    renderer.bindProperty("fiskheroes:equipped_item").setItems([
        { "anchor": "body", "scale": 0.7, "offset": [-4.5, 10.5, 0.4], "rotation": [110.0, 5.0, 0.0] }
    ]);
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
	if (hasGoggles()) {
		addAnimation(renderer, "batman.GOGGLE", "unconventional:goggle_toggle")
			.setData((entity, data) => {
				var f = entity.getInterpolatedData("fiskheroes:mask_open_timer2");
				data.load(f < 1 ? f : 0);
        });
	}
	glide.addGlideAnimation(renderer, "gliding.FLIGHT", "unconventional:flight/gliding_default.anim.json");

    addAnimation(renderer, "batman_tactical.GRAPPLE", "unconventional:grapple_anim")
    .setData((entity, data) => {
        data.load(entity.getInterpolatedData("unconventional:dyn/grapple_timer"));
    });
}

function render(entity, renderLayer, isFirstPersonArm) {
    if (renderLayer == "HELMET" && hasGoggles()) {
        goggles.setOffset(0.0, -2.0 +2*(Math.min(entity.getInterpolatedData("fiskheroes:mask_open_timer2") * 1.5, 1)), 0.0).setRotation(-0.0, 0.0, 0.0);
        goggles.render();
    }

    if (!isFirstPersonArm && renderLayer == "CHESTPLATE") {
        cape.render(entity, entity.getInterpolatedData("fiskheroes:wing_animation_timer")/1.5, entity.getInterpolatedData("fiskheroes:wing_animation_timer"), Math.max((1.1*entity.getInterpolatedData("fiskheroes:wing_animation_timer") + Math.min(Math.max(entity.motionY()+1.0, -0.7), 0) ), 0));
    }
}
