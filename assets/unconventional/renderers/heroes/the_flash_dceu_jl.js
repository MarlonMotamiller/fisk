extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "unconventional:dc/the_flash_dceu_jl_layer1",
    "layer2": "unconventional:dc/the_flash_dceu_jl_layer2"
});

var utils = implement("fiskheroes:external/utils");
var speedster = implement("unconventional:external/flash_dceu_utils");

var vibration;

function init(renderer) {
    parent.init(renderer);
	
    // trail(renderer);
}

function initEffects(renderer) {
    speedster.init(renderer);

	utils.bindParticles(renderer, "unconventional:flash_dceu_sparks").setCondition(entity => entity.getData("fiskheroes:speeding") && entity.isSprinting() && (entity.ticksExisted() % 7) <= 1);
	utils.bindParticles(renderer, "unconventional:flash_dceu_sparks_legs").setCondition(entity => entity.getData("fiskheroes:speeding") && entity.isSprinting() && (entity.ticksExisted() % 4) <= 1);


	utils.bindTrail(renderer, "unconventional:lightning_flash_dceu").setCondition(entity => entity.getData("fiskheroes:speeding"));
    utils.bindTrail(renderer, "unconventional:lightning_flash_dceu_running").setCondition(entity => entity.getData("fiskheroes:speeding") && entity.isSprinting());

    utils.bindBeam(renderer, "fiskheroes:energy_projection", "unconventional:empty", "body", 0xFFFFFF, [
        { "firstPerson": [-3.75, 3.0, -8.0], "offset": [-0.5, 12.0, 0.0], "size": [1.5, 1.5] }
    ]);
	
	utils.bindBeam(renderer, "fiskheroes:energy_manipulation", "unconventional:empty", "body", 0x3097FF, [
        { "firstPerson": [0.0, 0.0, 0.0], "offset": [0.0, 0.0, 0.0], "size": [0, 0] }
    ]);
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    renderer.removeCustomAnimation("basic.BLOCKING");

    addAnimationWithData(renderer, "flash.START1", "unconventional:the_flash_dceu_jl1", "fiskheroes:energy_charge");

    addAnimationWithData(renderer, "flash.START2", "unconventional:the_flash_dceu_jl2", "unconventional:dyn/dash_timer");

    addAnimation(renderer, "flash.STOP", "unconventional:superhero_landing_2") 
    .setData((entity, data) => {
    data.load(entity.getInterpolatedData('unconventional:dyn/sprint_break_timer'));
    }).priority = -9;
}

function render(entity, renderLayer, isFirstPersonArm) {
}
