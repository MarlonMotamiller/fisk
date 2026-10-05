extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "unconventional:dc/artemis_yj_layer1",
    "layer2": "unconventional:dc/artemis_yj_layer2",
    "ponytail": "unconventional:dc/artemis_ponytail_texture",
    "arrow": "unconventional:dc/arrow/artemis",
    "quiver": "unconventional:dc/quiver/artemis"
});

var utils = implement("fiskheroes:external/utils");

var chest;
var ponytail;

function init(renderer) {
    parent.init(renderer);
}

function initEffects(renderer) {
    chest = renderer.createEffect("fiskheroes:chest");
    chest.setExtrude(0.9).setYOffset(1);

    utils.addLivery(renderer, "ARROW", "arrow");
    utils.addLivery(renderer, "QUIVER", "quiver");

    var model_ponytail = renderer.createResource("MODEL", "unconventional:artemis_ponytail");
    model_ponytail.texture.set("ponytail");
    model_ponytail.bindAnimation("unconventional:ponytail").setData((entity, data) => {
        data.load(0, 1);
    });
    ponytail = renderer.createEffect("fiskheroes:model").setModel(model_ponytail);
    ponytail.anchor.set("head");

}

function render(entity, renderLayer, isFirstPersonArm) {
    if (renderLayer == "HELMET") {
        ponytail.render();

    }
    if (!isFirstPersonArm && renderLayer == "CHESTPLATE") {
        chest.render();
    }
}