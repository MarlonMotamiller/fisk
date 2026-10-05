extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "unconventional:marvel/electro/electro_layer1",
    "layer2": "unconventional:marvel/electro/electro_layer2",
    "head": "unconventional:marvel/electro/electro_head",
    "stat": "unconventional:marvel/electro/stat",
    "lights_layer1": "unconventional:marvel/electro/electro_lights_layer1",
    "lights_layer2": "unconventional:marvel/electro/electro_lights_layer2"
});

var utils = implement("fiskheroes:external/utils");
var auraCreate = implement("unconventional:external/aura");

var color = 0x2EBAEC;
var glow;
var stat;
var aura;

function init(renderer) {
    parent.init(renderer);
    renderer.setLights((entity, renderLayer) => {
        return renderLayer == "HELMET" ? "head" : renderLayer == "LEGGINGS" ? "lights_layer2" : "lights_layer1";
    });
    renderer.setTexture((entity, renderLayer) => renderLayer == "HELMET" ? "head": renderLayer == "LEGGINGS" ? "layer2" : "layer1");

    renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm");
    renderer.fixHatLayer("HELMET", "CHESTPLATE");
}

function initEffects(renderer) {
    utils.bindTrail(renderer, "unconventional:electro_no_flicker").setCondition(entity => entity.getData("fiskheroes:shadowform"));
    utils.bindTrail(renderer, "unconventional:electro").setCondition(entity => entity.getData("fiskheroes:teleport_timer") > 0);

    stat = renderer.createEffect("fiskheroes:model").setModel(utils.createModel(renderer, "unconventional:electro_head_stat", "stat", "head"));
    stat.anchor.set("head");

    glow = renderer.createEffect("fiskheroes:glowerlay");
    glow.includeEffects(stat);
    glow.color.set(color);

    renderer.bindProperty("fiskheroes:opacity").setOpacity((entity, renderLayer) => {
        return 1 - Math.min(0.5*entity.getInterpolatedData("fiskheroes:teleport_timer") + entity.getInterpolatedData("fiskheroes:shadowform_timer"),1);
    });

	aura = auraCreate.create(renderer, color);

    //Electro Beam
    utils.bindBeam(renderer, "fiskheroes:energy_projection", "unconventional:electro_energy_projection", "rightArm", color, [
        { "firstPerson": [-5.5, 4.75, -10.0], "offset": [-0.5, 9.0, 0.0], "size": [3.0, 3.0, -3.0] },
        { "firstPerson": [5.5, 4.75, -10.0], "offset": [0.5, 9.0, 0.0], "size": [3.0, 3.0, -3.0], "anchor": "leftArm" }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "unconventional:electro_energy_projection_impact"));

    utils.bindBeam(renderer, "fiskheroes:lightning_cast", "unconventional:electro_lightning_cast", "rightArm", color, [
        { "firstPerson": [-5.5, 4.75, -10.0], "offset": [-0.5, 9.0, 0.0], "size": [0.5, 0.5, 0.5] }
    ]);
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    renderer.removeCustomAnimation("basic.AIMING");
    renderer.removeCustomAnimation("basic.ENERGY_PROJ");

	addAnimationWithData(renderer, "basic.AIMING", "fiskheroes:dual_aiming", "fiskheroes:aiming_timer");
	
    utils.addFlightAnimation(renderer, "vision.FLIGHT", "fiskheroes:flight/default.anim.json");
    utils.addHoverAnimation(renderer, "vision.HOVER", "fiskheroes:flight/idle/neutral");

    renderer.reprioritizeDefaultAnimation("PUNCH", -9);
    renderer.reprioritizeDefaultAnimation("AIM_BOW", -9);
}

function render(entity, renderLayer, isFirstPersonArm) {
    var teleport = entity.getInterpolatedData("fiskheroes:teleport_timer");
    var shadowform = entity.getInterpolatedData("fiskheroes:shadowform_timer");
    var aiming = entity.getInterpolatedData("fiskheroes:aiming_timer");
	aura.render(entity, renderLayer, 0.6*Math.min(teleport + 1.2*Math.sin(0.9*Math.PI*shadowform),1), "HELMET", "CHESTPLATE", "LEGGINGS");
    glow.opacity = 0.5*Math.min(teleport + 0.7*shadowform,1);
    glow.render();
	if (renderLayer == "HELMET" && entity.getWornChestplate().nbt().getTagList("Equipment").tagCount() > 0) {
		stat.render();
    }
}