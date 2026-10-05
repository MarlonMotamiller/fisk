extend("unconventional:batman_rocksteady");
loadTextures({
    "layer1": "unconventional:dc/batman_rocksteady_g_layer1",
    "layer2": "unconventional:dc/batman_rocksteady_layer2"
});

function init(renderer) {
    parent.init(renderer);
    
    renderer.setItemIcon("HELMET", "batman_rocksteady_0");
    renderer.setItemIcon("LEGGINGS", "batman_rocksteady_2");
    renderer.setItemIcon("BOOTS", "batman_rocksteady_3");
}
