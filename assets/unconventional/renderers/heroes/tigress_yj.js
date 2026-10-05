extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "unconventional:dc/tigress_yj_layer1",
    "hair": "unconventional:dc/tigress_yj_hair",
    "chest": "unconventional:dc/tigress_yj_hair_chest",
    "layer2": "unconventional:dc/tigress_yj_layer2",
    "sheath": "fiskheroes:prometheus_sheath",
    "arrow": "unconventional:dc/arrow/tigress_yj",
    "quiver": "unconventional:dc/quiver/tigress_yj"
});

var utils = implement("fiskheroes:external/utils");

var chest;

var sheath;

function init(renderer) {
    parent.init(renderer);
    renderer.setTexture((entity, renderLayer) => {
        if (renderLayer == "CHESTPLATE") {
            return entity.getWornHelmet().suitType() == $SUIT_NAME ? "chest" : "layer1";
        }
        return renderLayer == "HELMET" ? "hair" : renderLayer == "LEGGINGS" ? "layer2" : "layer1";
    });

    renderer.showModel("HELMET", "head", "headwear", "body", "rightArm", "leftArm");
}

function initEffects(renderer) {
    chest = renderer.createEffect("fiskheroes:chest");
    chest.setExtrude(1).setYOffset(1);

    utils.addLivery(renderer, "ARROW", "arrow");
    utils.addLivery(renderer, "QUIVER", "quiver");
    
    sheath = renderer.createEffect("fiskheroes:model");
    sheath.setModel(utils.createModel(renderer, "fiskheroes:prometheus_sheath", "sheath"));
    sheath.anchor.set("body");

    renderer.bindProperty("fiskheroes:equipped_item").setItems([
        { "anchor": "body", "scale": 0.535, "offset": [-5.03, 1.28, 2.43], "rotation": [-150.0, 90.0, 0.0] }
    ]);
}

function render(entity, renderLayer, isFirstPersonArm) {
    if (!isFirstPersonArm && renderLayer == "CHESTPLATE") {
        chest.render();

        sheath.render();
    }
}
