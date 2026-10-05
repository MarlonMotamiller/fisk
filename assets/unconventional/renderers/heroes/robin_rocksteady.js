extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "unconventional:dc/robin_rocksteady_layer1",
    "layer2": "unconventional:dc/robin_rocksteady_layer2",
    "cape": "unconventional:dc/robin_rocksteady_cape",
    "detective": "unconventional:dc/detective_vision",
    "dm": "unconventional:dc/d_m",
	"null": "unconventional:null",

    "grapple_gun": "unconventional:dc/grappling_gun_rocksteady",
    "grapple_gun_lights": "unconventional:dc/grappling_gun_rocksteady_lights"
});

var utils = implement("fiskheroes:external/utils");
var glide = implement("unconventional:external/gliding_anim");

var detective_mode;
var zone_scan;
var shadow_dome;
var capes = implement("unconventional:external/capes");
var cape;

function init(renderer) {
    parent.init(renderer);
    renderer.setTexture((entity, renderLayer) => {
        if (renderLayer == "HELMET" && (entity.is("DISPLAY") && entity.as("DISPLAY").isStatic() ? entity.getData("fiskheroes:mask_open") : entity.getData("fiskheroes:mask_open_timer2") > 0.35)) {
            return "layer2";
        }
        return renderLayer == "LEGGINGS" ? "layer2" : "layer1";
    });
}

function initEffects(renderer) {
    var physics = renderer.createResource("CAPE_PHYSICS", null);
    physics.weight = 1.6;
    physics.maxFlare = 0.8;
    physics.flareDegree = 0.5;
    physics.flareFactor = 0.4;
    physics.flareElasticity = 5;

    cape = capes.createGlider(renderer, 19, "unconventional:cape_robin_rocksteady.mesh.json", physics);
    cape.effect.texture.set("cape");
    cape.effect.width = 12;

    renderer.bindProperty("fiskheroes:equipment_wheel").color.set(0x3DA4FF);

    var livery = renderer.bindProperty("fiskheroes:livery");
    livery.texture.set("grapple_gun", "grapple_gun_lights");
    livery.weaponType = "GRAPPLING_GUN";

    overlay = renderer.createEffect("fiskheroes:overlay");
    overlay.texture.set(null, "dm");

    //Detective Vision Model
    var model_detective = renderer.createResource("MODEL", "unconventional:detective_mode");
    model_detective.texture.set(null, "detective");
        
    detective = renderer.createEffect("fiskheroes:model").setModel(model_detective);
    detective.setOffset(0, -20.0, 6);
    detective.anchor.ignoreAnchor(true);

    var night_vision = renderer.bindProperty("fiskheroes:night_vision").setCondition(entity => {
        night_vision.factor = entity.getInterpolatedData("unconventional:dyn/goggle");
        night_vision.firstPersonOnly = true;
        return true;
    });

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
    ]).slotIndex = 1;
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
	glide.addGlideAnimation(renderer, "gliding.FLIGHT", "unconventional:flight/gliding_default.anim.json");
    utils.addAnimationEvent(renderer, "FLIGHT_DIVE", "fiskheroes:iron_man_dive");

    addAnimation(renderer, "robin_rocksteady.HOOD", "unconventional:remove_cowl")
    .setData((entity, data) => {
        var f = entity.getInterpolatedData("fiskheroes:mask_open_timer2");
        data.load(f < 1 ? f : 0);
    });

    addAnimation(renderer, "robin_rocksteady.SLIDE", "unconventional:ground_slide")
    .setData((entity, data) => {
        data.load(entity.getInterpolatedData("unconventional:dyn/sliding_timer") / 2);
    });

    addAnimation(renderer, "robin_rocksteady.DIVE", "fiskheroes:iron_man_dive")
    .setData((entity, data) => {
        data.load(entity.getInterpolatedData("unconventional:dyn/diving_timer"));
    });

    addAnimation(renderer, "robin_rocksteady.GRAPPLE", "unconventional:grapple_anim")
    .setData((entity, data) => {
        data.load(entity.getInterpolatedData("unconventional:dyn/grapple_timer"));
    });

    addAnimation(renderer, "robin_rocksteady.BLOCKING", "unconventional:robin_rocksteady_blocking")
    .setData((entity, data) => {
        data.load(entity.getInterpolatedData("unconventional:dyn/shield_timer"));
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

    if (!isFirstPersonArm && renderLayer == "CHESTPLATE") {

        cape.render(entity, entity.getInterpolatedData("fiskheroes:wing_animation_timer")/1.5, entity.getInterpolatedData("fiskheroes:wing_animation_timer"), Math.max((1.1*entity.getInterpolatedData("fiskheroes:wing_animation_timer") + Math.min(Math.max(entity.motionY()/2+1.0, -0.2), 0) ), 0));
    }
}