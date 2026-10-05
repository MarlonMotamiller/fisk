extend("unconventional:batman_rocksteady");
loadTextures({
    "layer1": "unconventional:dc/batman_rocksteady_ac_layer1",
    "layer2": "unconventional:dc/batman_rocksteady_ac_layer2",
    "cape": "unconventional:dc/batman_rocksteady_ac_cape",
    "helmet": "unconventional:dc/batman_rocksteady_helmet_ac",

    "dm": "unconventional:dc/d_m_ac"
});

var overlay;

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
