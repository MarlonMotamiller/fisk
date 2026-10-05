extend("unconventional:five");
loadTextures({
    "layer1": "unconventional:other/five_suit_layer1",
    "layer2": "unconventional:other/john_wick_layer2"
});

function init(renderer) {
    parent.init(renderer);
    renderer.setTexture((entity, renderLayer) => {
        return renderLayer == "LEGGINGS" ? "layer2" : "layer1";
    });

    renderer.setItemIcon("LEGGINGS", "john_wick_2");
    renderer.setItemIcon("BOOTS", "john_wick_3");
}
