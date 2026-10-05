extend("fiskheroes:hero_basic");
loadTextures({
    "null": "unconventional:null",
    "armor": "unconventional:dc/cyborg_dceu",
    "armor_lights": "unconventional:dc/cyborg_dceu_lights",
	"mask": "unconventional:dc/cyborg_dceu_mask",
    "mask_lights": "unconventional:dc/cyborg_dceu_mask_lights",
    "maskR": "unconventional:dc/cyborg_dceu_mask_R.tx.json",
    "maskL": "unconventional:dc/cyborg_dceu_mask_L.tx.json",
    "thrusters" : "unconventional:dc/cyborg_dceu_thrusters",
	"thrusters_body" : "unconventional:dc/cyborg_dceu_thrusters_chest",
	"cannon1": "unconventional:dc/cyborg_dceu_cannon1",
    "cannon2": "unconventional:dc/cyborg_dceu_cannon2",
	"shield": "unconventional:dc/cyborg_dceu_shield",
	"shield2": "unconventional:dc/cyborg_dceu_shield_2",
	"cannon_model": "unconventional:dc/cyborg_dceu_cannon_model_2",
	"cannon_model_lights": "unconventional:dc/cyborg_dceu_cannon_model_lights_2",
	"mech_arms": "unconventional:dc/cyborg_dceu_mech_arms_2"
});

var utils = implement("fiskheroes:external/utils");

var cancelAnimationsFp = false;

var cannonR;
var cannonL;

var maskR;
var maskL;

var shield;
var shield2;

var thrusterBodyFR;
var thrusterBodyFL;
var thrusterBodyBR;
var thrusterBodyBL;

var thrusterArmFR;
var thrusterArmSR;
var thrusterArmBR;

var thrusterArmFL;
var thrusterArmSL;
var thrusterArmBL;

var thrusterLegR;
var thrusterLegSR;

var thrusterLegL;
var thrusterLegSL;

var metal_heat;

var blue_lights = 0xBAC4F5;

function init(renderer) {
    parent.init(renderer);
    renderer.setTexture((entity, renderLayer) => {
        return entity.getData('fiskheroes:mask_open_timer2') == 1 ? "mask" : "armor";
    });
    renderer.setLights((entity, renderLayer) => {
		return  entity.getData('fiskheroes:mask_open_timer2') == 1 ? "mask_lights" : "armor_lights";
    });
    renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm", "rightLeg", "leftLeg");
    renderer.fixHatLayer("CHESTPLATE");
}

function createThruster(renderer, model, texture, anchor, cubeAnchor, side, color, cstl) {
	var thruster_model = renderer.createResource("MODEL", model);
	thruster_model.bindAnimation("unconventional:thruster_cyborg_dceu").setData((entity, data) => {
		data.load(0, entity.getInterpolatedData("fiskheroes:flight_timer"));
		data.load(1, entity.getInterpolatedData("fiskheroes:flight_boost_timer"));
		data.load(3, entity.getInterpolatedData("fiskheroes:barrel_roll_timer"));
		data.load(4, entity.getInterpolatedData('fiskheroes:dyn/booster_'+side+'_timer'));
	})
	.priority = 1;
	thruster_model.texture.set(texture);
	var thruster = renderer.createEffect("fiskheroes:model").setModel(thruster_model);
	thruster.anchor.set(anchor);
	
	var booster = utils.createLines(renderer, "unconventional:cyborg_booster", color, [cstl]);
	booster.anchor.set(anchor, thruster_model.getCubeOffset(cubeAnchor));
	
	var obj = {
		thruster_model: thruster_model,
		thruster: thruster,
		booster: booster,
		setOffset: (x, y, z) => {
            booster.setOffset(x, y, z);
            return obj;
        },
        setScale: (x, y, z) => {
            booster.setScale(x, y, z);
            return obj;
        },
        render: (entity, progress) => {
			var flight_timer = entity.getInterpolatedData("fiskheroes:flight_timer");
			thruster.render();
			booster.opacity = flight_timer;
			booster.progress = (booster.opacity- 0.2*Math.sin(entity.loop(2)*Math.PI*flight_timer)) + progress;
			booster.render();
		}
    };
	return obj;
}

