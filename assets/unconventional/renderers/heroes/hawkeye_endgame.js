extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "unconventional:marvel/hawkeye_endgame_layer1",
    "layer2": "unconventional:marvel/hawkeye_endgame_layer2",
    "arrow": "unconventional:marvel/arrow/hawkeye_endgame_arrow",
    "quiver": "unconventional:marvel/quiver/hawkeye_endgame_quiver"
});

var utils = implement("fiskheroes:external/utils");

function init(renderer) {
    parent.init(renderer);
    renderer.setItemIcons("%s_0", "%s_1", "ronin_2", "ronin_3");
}

function initEffects(renderer) {

    utils.addLivery(renderer, "ARROW", "arrow");
    utils.addLivery(renderer, "QUIVER", "quiver");
    
}
