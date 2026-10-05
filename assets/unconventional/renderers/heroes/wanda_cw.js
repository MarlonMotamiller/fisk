extend("unconventional:wanda");
loadTextures({
	"hair": "unconventional:marvel/wanda/wanda_cw_hair",
    "chest": "unconventional:marvel/wanda/wanda_chest",
    "coat_hair": "unconventional:marvel/wanda/wanda_cw_coat_hair",
    "pants": "unconventional:marvel/wanda/wanda_pants",
    "pants_coat": "unconventional:marvel/wanda/wanda_pants_coat",
    "boots": "unconventional:marvel/wanda/wanda_boots"
});

function init(renderer) {
    parent.init(renderer);
    renderer.setTexture((entity, renderLayer) => {
        if (renderLayer == "CHESTPLATE") {
            return entity.getWornHelmet().suitType() == $SUIT_NAME ? "coat_hair" : "chest";
        }
        else if (renderLayer == "LEGGINGS") {
            return entity.getWornChestplate().suitType() == $SUIT_NAME ? "pants_coat" : "pants";
        }
        return renderLayer == "HELMET" ? "hair" : "boots"
    });

    renderer.showModel("HELMET", "head", "body");
    
    renderer.showModel("CHESTPLATE", "body", "rightArm", "leftArm", "rightLeg", "leftLeg");

    renderer.setItemIcon("CHESTPLATE", "wanda_1");
    renderer.setItemIcon("LEGGINGS", "wanda_2");
    renderer.setItemIcon("BOOTS", "wanda_3");
}