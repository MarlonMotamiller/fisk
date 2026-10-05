extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "unconventional:marvel/deadpool_xmen_origins_layer1",
    "layer2": "unconventional:marvel/deadpool_xmen_origins_layer2",
    "full": "unconventional:marvel/deadpool_xmen_origins_full.tx.json",
    "null": "unconventional:null",
    "eyes": "unconventional:marvel/deadpool_xmen_origins_eyes",
    "eyes_layer": "unconventional:marvel/deadpool_xmen_origins_eye_layer",
    "skeleton": "unconventional:marvel/adamantium_skeleton"
});

var utils = implement("fiskheroes:external/utils");

var overlay_eyes;
var overlay_eye_layer;

var blade;
var cloth;
var head;
var body;
var rightArm;
var leftArm;
var rightLeg;
var leftLeg;


function init(renderer) {
    parent.init(renderer);
	renderer.setTexture((entity, renderLayer) => entity.getInterpolatedData('fiskheroes:teleport_timer')>0 ? renderLayer == "LEGGINGS" ? "null" : "null" : renderLayer == "LEGGINGS" ? "layer2" : "layer1");
}

function bodyPart(renderer, anchor) {
	var skeleton = renderer.createEffect("fiskheroes:model").setModel(utils.createModel(renderer, "unconventional:"+anchor+"_skeleton", "skeleton"));
    skeleton.anchor.set(anchor);	
	var skin = renderer.createEffect("fiskheroes:model").setModel(utils.createModel(renderer, "unconventional:player/"+anchor+"_player", "full"));
    skin.anchor.set(anchor);
	
	return {
        render: entity => {
			var teleport_timer = entity.getInterpolatedData('fiskheroes:teleport_timer');
			var teleport_scale0 = Math.max(Math.min(1.052*Math.sin(1.6*Math.PI*teleport_timer), 0.0),-1);
			var teleport_scale1 = Math.max(Math.min(3.3*Math.sin(1.9*Math.PI*teleport_timer), 0.1),-1);
			
			skeleton.setScale(1+teleport_scale0);
			skeleton.opacity = 1-1*teleport_timer;
			skeleton.render();
			
			if (teleport_timer>0) {
				skin.setScale(1+teleport_scale1);
				skin.opacity = 1-1.5*teleport_timer;
				skin.render();
			}
		}
    };
}

function initEffects(renderer) {
	overlay_eyes = renderer.createEffect("fiskheroes:overlay");
    overlay_eyes.texture.set("eyes", "eyes");
	
	overlay_eye_layer = renderer.createEffect("fiskheroes:overlay");
    overlay_eye_layer.texture.set("eyes_layer");
	
	var blade_model = renderer.createResource("MODEL", "unconventional:deadpool_xmen_origins_blade");
	blade_model.bindAnimation("unconventional:deadpool_xmen_origins_blade").setData((entity, data) => {
		data.load(1-entity.getInterpolatedData('fiskheroes:blade_timer'));
	})
	.priority = 1;
	blade_model.texture.set("layer1");
	blade_model.generateMirror();
	blade = renderer.createEffect("fiskheroes:model").setModel(blade_model);
	blade.anchor.set("rightArm");
	
	var cloth_model = renderer.createResource("MODEL", "unconventional:deadpool_xmen_origins_cloth");
	cloth_model.bindAnimation("unconventional:deadpool_xmen_origins_cloth").setData((entity, data) => {
		data.load(0, 1);
	})
	.priority = 1;
    cloth_model.texture.set("layer2");
	cloth = renderer.createEffect("fiskheroes:model").setModel(cloth_model);
    cloth.anchor.set("body");
	
	head = bodyPart(renderer, "head");
	body = bodyPart(renderer, "body");
	rightArm = bodyPart(renderer, "rightArm");
	leftArm = bodyPart(renderer, "leftArm");
	rightLeg = bodyPart(renderer, "rightLeg");
	leftLeg = bodyPart(renderer, "leftLeg");

	utils.setOpacity(renderer, 0.999, 1.0, 1);
	
	var shake = renderer.bindProperty("fiskheroes:camera_shake").setCondition(entity => {
        shake.factor = 0.1*entity.getInterpolatedData("fiskheroes:teleport_timer") + 0.2*entity.getInterpolatedData("fiskheroes:beam_charge") + entity.getInterpolatedData("fiskheroes:beam_shooting_timer");
		shake.intensity = 0.0;
        return true;
    });
	
	utils.bindBeam(renderer, "fiskheroes:charged_beam", "unconventional:cyclops_xmen_chaos_blast", "head", 0xFF0019, [
        { "firstPerson": [2.2, 0.0, 2.0], "offset": [2.2, -3.3, -4.0], "size": [1.0, 0.5] },
        { "firstPerson": [-2.2, 0.0, 2.0], "offset": [-2.2, -3.3, -4.0], "size": [1.0, 0.5] }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_charged_beam"));
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
	addAnimationWithData(renderer, "deadpool.BLADE", "unconventional:blade_arm_rotZ", "fiskheroes:blade_timer");
	addAnimationWithData(renderer, "deadpool.WARP", "unconventional:warp", "fiskheroes:teleport_timer").priority = -1;
	addAnimationWithData(renderer, "basic.CHARGED_BEAM", "unconventional:deadpool_xmen_origins_charged_beam", "fiskheroes:beam_shooting_timer").priority = -8;
		
	addAnimation(renderer, "deadpool.SLICE", "unconventional:double_slice").setData((entity, data) => data.load(entity.getPunchTimerInterpolated()*entity.getInterpolatedData('fiskheroes:blade_timer') ))
    .priority = -8;
}

function render(entity, renderLayer, isFirstPersonArm) {
	var teleport_timer = entity.getInterpolatedData('fiskheroes:teleport_timer');
	var teleport_scale0 = Math.max(Math.min(1.052*Math.sin(1.6*Math.PI*teleport_timer), 0.0),-1);
	var teleport_scale1 = Math.max(Math.min(3.3*Math.sin(1.9*Math.PI*teleport_timer), 0.1),-1);
    if (!isFirstPersonArm) {
        if (renderLayer == "HELMET") {
			overlay_eyes.opacity = entity.getInterpolatedData('fiskheroes:beam_charge')*1-1.5*teleport_timer;;
			overlay_eyes.render();
			overlay_eye_layer.opacity = Math.min(entity.getInterpolatedData('fiskheroes:beam_charge')*2, 1)*1-1.5*teleport_timer;
			overlay_eye_layer.render();
			
			head.render(entity);
        }
        else if (renderLayer == "CHESTPLATE") {
			body.render(entity);
			leftArm.render(entity);
        }
		else if (renderLayer == "LEGGINGS") {
			cloth.setScale(1+teleport_scale1);
			cloth.opacity = 1-1.5*teleport_timer;
			cloth.render();
			
			rightLeg.render(entity);
			leftLeg.render(entity);
        }
    }
	if (renderLayer == "CHESTPLATE") {	
		blade.setScale(1+teleport_scale0);
		blade.opacity = 1-1*teleport_timer;
		blade.mirror = !isFirstPersonArm;
		blade.render();
		
		rightArm.render(entity);
	}
	
}