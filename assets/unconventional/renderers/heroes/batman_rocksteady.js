extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "unconventional:dc/batman_rocksteady_layer1",
    "layer2": "unconventional:dc/batman_rocksteady_layer2",
    "cape": "unconventional:dc/batman_rocksteady_cape",
    "helmet": "unconventional:dc/batman_rocksteady_helmet",
    "detective": "unconventional:dc/detective_vision",
    "dm": "unconventional:dc/d_m",
	"null": "unconventional:null",

    "grapple_gun": "unconventional:dc/grappling_gun_rocksteady",
    "grapple_gun_lights": "unconventional:dc/grappling_gun_rocksteady_lights"
});

var utils = implement("fiskheroes:external/utils");
var glide = implement("unconventional:external/gliding_anim");

var model_helmet;

var detective_mode;
var overlay;
var zone_scan;
var shadow_dome;
var capes = implement("unconventional:external/capes");
var cape;

function pull(aspect) {
    var aspects = {
        "lights": null,
        "d_m": null
    }
    return aspects[aspect];
}

function init(renderer) {
    parent.init(renderer);
}

function createCape(renderer) {
    var physics = renderer.createResource("CAPE_PHYSICS", null);
    physics.weight = 1.6;
    physics.maxFlare = 0.8;
    physics.flareDegree = 0.5;
    physics.flareFactor = 0.4;
    physics.flareElasticity = 5;

    var cape = capes.createGlider(renderer, 24, "unconventional:cape_batman_rocksteady.mesh.json", physics);
    cape.effect.texture.set("cape");
    cape.effect.width = 14;
    return cape;
}

function getCape() {
    return cape;
}

function initEffects(renderer) {
    cape = createCape(renderer);

    renderer.bindProperty("fiskheroes:equipment_wheel").color.set(0x3DA4FF);

    overlay = renderer.createEffect("fiskheroes:overlay");
    overlay.texture.set(null, "dm");

    var livery = renderer.bindProperty("fiskheroes:livery");
    livery.texture.set("grapple_gun", "grapple_gun_lights");
    livery.weaponType = "GRAPPLING_GUN";

    //Helmet
    model_helmet = renderer.createResource("MODEL", "unconventional:batman_rocksteady_helmet");
    model_helmet.bindAnimation("unconventional:batman_rocksteady_remove_helmet").setData((entity, data) => {
        data.load(entity.getInterpolatedData("fiskheroes:mask_open_timer2"));
    });
    helmet = renderer.createEffect("fiskheroes:model").setModel(model_helmet);
    helmet.anchor.set("head");


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
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    addAnimationWithData(renderer, "batman_rocksteady.LAND", "fiskheroes:superhero_landing", "fiskheroes:dyn/superhero_landing_timer")
        .priority = -8;
		
	glide.addGlideAnimationWithLanding(renderer, "gliding.FLIGHT", "unconventional:flight/gliding_default.anim.json");
    addAnimationWithData(renderer, "batman_rocksteady.ROLL", "fiskheroes:flight/barrel_roll", "fiskheroes:barrel_roll_timer")
    .priority = 10;

    addAnimation(renderer, "batman_rocksteady.GRAPPLE", "unconventional:grapple_anim")
    .setData((entity, data) => {
        data.load(entity.getInterpolatedData("unconventional:dyn/grapple_timer"));
    });

    addAnimation(renderer, "batman_rocksteady.HELMET", "unconventional:batman_rocksteady_remove_helmet")
    .setData((entity, data) => {
        data.load(entity.getInterpolatedData("fiskheroes:mask_open_timer2"));
    });

    addAnimation(renderer, "batman_rocksteady.SLIDE", "unconventional:ground_slide")
    .setData((entity, data) => {
        data.load(entity.getInterpolatedData("unconventional:dyn/sliding_timer") / 2);
    });
    
}

function render(entity, renderLayer, isFirstPersonArm) {
    var d_m = entity.getData("unconventional:dyn/goggle");
    
        overlay.opacity = d_m;
        overlay.render();
    
    if (isFirstPersonArm) {
    var d_m = entity.getData("unconventional:dyn/goggle");

    detective.opacity = d_m;
    detective.render();

    }

    var mask = entity.getInterpolatedData("fiskheroes:mask_open_timer2") < 0.825;  
    if (renderLayer == "HELMET" && mask) {
        if (d_m) {
            model_helmet.texture.set("helmet", pull("d_m"));
        }
        else {
            model_helmet.texture.set("helmet", pull("lights"));
        }
        helmet.render();
    }

    if (!isFirstPersonArm && renderLayer == "CHESTPLATE") {
        
        cape.render(entity, entity.getInterpolatedData("fiskheroes:wing_animation_timer")/1.5, entity.getInterpolatedData("fiskheroes:wing_animation_timer"), Math.max((1.1*entity.getInterpolatedData("fiskheroes:wing_animation_timer") + Math.min(Math.max(entity.motionY()+1.0, -0.7), 0) ), 0));
    }
}