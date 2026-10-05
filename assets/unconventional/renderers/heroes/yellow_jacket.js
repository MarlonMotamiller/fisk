extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "unconventional:marvel/yellow_jacket_layer1",
    "layer2": "unconventional:marvel/yellow_jacket_layer2",
    "lights": "unconventional:marvel/yellow_jacket_lights",
    "glow_layer1": "unconventional:marvel/yellow_jacket_glow_layer1",
    "glow_layer2": "unconventional:marvel/yellow_jacket_glow_layer2",
    "backpack": "unconventional:marvel/yellow_jacket_backpack_stingers_ov",
    "backpack_lights": "unconventional:marvel/yellow_jacket_backpack_stingers_lights.tx.json",
    "backpack_glow": "unconventional:marvel/yellow_jacket_backpack_stingers_ov_glow",
    "null": "unconventional:null"
    // "lights_big": "fiskheroes:ant_man_lights_big"
});

var utils = implement("fiskheroes:external/utils");
var body_lines = implement("fiskheroes:external/body_lines");

var overlay_layer1;
var overlay_layer2;

var thrusterR;
var thrusterL;

var backpack;
var backpack_glow;

var blue_lights = 0x70C1EA;

function init(renderer) {
    parent.init(renderer);
    renderer.setLights((entity, renderLayer) => {
        if (renderLayer == "HELMET") {
            return "lights";
        }

        return null;
    });
}

function animationData(entity, data) {
	var charge = entity.getInterpolatedData('fiskheroes:beam_charge');
	var nbt = entity.getWornChestplate().nbt()
	data.load(0, entity.getInterpolatedData("fiskheroes:flight_timer"));
	data.load(1, entity.getInterpolatedData("fiskheroes:flight_boost_timer"));
	data.load(2, entity.getInterpolatedData("fiskheroes:scale"));
	data.load(3, entity.as("DISPLAY").getDisplayType() == "HOLOGRAM" && nbt.getBoolean("STINGERS") ? 1 : entity.getInterpolatedData('fiskheroes:dyn/nanite_timer') );
	data.load(4, (Math.max(entity.getInterpolatedData("fiskheroes:aiming_timer"), entity.getData("fiskheroes:beam_charging") ? Math.min(charge * 3, 1) : Math.max(charge * 5 - 4, 0))) );
}

function createBackPack(renderer, texture, lights) {
	var backpack_model = renderer.createResource("MODEL", "unconventional:yellow_jacket_backpack_stingers_ov");
	backpack_model.bindAnimation("unconventional:yellow_jacket_backpack").setData(animationData).priority = -1;
	backpack_model.texture.set(texture, lights);
	var backpack = renderer.createEffect("fiskheroes:model").setModel(backpack_model);
	backpack.anchor.set("body");
	
	return {
		backpack_model: backpack_model,
		backpack: backpack,
        render: f => {
			backpack.opacity = f
			backpack.render();	
		}
    };
}

function createThruster(renderer, side) {
	var thruster_model = renderer.createResource("MODEL", "unconventional:yellow_jacket_thruster"+side);
	thruster_model.bindAnimation("unconventional:yellow_jacket_backpack").setData(animationData).priority = -1;
	thruster_model.texture.set("null");
	thruster = renderer.createEffect("fiskheroes:model").setModel(thruster_model);
	thruster.anchor.set("body");
	
	var booster = utils.createLines(renderer, "unconventional:cyborg_booster", blue_lights, [
		{"start": [0.0, 0.0, 0.0], "end": [0, 0.0, 0.4], "size": [1.25, 1.25]}
	]);
	booster.anchor.set("body", thruster_model.getCubeOffset("antenna_booster_2"+side));
	
	return {
		thruster_model: thruster_model,
		thruster: thruster,
		booster: booster,
        render: entity => {
			var flight_timer = entity.getInterpolatedData("fiskheroes:flight_timer");
			var booster_timer = entity.getInterpolatedData('fiskheroes:dyn/booster_timer');
			var f1 = easeOutElastic(booster_timer*entity.getInterpolatedData('fiskheroes:dyn/nanite_timer'));
			
			thruster.render();
			booster.setScale(16*f1, 16*f1, 16*f1);
			booster.opacity = flight_timer;
			booster.progress = booster.opacity - 0.2*Math.sin(entity.loop(2)*Math.PI*flight_timer);
			booster.render();
		}
    };
}

function initEffects(renderer) {
	
	overlay_layer1 = renderer.createEffect("fiskheroes:overlay");
    overlay_layer1.texture.set(null, "glow_layer1");
	overlay_layer2 = renderer.createEffect("fiskheroes:overlay");
    overlay_layer2.texture.set(null, "glow_layer2");
	
	backpack = createBackPack(renderer, "backpack", "backpack_lights");
	backpack_glow = createBackPack(renderer, null, "backpack_glow");
	
	thrusterR = createThruster(renderer, "R");
	thrusterL = createThruster(renderer, "L");
	
	utils.bindBeam(renderer, "fiskheroes:charged_beam", "unconventional:yellowjacket_beam", "body", 0x40BADA, [
        { "offset": [7.5, -6, -5.0], "size": [1.0, 1.0] },
        { "offset": [-7.5, -6, -5.0], "size": [1.0, 1.0] }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_energy_projection"));

}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    utils.addHoverAnimation(renderer, "atom.HOVER", "fiskheroes:flight/idle/falcon");
    utils.addFlightAnimation(renderer, "atom.FLIGHT", "fiskheroes:flight/propelled.anim.json", animationData);
}

function render(entity, renderLayer, isFirstPersonArm) {
    if (renderLayer == "CHESTPLATE" && !isFirstPersonArm) {
		backpack.render(1);	
		backpack_glow.render(0.3+ 0.2*Math.sin(Math.PI*entity.loop(150)));
		thrusterL.render(entity);
		thrusterR.render(entity);	
		
	}
	else if (renderLayer == 'LEGGINGS' && !isFirstPersonArm) {
		overlay_layer2.opacity = 0.3+ 0.2*Math.sin(Math.PI*entity.loop(150))
		overlay_layer2.render();
	}
	if (renderLayer == "HELMET" || renderLayer == "CHESTPLATE" || renderLayer == "BOOTS") {
		overlay_layer1.opacity = 0.3+ 0.2*Math.sin(Math.PI*entity.loop(150))
		overlay_layer1.render();
	}
}

function easeOutElastic(x) {
    var c4 = (2 * Math.PI) / 3;
    return x === 0
      ? 0
      : x === 1
      ? 1
      : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
}
