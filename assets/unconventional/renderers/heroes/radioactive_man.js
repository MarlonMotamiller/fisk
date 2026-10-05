extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "unconventional:other/hazmat_shambles_layer1",
    "layer2": "unconventional:other/hazmat_shambles_layer2",
    "head": "unconventional:other/electro_head",
    "lights_layer1": "unconventional:other/hazmat_lights_layer1",
    "lights_layer2": "unconventional:other/hazmat_lights_layer2"
});

var utils = implement("fiskheroes:external/utils");
var auraCreate = implement("unconventional:external/aura");

var aura;
var shield;

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
    utils.bindTrail(renderer, "unconventional:radioactive_burst").setCondition(entity => entity.getData("fiskheroes:beam_shooting_timer")>0);
	utils.addCameraShake(renderer, 0.5, 0.0, "fiskheroes:beam_shooting_timer");
	utils.bindParticles(renderer, "unconventional:outburst_radiation");
    
	var color = 0x00BA00
	
	aura = auraCreate.create(renderer, color);

	//Shield
	shield = utils.createLines(renderer, "unconventional:radiation_shield", color, [
        {"start": [0, 1.0, 0], "end": [0.0, 1.05, 0.0], "size": [10.0, 2.5]},
    ]);
    shield.anchor.set("rightArm");
    shield.setOffset(-4, 15, -3.0).setRotation(0.0, 0.0, 0.0).setScale(-115.0, 5.0, -95.0);
    shield.mirror = false;
	
    //Electro Beam
    utils.bindBeam(renderer, "fiskheroes:energy_projection", "unconventional:radiation_beam", "rightArm", color, [
        { "firstPerson": [-5.5, 4.75, -10.0], "offset": [-0.5, 9.0, 0.0], "size": [3.0, 3.0, -3.0] },
        { "firstPerson": [5.5, 4.75, -10.0], "offset": [0.5, 9.0, 0.0], "size": [3.0, 3.0, -3.0], "anchor": "leftArm" }
    ])
	.setParticles(renderer.createResource("PARTICLE_EMITTER", "unconventional:impact_radiation"));

	utils.bindBeam(renderer, "fiskheroes:charged_beam", "unconventional:radiation_beam", "head", 0x000000, [
    ]);
	
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
	renderer.removeCustomAnimation("basic.AIMING");
	renderer.removeCustomAnimation("basic.BLOCKING");
    ///renderer.removeCustomAnimation("basic.CHARGED_BEAM");

    addAnimationWithData(renderer, "basic.ENERGY_PROJ", "fiskheroes:dual_aiming", "fiskheroes:aiming_timer");

	addAnimation(renderer, "radioactive.CHARGED_BEAM", "unconventional:radiation_charged_beam").setData((entity, data) => {
        var charge = entity.getInterpolatedData("fiskheroes:beam_charge");
        data.load(0, entity.getData("fiskheroes:beam_charging") ? charge : 0);
		data.load(1, entity.getInterpolatedData("fiskheroes:beam_shooting_timer"));
    })
	.priority = -8;
	
	addAnimationWithData(renderer, "basic.BLOCKING", "fiskheroes:dual_aiming_fpcorr", "fiskheroes:shield_blocking_timer");
	
	addAnimation(renderer, "anim.IDLE", "unconventional:radioation_man_anim").setData((entity, data) => {
        data.load( 1- Math.max(entity.getInterpolatedData("fiskheroes:beam_charge"), entity.getInterpolatedData('fiskheroes:dyn/nanite_cooldown') ) );
    })
	.priority = -8;
	
	addAnimation(renderer, "anim.WALKING_IDLE", "fiskheroes:speedster_sprint").setData((entity, data) => {
        data.load( 0.3 - 0.3*Math.max(entity.getInterpolatedData("fiskheroes:flight_timer"), entity.getInterpolatedData("fiskheroes:beam_charge"), entity.getInterpolatedData('fiskheroes:dyn/nanite_cooldown') ) );
    })
	.priority = -8;
	
    utils.addHoverAnimation(renderer, "strange.HOVER", "fiskheroes:flight/idle/neutral");
    utils.addFlightAnimation(renderer, "strange.FLIGHT", "fiskheroes:flight/levitate.anim.json", (entity, data) => {
        data.load(entity.getInterpolatedData("fiskheroes:flight_timer"));
    });
	
    renderer.reprioritizeDefaultAnimation("PUNCH", -9);
    renderer.reprioritizeDefaultAnimation("AIM_BOW", -9);
}

function render(entity, renderLayer, isFirstPersonArm) {
	var beam_charge = entity.getInterpolatedData("fiskheroes:beam_shooting_timer");
        aura.render(entity, renderLayer, 0.35+(0.15*entity.getData("fiskheroes:dyn/nanite_cooldown"))+0.5*beam_charge, "HELMET", "CHESTPLATE", "LEGGINGS");
    if (renderLayer == "CHESTPLATE") {
		shield.opacity = 0.4*entity.getInterpolatedData("fiskheroes:dyn/nanite_timer")*entity.getInterpolatedData("fiskheroes:shield_blocking_timer");
		shield.render();
    }
}
