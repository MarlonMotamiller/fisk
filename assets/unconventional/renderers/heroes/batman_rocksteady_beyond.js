extend("unconventional:batman_rocksteady");
loadTextures({
    "layer1": "unconventional:dc/batman_rocksteady_beyond_layer1",
    "layer2": "unconventional:dc/batman_rocksteady_beyond_layer2",
    "cape": "unconventional:dc/batman_rocksteady_beyond_cape",
    "helmet": "unconventional:dc/batman_rocksteady_helmet_beyond",
    "helmet_lights": "unconventional:dc/batman_rocksteady_helmet_beyond_lights",
    "dm": "unconventional:dc/d_m_beyond",
    "lights_layer1": "unconventional:dc/batman_rocksteady_beyond_lights_layer1",
    "lights_layer2": "unconventional:dc/batman_rocksteady_beyond_lights_layer2"
});

var utils = implement("fiskheroes:external/utils");

var capes = implement("unconventional:external/capes");
var cape;

function pull(aspect) {
    var aspects = {
        "lights": "helmet_lights",
        "d_m": null
    }
    return aspects[aspect];
}

function init(renderer) {
    parent.init(renderer);
    renderer.setLights((entity, renderLayer) => renderLayer == "LEGGINGS" ? "lights_layer2" : "lights_layer1");
}

function createCape(renderer) {
    var physics = renderer.createResource("CAPE_PHYSICS", null);
    physics.weight = 1.6;
    physics.maxFlare = 0.8;
    physics.flareDegree = 0.5;
    physics.flareFactor = 0.4;
    physics.flareElasticity = 5;

    var cape = capes.createGlider(renderer, 13, "unconventional:cape_batman_rocksteady.mesh.json", physics);
    cape.effect.texture.set("cape");
    cape.effect.width = 8;
    return cape;
}

function initEffects(renderer) {
    parent.initEffects(renderer);

    overlay = renderer.createEffect("fiskheroes:overlay");
    overlay.texture.set(null, "dm");

    cape = getCape();
}

function render(entity, renderLayer, isFirstPersonArm) {
    parent.render(entity, renderLayer, isFirstPersonArm);

    cape.effect.opacity = entity.getInterpolatedData("fiskheroes:wing_animation_timer");

    var d_m = entity.getData("unconventional:dyn/goggle");
    
    overlay.opacity = d_m;
    overlay.render();

}