extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "unconventional:dc/black_canary_e2_layer1",
    "layer2": "unconventional:dc/black_canary_e2_layer2",
    "gun": "unconventional:other/soldier_boy_gun"
});

var utils = implement("fiskheroes:external/utils");

var chest;

function initEffects(renderer) {
    chest = renderer.createEffect("fiskheroes:chest");
    chest.setExtrude(1).setYOffset(1);

    utils.addLivery(renderer, "DESERT_EAGLE", "gun");

    initEquipped(renderer);
}

function initEquipped(renderer) {
    renderer.bindProperty("fiskheroes:equipped_item").setItems([
        { "anchor": "rightLeg", "scale": 1.0, "offset": [-2.5, 1.0, 0.5], "rotation": [90.0, 180.0, -2.0] },
        { "anchor": "leftLeg", "scale": 1.0, "offset": [2.5, 1.0, 0.5], "rotation": [90.0, 180.0, 2.0] }
    ]);
}

function render(entity, renderLayer, isFirstPersonArm) {
    if (!isFirstPersonArm && renderLayer == "CHESTPLATE") {
        chest.render();
    }
}
