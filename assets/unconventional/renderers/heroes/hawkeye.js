extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "unconventional:marvel/hawkeye_layer1",
    "layer2": "unconventional:marvel/hawkeye_layer2",
    "arrow": "unconventional:marvel/arrow/kate",
    "quiver": "unconventional:marvel/quiver/hawkeye"
});

var utils = implement("fiskheroes:external/utils");

function initEffects(renderer) {

    utils.addLivery(renderer, "ARROW", "arrow");
    utils.addLivery(renderer, "QUIVER", "quiver");
    
}
