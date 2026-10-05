extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "unconventional:marvel/kate_layer1",
    "layer2": "unconventional:marvel/kate_layer2",
    "arrow": "unconventional:marvel/arrow/kate",
    "quiver": "unconventional:marvel/quiver/kate"
});

var utils = implement("fiskheroes:external/utils");

var chest;

function initEffects(renderer) {
    chest = renderer.createEffect("fiskheroes:chest");
    chest.setExtrude(1).setYOffset(1);

    utils.addLivery(renderer, "ARROW", "arrow");
    utils.addLivery(renderer, "QUIVER", "quiver");
    
}

function render(entity, renderLayer, isFirstPersonArm) {
    if (!isFirstPersonArm && renderLayer == "CHESTPLATE") {
        chest.render();
    }
}
