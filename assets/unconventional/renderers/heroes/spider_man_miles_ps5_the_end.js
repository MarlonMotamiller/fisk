extend("unconventional:spider_man_miles_ps5");
loadTextures({
    "layer1": "unconventional:marvel/spider_man_miles_ps5_the_end_layer1",
    "layer2": "unconventional:marvel/spider_man_miles_ps5_the_end_layer2",
    "pants_boots": "unconventional:marvel/spider_man_miles_ps5_the_end_pants_boots",
    "pants_boots_chest": "unconventional:marvel/spider_man_miles_ps5_the_end_pants_boots_chest",
    "pants_chest": "unconventional:marvel/spider_man_miles_ps5_the_end_pants_chest",
    "chest": "unconventional:marvel/spider_man_miles_ps5_the_end_chest",
    "invis": "unconventional:marvel/spider_man_miles_ps5_the_end_invisible"
});

function init(renderer) {
    parent.init(renderer);
    renderer.setTexture((entity, renderLayer) => {
        if (renderLayer == "LEGGINGS") {
            return entity.getWornBoots().suitType() == $SUIT_NAME && entity.getWornChestplate().suitType() == $SUIT_NAME ? "pants_boots" : entity.getWornBoots().suitType() == $SUIT_NAME && entity.getWornChestplate().suitType() != $SUIT_NAME ? "pants_boots_chest" : entity.getWornBoots().suitType() != $SUIT_NAME && entity.getWornChestplate().suitType() == $SUIT_NAME ? "layer2" : "pants_chest";
        }
        else if (renderLayer == "CHESTPLATE") {
            return entity.getWornLeggings().suitType() == $SUIT_NAME ? "chest" : "layer1";
        } 
        return "layer1";
    });
}