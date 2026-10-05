extend("unconventional:deathstroke_rocksteady");
loadTextures({
    "layer1": "unconventional:dc/deathstroke_rocksteady_eyepatch_layer1",
    "layer2": "unconventional:dc/deathstroke_rocksteady_layer2"
});

function init(renderer) {
    parent.init(renderer);
    
    renderer.setItemIcon("CHESTPLATE", "deathstroke_rocksteady_1");
    renderer.setItemIcon("LEGGINGS", "deathstroke_rocksteady_2");
    renderer.setItemIcon("BOOTS", "deathstroke_rocksteady_3");
}

function initEffects(renderer) {
    parent.initEffects(renderer);
}
