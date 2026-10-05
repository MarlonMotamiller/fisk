extend("fiskheroes:spider_man");
loadTextures({
    "layer1": "unconventional:marvel/black_bolt_comics_layer1",
    "layer2": "unconventional:marvel/black_bolt_comics_layer2",
    "wings": "unconventional:marvel/black_bolt_wings"
});

var utils = implement("fiskheroes:external/utils");

var wings;

function initEffects(renderer) {

    wings = renderer.createEffect("fiskheroes:wingsuit");
    wings.texture.set("wings");
    wings.opacity = 1.0;

    utils.bindBeam(renderer, "fiskheroes:charged_beam", "unconventional:shout_beam", "head", 0xFFFFFF, [
        { "firstPerson": [0, 0, 0], "offset": [0, 0.25, 1.0], "size": [2.0, 2.0] }
    ]);
}

function render(entity, renderLayer, isFirstPersonArm) {
    if (!isFirstPersonArm && renderLayer == "CHESTPLATE") {
        wings.render();
    }
}