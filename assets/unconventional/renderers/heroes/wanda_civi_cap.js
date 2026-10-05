extend("unconventional:wanda");
loadTextures({
	"hair": "unconventional:marvel/wanda/wanda_cw_cap_hair",
    "chest": "unconventional:marvel/wanda/wanda_civi_chest",
	"coat": "unconventional:null",
    "coat_hair": "unconventional:marvel/wanda/wanda_civi_jacket_hair",
    "pants": "unconventional:marvel/wanda/wanda_civi_pants",
    "pants_coat": "unconventional:marvel/wanda/wanda_civi_pants_jacket",
    "boots": "unconventional:marvel/wanda/wanda_civi_boots",
    "cap": "unconventional:marvel/wanda/wanda_cap"
});

var cap;

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

    renderer.setItemIcon("CHESTPLATE", "wanda_civi_1");
    renderer.setItemIcon("LEGGINGS", "wanda_civi_2");
    renderer.setItemIcon("BOOTS", "wanda_civi_3");
}

function initEffects(renderer) {
    parent.initEffects(renderer);

    cap = renderer.createEffect("fiskheroes:model");
    cap.setModel(utils.createModel(renderer, "unconventional:wanda_cap", "cap"));
    cap.anchor.set("head");

}

function render(entity, renderLayer, isFirstPersonArm) {
    parent.render(entity, renderLayer, isFirstPersonArm);
    
    if (renderLayer == "HELMET") {
        cap.render();
    }
}