extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "unconventional:dc/arkham_knight_rocksteady_layer1",
    "layer1_lights": "unconventional:dc/arkham_knight_rocksteady_layer1_lights",
    "layer2": "unconventional:dc/arkham_knight_rocksteady_layer2",
    "mask": "unconventional:dc/arkham_knight_rocksteady_mask_on",
    "mask_lights": "unconventional:dc/arkham_knight_mask_lights.tx.json",
    "grapple_gun": "unconventional:dc/grappling_gun_rocksteady",
    "grapple_gun_lights": "unconventional:dc/grappling_gun_rocksteady_lights",

    "detective": "unconventional:dc/detective_vision",
    "dm": "unconventional:dc/d_m",
	"null": "unconventional:null",
});

var utils = implement("fiskheroes:external/utils");
var mask;
var mask_lights;

var detective_mode;
var overlay;
var zone_scan;
var shadow_dome;

function pull(aspect) {
    var aspects = {
        "lights": null,
        "d_m": null
    }
    return aspects[aspect];
}

function init(renderer) {
    parent.init(renderer);
    renderer.setLights((entity, renderLayer) => {
        if (renderLayer == "HELMET") {
            return "layer1_lights";
        }

        return null;
    });
}

function createFaceplate(renderer, texture, lights) {
    var effect = renderer.createEffect("fiskheroes:opening_mask");
    effect.texture.set(texture, lights);
    effect.anchor.set("head");
    return {
        effect: effect,
        render: (timer, op) => {
            effect.setOffset(0, -4.25, -2.75-Math.sin(Math.PI*timer)).setRotation(-22.5-42.5*Math.min(1.612903*(timer-0.38),1), 0.0, 0.0)
            effect.opacity = op;
            effect.progress = timer;
            effect.render();
        }
    };
}


