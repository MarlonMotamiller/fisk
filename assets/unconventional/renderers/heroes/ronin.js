extend("fiskheroes:hero_basic");
loadTextures({
    "jacket": "unconventional:marvel/ronin_jacket",
    "pants": "unconventional:marvel/ronin_pants",
    "pants_jacket": "unconventional:marvel/ronin_pants_jacket",
    "boots": "unconventional:marvel/ronin_boots",

    "sheath": "unconventional:marvel/ronin_sword_texture",
    "arrow": "unconventional:marvel/arrow/hawkeye_endgame_arrow",
    "quiver": "unconventional:marvel/quiver/ronin_quiver"
});

var utils = implement("fiskheroes:external/utils");

var sheath;

function init(renderer) {
    parent.init(renderer);
    renderer.setTexture((entity, renderLayer) => {
        if (renderLayer == "LEGGINGS") {
            return entity.getWornChestplate().suitType() == $SUIT_NAME ? "pants_jacket" : "pants";
        }
        if (renderLayer == "BOOTS") {
            return "boots";
        }
        return "jacket";
    });

    renderer.showModel("CHESTPLATE", "body", "rightArm", "leftArm", "rightLeg", "leftLeg");
    
}

function initEffects(renderer) {
    sheath = renderer.createEffect("fiskheroes:model").setModel(utils.createModel(renderer, "unconventional:ronin_sword_sheath", "sheath"));
    sheath.anchor.set("body");

    renderer.bindProperty("fiskheroes:equipment_wheel").color.set(0x121214);

    utils.addLivery(renderer, "ARROW", "arrow");
    utils.addLivery(renderer, "QUIVER", "quiver");

    renderer.bindProperty("fiskheroes:equipped_item").setItems([
        { "anchor": "body", "scale": 0.6, "offset": [6.0, -5.0, 3.0], "rotation": [165.0, 90.0, 0.0] }
    ]);
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);

}

function render(entity, renderLayer, isFirstPersonArm) {
    if (!isFirstPersonArm && renderLayer == "CHESTPLATE") {
        sheath.render();
    }
}
