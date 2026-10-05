extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "unconventional:dc/batman_telltale_layer1",
    "layer2": "unconventional:dc/batman_telltale_layer2",
    "lights": "unconventional:dc/batman_telltale_lights",
    "cape": "unconventional:dc/batman_telltale_cape"
});

var utils = implement("fiskheroes:external/utils");
var glide = implement("unconventional:external/gliding_anim");
var capes = implement("unconventional:external/capes");
var cape;

function init(renderer) {
    parent.init(renderer); 
    renderer.setLights((entity, renderLayer) => renderLayer == "HELMET" ? "lights" : null);
}

function initEffects(renderer) {
    var physics = renderer.createResource("CAPE_PHYSICS", null);
    physics.weight = 1.6;
    physics.maxFlare = 0.8;
    physics.flareDegree = 0.5;
    physics.flareFactor = 0.4;
    physics.flareElasticity = 5;

    cape = capes.createGlider(renderer, 23, "fiskheroes:cape_batman.mesh.json", physics);
    cape.effect.texture.set("cape");
    cape.effect.width = 14;

    renderer.bindProperty("fiskheroes:equipment_wheel").color.set(0x00C3C6);

    renderer.bindProperty("fiskheroes:equipped_item").setItems([
        { "anchor": "body", "scale": 0.7, "offset": [4.5, 10.5, 0.4], "rotation": [110.0, 5.0, 0.0] }
    ]).slotIndex = 0;
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
	glide.addGlideAnimation(renderer, "gliding.FLIGHT", "unconventional:flight/gliding_default.anim.json");
}

function render(entity, renderLayer, isFirstPersonArm) {
    if (renderLayer == "CHESTPLATE") {
        if (!isFirstPersonArm) {
                    cape.render(entity, entity.getInterpolatedData("fiskheroes:wing_animation_timer")/1.5, entity.getInterpolatedData("fiskheroes:wing_animation_timer"), Math.max((1.1*entity.getInterpolatedData("fiskheroes:wing_animation_timer") + Math.min(Math.max(entity.motionY()+1.0, -0.7), 0) ), 0));
        }
    }
}