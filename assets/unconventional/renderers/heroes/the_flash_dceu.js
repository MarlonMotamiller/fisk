extend("fiskheroes:hero_basic");
function tanh(data, x, y) {
	return 0.5 * ((Math.pow(Math.E, x*data + y) - Math.pow(Math.E, -(x*data + y))) / (Math.pow(Math.E, x*data + y) + Math.pow(Math.E, -(x*data + y)))) + 0.5;
}
loadTextures({
    "body": "unconventional:dc/the_flash_dceu_body",
    "body_arms": "unconventional:dc/the_flash_dceu_body_arms",
    "lights": "unconventional:dc/the_flash_dceu_lights",
    "lights_timer": "unconventional:dc/the_flash_dceu.tx.json",
    "lights_timer2": "unconventional:dc/the_flash_dceu2.tx.json",
    "lights_timer_overlay": "unconventional:dc/the_flash_dceu_overlay.tx.json",
    "lights_timer_overlay2": "unconventional:dc/the_flash_dceu_overlay2.tx.json",
    "goggles": "unconventional:dc/the_flash_dceu_lenses",
});

var utils = implement("fiskheroes:external/utils");
var speedster = implement("unconventional:external/flash_dceu_utils");

var goggles;

function trail(renderer) {
    speedster.setTrails(["unconventional:lightning_the_flash_dceu", "unconventional:lightning_the_flash_dceu2", "unconventional:lightning_the_flash_dceu3"], renderer);
}

function init(renderer) {
    parent.init(renderer);

    renderer.setTexture((entity, renderLayer) => {
        if (entity.getData("unconventional:dyn/transformation_timer") == 0) {
            return "body_arms";
        }
        return "body";
    });
    renderer.setLights((entity, renderLayer) => {
        if (entity.getInterpolatedData("unconventional:dyn/speedforce_timer")) {
            if (entity.getData("unconventional:dyn/transformation_timer") == 0) {
                return "lights_timer";
            }
            if (entity.getData("unconventional:dyn/transformation_timer") != 0) {
                return "lights_timer2";
            }
        }
        return null;
    });

    renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm", "rightLeg", "leftLeg");
    renderer.fixHatLayer("CHESTPLATE");

    trail(renderer);
}

function initEffects(renderer) {
    speedster.init(renderer);

    utils.bindBeam(renderer, "fiskheroes:energy_projection", "unconventional:electro_energy_projection", "body", 0xFF6B00, [
        { "firstPerson": [-3.75, 3.0, -8.0], "offset": [-0.5, 12.0, 0.0], "size": [1.5, 1.5] }
    ]);

    lightsOverlay = renderer.createEffect("fiskheroes:overlay");
    lightsOverlay.texture.set("null", "lights_timer_overlay");
    lightsOverlay2 = renderer.createEffect("fiskheroes:overlay");
    lightsOverlay2.texture.set("null", "lights_timer_overlay2");

    goggles = renderer.createEffect("fiskheroes:model").setModel(utils.createModel(renderer, "unconventional:bat_goggles", "goggles"));
    goggles.setScale(1.0);
    goggles.anchor.set("head");
	
	utils.bindBeam(renderer, "fiskheroes:energy_manipulation", "unconventional:empty", "body", 0xFF6B00, [
        { "firstPerson": [0.0, 0.0, 0.0], "offset": [0.0, 0.0, 0.0], "size": [0, 0] }
    ]);
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    renderer.removeCustomAnimation("basic.BLOCKING");

    addAnimationWithData(renderer, "flash.START", "unconventional:the_flash_dceu", "fiskheroes:energy_charge");

    addAnimation(renderer, "flash.STOP", "unconventional:superhero_landing_2") 
    .setData((entity, data) => {
        data.load(entity.getInterpolatedData('unconventional:dyn/sprint_break_timer'));
    }).priority = -9;
}

function render(entity, renderLayer, isFirstPersonArm) {
    if (renderLayer == "CHESTPLATE") {

        goggles.setOffset(0.0, -1.0 +1*entity.getInterpolatedData("unconventional:dyn/goggle_timer"), 0.02).setRotation(0.0, 0.0, 0.0);
        goggles.render();
    }
}