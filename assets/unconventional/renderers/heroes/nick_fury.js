extend("fiskheroes:hero_basic");
loadTextures({
	"eyepatch": "unconventional:marvel/nick_fury_eyepatch",
    "jacket_and_boots": "unconventional:marvel/nick_fury_jacket",
    "coat": "unconventional:marvel/nick_fury_coat",
    "pants": "unconventional:marvel/nick_fury_pants",
    "pants_jacket": "unconventional:marvel/nick_fury_pants_jacket",
    "boots": "unconventional:marvel/nick_fury_boots"
});

var utils = implement("fiskheroes:external/utils");

var coatRightLeg;
var coatLeftLeg;

function init(renderer) {
    parent.init(renderer);
    renderer.setTexture((entity, renderLayer) => {
        if (renderLayer == "HELMET") {
            return "eyepatch";
        }
        else if (renderLayer == "LEGGINGS") {
            return entity.getWornChestplate().suitType() == $SUIT_NAME ? "pants_jacket" : "pants";
        }
        if (renderLayer == "BOOTS") {
            return "boots";
        }
        return "jacket_and_boots";
    });

    renderer.fixHatLayer("HELMET", "CHESTPLATE");

    renderer.showModel("HELMET", "head");
    renderer.showModel("CHESTPLATE", "head", "body", "rightArm", "leftArm", "rightLeg", "leftLeg");
}

function initEffects(renderer) {
    parent.initEffects(renderer);
    coatRightLeg = renderer.createEffect("fiskheroes:model").setModel(utils.createModel(renderer, "unconventional:coat_rightLeg", "coat"));
    coatRightLeg.anchor.set("rightLeg");
    coatLeftLeg = renderer.createEffect("fiskheroes:model").setModel(utils.createModel(renderer, "unconventional:coat_leftLeg", "coat"));
    coatLeftLeg.anchor.set("leftLeg");
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);   
}

function render(entity, renderLayer, isFirstPersonArm) {
	if (renderLayer == "CHESTPLATE") {
		coatRightLeg.render();
		coatLeftLeg.render();
    }
}