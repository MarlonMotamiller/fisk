extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "unconventional:marvel/pietro_layer1",
    "layer2": "unconventional:marvel/pietro_layer2"
});

var utils = implement("fiskheroes:external/utils");
var speedster = implement("fiskheroes:external/speedster_utils");

function init(renderer) {
    parent.init(renderer);
}

function initEffects(renderer) {
    speedster.init(renderer, "unconventional:quicksilver");

    utils.bindBeam(renderer, "fiskheroes:energy_projection", "unconventional:empty", "body", 0xFFFFFF, [
        { "firstPerson": [-3.75, 3.0, -8.0], "offset": [-0.5, 12.0, 0.0], "size": [1.5, 1.5] }
    ]);
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    renderer.removeCustomAnimation("basic.ENERGY_PROJ");
}