function initEffects(renderer) {
    renderer.bindProperty("fiskheroes:equipment_wheel").color.set(0x3DA4FF);

    var livery = renderer.bindProperty("fiskheroes:livery");
    livery.texture.set("grapple_gun", "grapple_gun_lights");
    livery.weaponType = "GRAPPLING_GUN";

    mask = createFaceplate(renderer, "mask", null);
    mask_lights = createFaceplate(renderer, null, "mask_lights");

    var night_vision = renderer.bindProperty("fiskheroes:night_vision").setCondition(entity => {
        night_vision.factor = entity.getInterpolatedData("unconventional:dyn/goggle");
        night_vision.firstPersonOnly = true;
        return true;
    });

    //Detective Vision Model
    detective = renderer.createEffect("fiskheroes:model").setModel(utils.createModel(renderer, "unconventional:detective_mode", null, "detective"));
    detective.setOffset(0, -20.0, 6);
    detective.anchor.ignoreAnchor(true);

    //Zone Scan
	zone_scan = renderer.bindProperty("fiskheroes:forcefield");
    zone_scan.color.set(0x3DA4FF);
    zone_scan.setShape(36, 36).setOffset(0.0, 6.0, 0.0).setScale(26);
    zone_scan.setCondition(entity => {
		zone_scan.opacity = Math.sin(Math.PI * entity.getInterpolatedData('unconventional:dyn/cooldown_1')) - 0.35;
		return true;
    });

	shadow_dome = renderer.bindProperty("fiskheroes:shadowdome");
    shadow_dome.texture.set("null");
	renderer.bindProperty("fiskheroes:equipped_item").setItems([
        { "anchor": "body", "scale": 0.7, "offset": [4.5, 10.5, 0.4], "rotation": [110.0, 5.0, 0.0] }
    ]).slotIndex = 0;
	renderer.bindProperty("fiskheroes:equipped_item").setItems([
        { "anchor": "rightLeg", "scale": 0.6, "offset": [-2.4, 0.5, 1.0], "rotation": [90.0, 0.0, 0.0] },
        { "anchor": "leftLeg", "scale": 0.6, "offset": [2.4, 0.5, 1.0], "rotation": [90.0, 0.0, 0.0] }
    ]).slotIndex = 1;
	renderer.bindProperty("fiskheroes:equipped_item").setItems([
        { "anchor": "body", "scale": 0.6, "offset": [2.0, 1.0, 3.5], "rotation": [0.0, 90.0, -60.0] }
    ]).addOffset("QUIVER", 0.0, 0.0, 2.5).slotIndex = 2;
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    addAnimationWithData(renderer, "batman_rocksteady.LAND", "fiskheroes:superhero_landing", "fiskheroes:dyn/superhero_landing_timer")
        .priority = -8;
    addAnimationWithData(renderer, "batman_rocksteady.ROLL", "fiskheroes:flight/barrel_roll", "fiskheroes:barrel_roll_timer")
    .priority = 10;

    addAnimation(renderer, "batman_rocksteady.GRAPPLE", "unconventional:grapple_anim")
    .setData((entity, data) => {
        data.load(entity.getInterpolatedData("unconventional:dyn/grapple_timer"));
    });

    addAnimation(renderer, "batman_rocksteady.SLIDE", "unconventional:ground_slide")
    .setData((entity, data) => {
        data.load(entity.getInterpolatedData("unconventional:dyn/sliding_timer") / 2);
    });
	
	addAnimation(renderer, "ninja.JUMP1", "unconventional:swing_roll4") 
		.setData((entity, data) => {
		var trick = entity.getData('unconventional:dyn/trick');
		data.load(entity.getData('unconventional:dyn/trick_toggle') && trick ==1 ? entity.getInterpolatedData('unconventional:dyn/trick_timer') : 0);
    })
	.priority = 0;
	addAnimation(renderer, "ninja.JUMP2", "fiskheroes:swing_springboard") 
		.setData((entity, data) => {
		var trick = entity.getData('unconventional:dyn/trick');
		data.load(entity.getData('unconventional:dyn/trick_toggle') && trick ==2 ? entity.getInterpolatedData('unconventional:dyn/trick_timer') : 0);
    })
	.priority = 0;
	
	addAnimation(renderer, "ninja.JUMP3", "unconventional:swing_roll5") 
		.setData((entity, data) => {
		var trick = entity.getData('unconventional:dyn/trick');
		data.load(entity.getData('unconventional:dyn/trick_toggle') && trick ==3 ? entity.getInterpolatedData('unconventional:dyn/trick_timer') : 0);
    })
	.priority = 0;
	addAnimation(renderer, "ninja.JUMP4", "unconventional:swing_roll7") 
		.setData((entity, data) => {
		var trick = entity.getData('unconventional:dyn/trick');
		data.load(entity.getData('unconventional:dyn/trick_toggle') && trick ==4 ? entity.getInterpolatedData('unconventional:dyn/trick_timer') : 0);
    })
	.priority = 0;
	
	addAnimation(renderer, "ninja.JUMP5", "fiskheroes:swing_roll3") 
		.setData((entity, data) => {
		var trick = entity.getData('unconventional:dyn/trick');
		data.load(entity.getData('unconventional:dyn/trick_toggle') && trick ==5 ? entity.getInterpolatedData('unconventional:dyn/trick_timer') : 0);
    })
	.priority = 0;
	addAnimation(renderer, "ninja.JUMP6", "fiskheroes:swing_roll2") 
		.setData((entity, data) => {
		var trick = entity.getData('unconventional:dyn/trick');
		data.load(entity.getData('unconventional:dyn/trick_toggle') && trick ==6 ? entity.getInterpolatedData('unconventional:dyn/trick_timer') : 0);
    })
	.priority = 0;
    
}

function render(entity, renderLayer, isFirstPersonArm) {
    var d_m = entity.getData("unconventional:dyn/goggle");
    
    if (isFirstPersonArm) {
    var d_m = entity.getData("unconventional:dyn/goggle");

    detective.opacity = d_m;
    detective.render();

    }

    if (!isFirstPersonArm && renderLayer == "HELMET") {
		var f = entity.getInterpolatedData('fiskheroes:mask_open_timer2')
		mask.render(f, 1);
		mask_lights.render(f, 1-f);
    }
}