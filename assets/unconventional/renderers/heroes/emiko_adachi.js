extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "unconventional:dc/emiko_layer1",
    "layer2": "unconventional:dc/emiko_layer2",
    "arrow": "unconventional:dc/arrow/emiko",
    "quiver": "unconventional:dc/quiver/emiko"
});

var utils = implement("fiskheroes:external/utils");

var chest;

function initEffects(renderer) {
    chest = renderer.createEffect("fiskheroes:chest");
    chest.setExtrude(1.0).setYOffset(1);

    utils.addLivery(renderer, "ARROW", "arrow");
    utils.addLivery(renderer, "QUIVER", "quiver");

}

function render(entity, renderLayer, isFirstPersonArm) {
    if (!isFirstPersonArm && renderLayer == "CHESTPLATE") {
        chest.render();
    }
}