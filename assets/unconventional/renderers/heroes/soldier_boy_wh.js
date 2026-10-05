extend("unconventional:soldier_boy");
loadTextures({
    "layer1": "unconventional:other/soldier_boy_wh_layer1",
    "layer2": "unconventional:other/soldier_boy_layer2"
});

function init(renderer) {
    parent.init(renderer);
    renderer.setItemIcons("soldier_boy_beard", "soldier_boy_1", "soldier_boy_2", "soldier_boy_3");
}