function createCannon(renderer, anchor, f, x, z) {
	var cannon_model = renderer.createResource("MODEL", "unconventional:cannon_cyborg_dceu_3");
	cannon_model.bindAnimation("unconventional:cannon_cyborg_dceu_3").setData((entity, data) => {
		data.load(0, entity.getInterpolatedData(f));
	})
	.priority = 1;
	cannon_model.texture.set("cannon_model", "cannon_model_lights");
	var cannon = renderer.createEffect("fiskheroes:model").setModel(cannon_model);
	cannon.anchor.set(anchor);
	cannon.setScale(anchor=="leftArm" ? -1:1, 1, 1);

	var c1 = renderer.createEffect("fiskheroes:shield");
    c1.texture.set("cannon1");
    c1.anchor.set(anchor);
    c1.setRotation(3.0, 90.0, 3.0).setCurve(30.0, 136.0);
    c1.large = true;

	var c2 = renderer.createEffect("fiskheroes:shield");
    c2.texture.set("cannon2");
    c2.anchor.set(anchor);
    c2.setRotation(-3.0, -90.0, 3.0).setCurve(60.0, 136.0);
    c2.large = true;
	
	var booster = utils.createLines(renderer, "unconventional:cyborg_dceu_cannon", 0x5C9CCB, [
		{"start": [x, 0.2, z], "end": [x, 0.7, z], "size": [2, 2]}, 
		{"start": [x, 0.2, z], "end": [x, 0.52, z], "size": [2.5, 2.5]}
	]);
	booster.anchor.set(anchor, cannon_model.getCubeOffset("cannon_1"));
	booster.setOffset(0.0, -2.0, 0).setRotation(0, 0, 0.0).setScale(16, 16, 16);

	return {
		cannon_model: cannon_model,
		cannon: cannon,
		c1: c1,
		c2: c2,
		booster: booster,
        render: (timer) => {
				var c_timer = Math.min(timer * 5, 1);
				c1.unfold = c2.unfold = booster.opacity = timer;
				c1.setOffset(anchor=="leftArm" ? -1:1.25, 4.3 + c_timer * 2.0, 1.67 + c_timer).render();
				c2.setOffset(anchor=="leftArm" ? -1:1.25, 4.9 + c_timer * 2.0, -1.67 - c_timer).render();
				cannon.render();
				booster.progress = 1;
				booster.render();
		}
    };
}

function createShield(renderer, texture) {
	var effect = renderer.createEffect("fiskheroes:shield");
    effect.texture.set(texture);
    effect.anchor.set("rightArm");
    effect.setRotation(0.0, 0.0, -10.0).setCurve(15.0, 50.0);
    effect.large = true;
	return {
		effect: effect,
        render: (entity, x) => {
			effect.unfold = entity.getInterpolatedData("fiskheroes:shield_timer");
			effect.setOffset(x + 1.8 * Math.min(effect.unfold * 5, 1), 6.0, 0.0);
			effect.render();
		}
    };
}

