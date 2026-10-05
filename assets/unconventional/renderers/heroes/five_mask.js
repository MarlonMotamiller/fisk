extend("unconventional:five");
loadTextures({
    "layer1": "unconventional:other/five_mask_layer1",
    "layer2": "unconventional:other/five_layer2",
    "layer2_jacket": "unconventional:other/five_jacket_layer2",
});

function init(renderer) {
    parent.init(renderer);
    
    renderer.setItemIcon("CHESTPLATE", "five_1");
    renderer.setItemIcon("LEGGINGS", "five_2");
    renderer.setItemIcon("BOOTS", "five_3");
}

function initEffects(renderer) {
    parent.initEffects(renderer);

    renderer.fixHatLayer("CHESTPLATE");
}
