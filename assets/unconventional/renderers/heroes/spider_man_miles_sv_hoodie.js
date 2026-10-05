extend("unconventional:spider_man_miles_sv");
loadTextures({
    "layer1": "unconventional:marvel/spider_man_miles_sv_hoodie_layer1",
    "layer2": "unconventional:marvel/spider_man_miles_sv_hoodie_layer2",
    "chest": "unconventional:marvel/spider_man_miles_sv_hoodie_chest",
    "pants": "unconventional:marvel/spider_man_miles_sv_pants",
    "boots": "unconventional:marvel/spider_man_miles_sv_hoodie_boots",
    "invis": "unconventional:marvel/spider_man_miles_sv_hoodie_invisible"
});

function init(renderer) {
    parent.init(renderer);
    renderer.setTexture((entity, renderLayer) => {
        if (renderLayer == "CHESTPLATE") {
            return entity.getWornLeggings().suitType() == $SUIT_NAME ? "chest" : "layer1";
        }
        if (renderLayer == "LEGGINGS") {
            return entity.getWornChestplate().suitType() == $SUIT_NAME ? "layer2" : "pants";
        }
        if (renderLayer == "HELMET" && (entity.isDisplayStand() || entity.isBookPlayer() ? entity.getData("fiskheroes:mask_open") : entity.getData("fiskheroes:mask_open_timer2") > 0.35)) {
            return "layer2";
        }
        return renderLayer == "HELMET" ? "layer1" : renderLayer == "CHESTPLATE" ? "layer1" : renderLayer == "BOOTS" ? "boots" : null;
    });

    renderer.setItemIcon("HELMET", "spider_man_miles_sv_0");
}