function initEffects(renderer) {
	maskR = renderer.createEffect("fiskheroes:opening_mask");
    maskR.setOffset(0.25, -0.25, 0);
    maskR.texture.set("maskR");
    maskR.anchor.set("head");
	maskL = renderer.createEffect("fiskheroes:opening_mask");
    maskL.setOffset(-0.25, -0.25, 0);
    maskL.texture.set("maskL");
    maskL.anchor.set("head");
	///mech_arms
	mech_arms_model = renderer.createResource("MODEL", "unconventional:cyborg_dceu_mech_arms_2");
	mech_arms_model.bindAnimation("unconventional:cyborg_dceu_mech_arms").setData((entity, data) => {
		data.load(0, entity.getInterpolatedData('fiskheroes:dyn/nanite_timer'));
		data.load(1, entity.getInterpolatedData('fiskheroes:flight_timer')*entity.getInterpolatedData('fiskheroes:flight_boost_timer'));
		data.load(2, entity.loop(100));
		data.load(3, entity.getInterpolatedData('unconventional:dyn/jab_1_timer'));
		data.load(4, entity.getInterpolatedData('unconventional:dyn/jab_2_timer'));
		data.load(5, cancelAnimationsFp ? 0 : 1);
		data.load(6, entity.getInterpolatedData('fiskheroes:beam_shooting_timer')>0 ? 1 : 0);
	})
	.priority = 1;
	mech_arms_model.texture.set("mech_arms");
	mech_arms = renderer.createEffect("fiskheroes:model").setModel(mech_arms_model);
	mech_arms.setOffset(0, 1, 0).anchor.set("body");

	shield = createShield(renderer, "shield");
	shield2 = createShield(renderer, "shield2");

	///CANNON
	cannonR = createCannon(renderer, "rightArm", "fiskheroes:aimed_timer", 0, 0);
	cannonL = createCannon(renderer, "leftArm", "unconventional:dyn/cooldown_1", 0.1, 0.08);

    utils.addCameraShake(renderer, 0.015, 1.5, "fiskheroes:flight_boost_timer");
	var shake = renderer.bindProperty("fiskheroes:camera_shake").setCondition(entity => {
        shake.factor = entity.isSprinting() && entity.getData("fiskheroes:flying") ? 0.3 * Math.sin(Math.PI * entity.getInterpolatedData("fiskheroes:flight_boost_timer")) : 0;
        return true;
    });
    shake.intensity = 0.05;

	utils.bindBeam(renderer, "fiskheroes:charged_beam", "unconventional:empty", "head", 0x000000, []);
	
	var beam_blast = renderer.createResource("BEAM_RENDERER", "unconventional:cyborg_blast");
    
    var constln = renderer.createResource("BEAM_CONSTELLATION", null);
    var repulsor_blast_beam = constln.bindBeam({
        "firstPerson": [-4.5, 3.75, -7.0],
        "offset": [-0.5, 9.0, 0.0],
        "size": [1.5, 1.5]
    });
    
    var repulsor_blast = renderer.bindProperty("fiskheroes:repulsor_blast");
    repulsor_blast.setConstellation(constln);
    repulsor_blast.setRenderer(beam_blast);
    repulsor_blast.color.set(0x5C9CCB);
    
    repulsor_blast.setCondition(entity => {
		var dual = entity.getWornChestplate().nbt().getBoolean('DUAL') ? entity.ticksExisted() % 13 >= 6 ? 1 : -1 : 1;
		repulsor_blast.setAnchor(dual == 1 ? "rightArm" : "leftArm");
		repulsor_blast_beam.firstPerson.x = -4.5*dual;
		repulsor_blast_beam.offset.x = -0.5*dual;
        return true;
    });

	///BODY_BOOSTERS
	var beam_035 = {"start": [0.0, 0.0, 0.0], "end": [0, 0.35, 0.0], "size": [1.0, 1.0]};
	var beam_040 = {"start": [0.0, 0.0, 0.0], "end": [0, 0.4, 0.0], "size": [1.0, 1.0]};
	var beam_050 = {"start": [0.0, 0.0, 0.0], "end": [0, 0.5, 0.0], "size": [1.0, 1.0]};
	var beam_070 = {"start": [0.0, 0.0, 0.0], "end": [0, 0.7, 0.0], "size": [1.0, 1.0]};
	var beam_080 = {"start": [0.0, 0.0, 0.0], "end": [0, 0.8, 0.0], "size": [1.0, 1.0]};
	
	thrusterBodyFR = createThruster(renderer, "unconventional:thrusterBody_cyborg", "thrusters_body", "body", "thrusterRight_frontsideBody", "r", blue_lights, beam_040);
	thrusterBodyFL = createThruster(renderer, "unconventional:thrusterBody_cyborg", "null", "body", "thrusterLeft_frontsideBody", "r", blue_lights, beam_040);
	thrusterBodyBR = createThruster(renderer, "unconventional:thrusterBody_cyborg", "null", "body", "thrusterRight_backsideBody", "r", blue_lights, beam_050);
	thrusterBodyBL = createThruster(renderer, "unconventional:thrusterBody_cyborg", "null", "body", "thrusterLeft_backsideBody", "r", blue_lights, beam_050);

	thrusterArmFR = createThruster(renderer, "unconventional:thrusterRight_arm_cyborg", "thrusters", "rightArm", "thrusterRight_frontArm", "r", blue_lights, beam_035);
	thrusterArmSR = createThruster(renderer, "unconventional:thrusterRight_arm_cyborg", "null", "rightArm", "thrusterRight_sideArm", "r", blue_lights, beam_040);
	thrusterArmBR = createThruster(renderer, "unconventional:thrusterRight_arm_cyborg", "null", "rightArm", "thrusterRight_backArm", "r", blue_lights, beam_070);
	
	thrusterArmFL = createThruster(renderer, "unconventional:thrusterLeft_arm_cyborg", "thrusters", "leftArm", "thrusterLeft_frontArm", "l", blue_lights, beam_035);
	thrusterArmSL = createThruster(renderer, "unconventional:thrusterLeft_arm_cyborg", "null", "leftArm", "thrusterLeft_sideArm", "l", blue_lights, beam_040);
	thrusterArmBL = createThruster(renderer, "unconventional:thrusterLeft_arm_cyborg", "null", "leftArm", "thrusterLeft_backArm", "l", blue_lights, beam_070);

	thrusterLegR = createThruster(renderer, "unconventional:thrusterRight_leg_cyborg", "thrusters", "rightLeg", "thrusterRight_foot", "l", blue_lights, beam_080);
	thrusterLegSR = createThruster(renderer, "unconventional:thrusterRight_leg_cyborg", "null", "rightLeg", "thrusterRight", "l", blue_lights, beam_050);
	
	thrusterLegL = createThruster(renderer, "unconventional:thrusterLeft_leg_cyborg", "thrusters", "leftLeg", "thrusterLeft_foot", "l", blue_lights, beam_080);
	thrusterLegSL = createThruster(renderer, "unconventional:thrusterLeft_leg_cyborg", "null", "leftLeg", "thrusterLeft", "l", blue_lights, beam_050);

    metal_heat = renderer.createEffect("fiskheroes:metal_heat");
    metal_heat.includeEffects(maskR, maskL, shield.effect, shield2.effect, thrusterBodyFR.thruster, thrusterArmFR.thruster, thrusterArmFL.thruster, thrusterLegR.thruster, thrusterLegL.thruster, mech_arms, cannonR.cannon, cannonR.c1, cannonR.c2, cannonL.cannon, cannonL.c1, cannonL.c2);

}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
	renderer.removeCustomAnimation("basic.CHARGED_BEAM");
    addAnimationWithData(renderer, "basic.AIMING", "fiskheroes:aiming_fpcorr", "fiskheroes:aiming_timer");
	addAnimationWithData(renderer, "basic.AIMING_LEFT", "fiskheroes:aiming_left", "unconventional:dyn/cooldown_1").setCondition(entity => entity.getWornChestplate().nbt().getBoolean('DUAL'));

    utils.addFlightAnimationWithLanding(renderer, "cyborg_dceu.FLIGHT", "fiskheroes:flight/propelled.anim.json");
    utils.addHoverAnimation(renderer, "cyborg_dceu.HOVER", "fiskheroes:flight/idle/falcon");
    utils.addAnimationEvent(renderer, "FLIGHT_DIVE", "fiskheroes:iron_man_dive");

    addAnimationWithData(renderer, "cyborg_dceu.ROLL", "fiskheroes:flight/barrel_roll", "fiskheroes:barrel_roll_timer")
        .priority = 10;
}

