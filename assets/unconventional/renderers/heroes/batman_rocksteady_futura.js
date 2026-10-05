extend("unconventional:batman_rocksteady");
loadTextures({
    "layer1": "unconventional:dc/batman_rocksteady_futura_layer1",
    "layer2": "unconventional:dc/batman_rocksteady_futura_layer2",
    "cape": "unconventional:dc/batman_rocksteady_futura_cape",
    "helmet": "unconventional:dc/batman_rocksteady_helmet_futura",
    "helmet_lights": "unconventional:dc/batman_rocksteady_helmet_futura_lights",
    "dm": "unconventional:dc/d_m_futura",

    "grapple_gun": "unconventional:dc/grappling_gun_rocksteady",
    "grapple_gun_lights": "unconventional:dc/grappling_gun_rocksteady_futura_lights"
});

var overlay;

function pull(aspect) {
    var aspects = {
        "lights": null,
        "d_m": "helmet_lights"
    }
    return aspects[aspect];
}

function init(renderer) {
    parent.init(renderer);
    
}

function initEffects(renderer) {
    parent.initEffects(renderer);

    overlay = renderer.createEffect("fiskheroes:overlay");
    overlay.texture.set(null, "dm");

}

function render(entity, renderLayer, isFirstPersonArm) {
    parent.render(entity, renderLayer, isFirstPersonArm);

    var d_m = entity.getData("unconventional:dyn/goggle");

}
