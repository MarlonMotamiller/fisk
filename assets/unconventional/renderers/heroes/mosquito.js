extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "unconventional:null",
    "layer2": "unconventional:null",
	"mosquito": "unconventional:other/mosquito",
	"lights": "unconventional:null"
});

var utils = implement("fiskheroes:external/utils");

var fpAnimations = false;

function init(renderer) {
    parent.init(renderer);
    renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm");
    renderer.fixHatLayer("CHESTPLATE");
}

function animationData(entity, data) {
	var flight_timer = entity.getInterpolatedData("fiskheroes:flight_timer");
	data.load(0, flight_timer);
	data.load(1, entity.getInterpolatedData("fiskheroes:flight_boost_timer"));
	data.load(3, entity.loop(1) * flight_timer);
	data.load(4, entity.loop(20));
	data.load(5, entity.loop(40));
	data.load(6, entity.getInterpolatedData("fiskheroes:levitate_timer"));
	data.load(7, entity.loop(20 * Math.PI) + 0.4);
	data.load(8, entity.getHeldItem().isEmpty() ? 0 : 1);
	data.load(9, entity.getHeldItem().doesNeedTwoHands() ? 1 : 0);
	data.load(10, entity.getInterpolatedData("fiskheroes:aiming_timer"));
	data.load(12, fpAnimations ? 1 : 0);
}

function initEffects(renderer) {
	var mosquito_model = renderer.createResource("MODEL", "unconventional:mosquito_bodyv2");
	mosquito_model.bindAnimation("unconventional:mosquito/mosquito.anim.json").setData(animationData).priority = -1;
	mosquito_model.texture.set("mosquito");
	mosquito = renderer.createEffect("fiskheroes:model").setModel(mosquito_model);
	mosquito.anchor.set("body");
	
	var mosquito_model_head = renderer.createResource("MODEL", "unconventional:mosquito_headv2");
	mosquito_model_head.bindAnimation("unconventional:mosquito/mosquito.anim.json").setData(animationData).priority = -1;
	mosquito_model_head.texture.set("mosquito", "lights");
	mosquito_head = renderer.createEffect("fiskheroes:model").setModel(mosquito_model_head);
	mosquito_head.anchor.set("head");
	
	utils.setOpacity(renderer, 0.999, 1.0, 1);
	
	utils.bindBeam(renderer, "fiskheroes:energy_blast", "unconventional:weapon_bullet", "head", 0x7F0000, [
        { "firstPerson": [0.0, 3.75, -7.0], "offset": [-0.0, 0.0, 0.0], "size": [0.0, 0.0] }
    ]);
	
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
	renderer.removeCustomAnimation("basic.BLOCKING");
	renderer.removeCustomAnimation("basic.ENERGY_PROJ");
    renderer.removeCustomAnimation("basic.AIMING");
    addAnimationWithData(renderer, "basic.AIMING", "fiskheroes:aiming", "fiskheroes:aiming_timer")
        .priority = 10;	
    addAnimation(renderer, "mosquito.FLIGHT", "unconventional:flight/mosquito.anim.json")
        .setData((entity, data) => {
            data.load(0, entity.getInterpolatedData("fiskheroes:flight_timer"));
			data.load(1, entity.getInterpolatedData("fiskheroes:flight_boost_timer"));
			data.load(2, entity.getInterpolatedData("fiskheroes:scale")*1.25);
        })
        .priority = -10;
		
	 addAnimation(renderer, "mosquito.PLAYERPOS", "unconventional:mosquito/mosquito_player_body")
        .setData((entity, data) => {
            data.load(0, 1);
			data.load(1, entity.getHeldItem().isEmpty() ? 0 : 1);
			data.load(2, entity.getHeldItem().doesNeedTwoHands() ? 1 : 0);
			data.load(3, entity.isSneaking());
			data.load(4, entity.getInterpolatedData('fiskheroes:flight_timer'));
        });
    renderer.reprioritizeDefaultAnimation("PUNCH", -9);
    renderer.reprioritizeDefaultAnimation("AIM_BOW", -9);
}

function render(entity, renderLayer, isFirstPersonArm) {
	fpAnimations = isFirstPersonArm;
	mosquito_head.anchor.ignoreAnchor(isFirstPersonArm);

	mosquito.render();
	mosquito_head.setOffset(0.0, 0.0, 0.0);

    var book_preview = entity.as("DISPLAY").getDisplayType() == "BOOK_PREVIEW";
    var display_stand = entity.as("DISPLAY").getDisplayType() == "DISPLAY_STAND";
    var database_preview = entity.as("DISPLAY").getDisplayType() == "DATABASE_PREVIEW";
	var fabricator_preview = entity.as("DISPLAY").getDisplayType() == "FABRICATOR_PREVIEW";
	var fabricator_result = entity.as("DISPLAY").getDisplayType() == "FABRICATOR_RESULT";
    var hologram = entity.as("DISPLAY").getDisplayType() == "HOLOGRAM";
	var iterator_preview = entity.as("DISPLAY").getDisplayType() == "ITERATOR_PREVIEW";

	if (book_preview || display_stand || database_preview || fabricator_preview || fabricator_result || iterator_preview) {
		mosquito_head.setOffset(0.0, 10.0, -4.35);
    }
	mosquito_head.render();
}