function render(entity, renderLayer, isFirstPersonArm) {
	var aimed_timer = entity.getInterpolatedData('fiskheroes:aimed_timer');
    var flight_boost_timer = entity.getInterpolatedData('fiskheroes:flight_boost_timer');
	var f1 = easeOutElastic(entity.getInterpolatedData('fiskheroes:dyn/booster_timer'));
	var f_b1 = easeOutElastic(flight_boost_timer);
	var r1 = easeOutElastic(entity.getInterpolatedData("fiskheroes:dyn/booster_r_timer"));
	var l1 = easeOutElastic(entity.getInterpolatedData("fiskheroes:dyn/booster_l_timer"));

	cancelAnimationsFp = isFirstPersonArm;

    shield.render(entity, 2.9);
    shield2.render(entity, 3.4);
	
	cannonR.render(aimed_timer);
	cannonL.render(entity.getInterpolatedData("unconventional:dyn/cooldown_1"));
	
    if (!isFirstPersonArm) {
		var mask_open_timer = entity.getInterpolatedData('fiskheroes:mask_open_timer2');
		if (mask_open_timer<1) {
			maskR.progress = maskL.progress = Math.min(2.5*(1-mask_open_timer),1);
			maskR.render();
			maskL.render();
		}
		thrusterBodyFR.setOffset(0.5, 1.5, 0).setScale(16*f1*(1-r1), 16*f1*(1-r1), 16*f1*(1-r1)).render(entity, 0);
		thrusterBodyFL.setOffset(-0.5, 1.5, 0).setScale(16*f1*(1-r1), 16*f1*(1-r1), 16*f1*(1-r1)).render(entity, 0);
		thrusterBodyBR.setOffset(0.5, 1.5, 0).setScale(16*f1, 16*f1, 16*f1).render(entity, 0);
		thrusterBodyBL.setOffset(-0.5, 1.5, 0).setScale(16*f1, 16*f1, 16*f1).render(entity, 0);
		
		thrusterArmFR.setOffset(0, 1.5, -0.5).setScale(16*f1*r1*f_b1, 16*f1*r1*f_b1, 16*f1*r1*f_b1).render(entity, 0);
		thrusterArmSR.setOffset(0.5, 1.5, 0).setScale(16*f1*r1, 16*f1*r1, 16*f1*r1).render(entity, 0);
		thrusterArmBR.setOffset(0, 1.5, 0.5).setScale(16*f1*r1, 16*f1*r1, 16*f1*r1).render(entity, 0);

		thrusterArmFL.setOffset(0, 1.5, -0.5).setScale(16*f1*l1*f_b1, 16*f1*l1*f_b1, 16*f1*l1*f_b1).render(entity, 0);
		thrusterArmSL.setOffset(-0.5, 1.5, 0).setScale(16*f1*l1, 16*f1*l1, 16*f1*l1).render(entity, 0);
		thrusterArmBL.setOffset(0, 1.5, 0.5).setScale(16*f1*l1, 16*f1*l1, 16*f1*l1).render(entity, 0);
		
		thrusterLegR.setOffset(0, 1.5, 0.5).setScale(16*f1, 16*f1, 16*f1).render(entity, - 0.3*(1-flight_boost_timer));
		thrusterLegSR.setOffset(0.5, 1.5, 0).setScale(16*f1, 16*f1, 16*f1).render(entity, 0);
		
		thrusterLegL.setOffset(0, 1.5, 0.5).setScale(16*f1, 16*f1, 16*f1).render(entity, - 0.3*(1-flight_boost_timer));
		thrusterLegSL.setOffset(-0.5, 1.5, 0).setScale(16*f1, 16*f1, 16*f1).render(entity, 0);
    }
	
	if (entity.getData("fiskheroes:dyn/nanite_timer") != 0) {
		mech_arms.setOffset(0, 1, isFirstPersonArm ? 6 : 0);
		mech_arms.anchor.ignoreAnchor(isFirstPersonArm);
		mech_arms.render();	
	}
    metal_heat.opacity = entity.getInterpolatedData("fiskheroes:metal_heat");
    metal_heat.render();
}

function easeOutElastic(x) {
    var c4 = (2 * Math.PI) / 3;
    return x === 0
      ? 0
      : x === 1
      ? 1
      : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
}