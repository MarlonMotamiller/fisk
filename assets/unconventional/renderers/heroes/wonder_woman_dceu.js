extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "unconventional:dc/wonder_woman_dceu_layer1",
    "layer2": "unconventional:dc/wonder_woman_dceu_layer2",
    "hair": "unconventional:dc/wonder_woman_dceu_hair",
    "chest": "unconventional:dc/wonder_woman_dceu_chest",
    "lasso": "unconventional:dc/lasso_of_truth",
    "lasso_lights": "unconventional:dc/lasso_of_truth_lights",

    "shield": "unconventional:dc/wonder_woman_dceu_shield",
    "arrow": "fiskheroes:arrow/prometheus",
    "quiver": "unconventional:marvel/quiver/taskmaster_comics_quiver",
	
	"web_rope": "unconventional:dc/web/lasso_rope",
	"null": "unconventional:null"
});

var utils = implement("fiskheroes:external/utils");

var chest;
var lasso;
var lasso_glow;

function init(renderer) {
    parent.init(renderer);
    renderer.setTexture((entity, renderLayer) => {
        if (renderLayer == "CHESTPLATE") {
            return entity.getWornHelmet().suitType() == $SUIT_NAME ? "layer1" : "chest";
        }
        return renderLayer == "HELMET" ? "hair" : renderLayer == "LEGGINGS" ? "layer2" : "layer1";
    });

    renderer.showModel("HELMET", "head", "headwear", "body");
}


function initEffects(renderer) {
	var webs = renderer.bindProperty("fiskheroes:webs");
	webs.textureRope.set(null, "web_rope");
	webs.textureRopeBase.set("null");
	
	chest = renderer.createEffect("fiskheroes:chest");
    chest.setExtrude(1).setYOffset(1);
	
	lasso = renderer.createEffect("fiskheroes:model").setModel(utils.createModel(renderer, "unconventional:lasso_of_truth", "lasso"));
	lasso_glow = renderer.createEffect("fiskheroes:model").setModel(utils.createModel(renderer, "unconventional:lasso_of_truth", null, "lasso_lights"));
	
	utils.bindParticles(renderer, "unconventional:ww_charged_beam").setCondition(entity => entity.getData('fiskheroes:beam_shooting_timer')==1);
	
	var trail = renderer.bindProperty("fiskheroes:trail");
    trail.setTrail(renderer.createResource("TRAIL", "unconventional:wonder_woman_dceu"));
    trail.setCondition(entity => entity.getData("fiskheroes:speeding"));
	
	///camera_shake
	var shake = renderer.bindProperty("fiskheroes:camera_shake").setCondition(entity => {
		shake.intensity = 0.0;
        shake.factor = entity.getData("fiskheroes:beam_shooting_timer")==1 ? 4*entity.getInterpolatedData('fiskheroes:beam_charge'): entity.getData('fiskheroes:beam_charging') ? 0.2*entity.getInterpolatedData('fiskheroes:beam_charge') : 0.2*entity.getInterpolatedData('unconventional:dyn/shield_timer');
        return true;
    });
	
	///BEAMS
    utils.bindBeam(renderer, "fiskheroes:charged_beam", "unconventional:ww_charged_beam", "body", 0xFFAD60, [
        { "firstPerson": [0.0, 4.0, 0.0], "offset": [0.0, 3.0, -2.0], "size": [20.0, 20.0] }
    ]);

    utils.addLivery(renderer, "SHIELD", "shield");
    utils.addLivery(renderer, "ARROW", "arrow");
    utils.addLivery(renderer, "QUIVER", "quiver");

    var equipped = renderer.bindProperty("fiskheroes:equipped_item");
	
	renderer.bindProperty("fiskheroes:equipped_item").setItems([
        { "anchor": "leftArm", "scale": 1.0, "offset": [3.0, 6.5, 0], "rotation": [0.0, 180.0, 98.0] }
    ]).setCondition(entity =>  entity.getHeldItem().name() == 'fisktag:weapon' && (entity.getHeldItem().nbt().getString('WeaponType') == 'unconventional:wonder_woman_dceu_sword') && !entity.as('PLAYER').isUsingItem()).slotIndex = 0;
	
	renderer.bindProperty("fiskheroes:equipped_item").setItems([
        { "anchor": "leftArm", "scale": 1.0, "offset": [3.0, 8.0, -1], "rotation": [-5.0, 205.0, 115.0] }
    ]).setCondition(entity =>  entity.getHeldItem().name() == 'fisktag:weapon' && (entity.getHeldItem().nbt().getString('WeaponType') == 'unconventional:wonder_woman_dceu_sword') && entity.as('PLAYER').isUsingItem()).slotIndex = 0;
	
    renderer.bindProperty("fiskheroes:equipped_item").setItems([
        { "anchor": "body", "scale": 1.0, "offset": [0.0, 5.0, 2.75], "rotation": [90.0, -180.0, 0.0] }
    ]).addOffset("QUIVER", -0.5, 0.0, 2.36).setCondition(entity => entity.getHeldItem().isEmpty() || (entity.getHeldItem().nbt().getString('WeaponType') != 'unconventional:wonder_woman_dceu_sword')).slotIndex = 0;

    renderer.bindProperty("fiskheroes:equipped_item").setItems([
        { "anchor": "body", "scale": 0.6, "offset": [5.25, 9.0, -3.75], "rotation": [-135.0, -10.0, 0.0] }
    ]).slotIndex = 1;
	
	renderer.bindProperty("fiskheroes:equipped_item").setItems([
        { "anchor": "body", "scale": 0.7, "offset": [-4.5, 10.5, 0.0], "rotation": [5.0, 5.0, 5.0] }
    ]).slotIndex = 2;

}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
	renderer.removeCustomAnimation("basic.BLOCKING");
	renderer.removeCustomAnimation("basic.CHARGED_BEAM");
    
	addAnimation(renderer, "ww.BLOCKING", "unconventional:ww_blocking").setData((entity, data) => {
		var shield_timer = entity.getInterpolatedData('fiskheroes:shield_timer')
        data.load(0, shield_timer*entity.getInterpolatedData('unconventional:dyn/shield_1_timer'));
        data.load(1, shield_timer*entity.getInterpolatedData('unconventional:dyn/shield_2_timer'));
        data.load(2, shield_timer*entity.getInterpolatedData('unconventional:dyn/shield_3_timer'));
        data.load(3, shield_timer*entity.getInterpolatedData('unconventional:dyn/shield_4_timer'));
        data.load(4, shield_timer*entity.getInterpolatedData('unconventional:dyn/shield_5_timer'));
        data.load(5, shield_timer*entity.getInterpolatedData('unconventional:dyn/shield_6_timer'));
        data.load(6, shield_timer*entity.getInterpolatedData('unconventional:dyn/shield_7_timer'));
        data.load(7, shield_timer*entity.getInterpolatedData('unconventional:dyn/shield_8_timer'));
    }).priority = -12;
	
	addAnimation(renderer, "ww.CHARGED_BEAM", "unconventional:ww_charged_beam").setData((entity, data) => {
        data.load(0, entity.getData('fiskheroes:beam_charging') ? entity.getInterpolatedData('fiskheroes:beam_charge') : 0);
        data.load(1, entity.getInterpolatedData('unconventional:dyn/shield_timer'));
    }).priority = -12;
	
	addAnimation(renderer, "ww.FLIGHT", "fiskheroes:flight/martian_comics.anim.json")
        .setData((entity, data) => {
			
            data.load(0, entity.getInterpolatedData("fiskheroes:flight_timer"));
			data.load(1, entity.getInterpolatedData("fiskheroes:flight_boost_timer"));
        })
        .priority = -10;

    addAnimation(renderer, "ww.THROW", "unconventional:shield_throw")
    .setData((entity, data) => {
        data.load(0, Math.max(entity.getInterpolatedData("unconventional:dyn/shield_throw_timer") - (entity.isPunching() || entity.getHeldItem().name() == "fiskheroes:captain_americas_shield" && entity.as("PLAYER").isBlocking()), 0));
    }).priority = -8;

    addAnimation(renderer, "ww.LEFT_BLOCKING", "unconventional:blocking_left").setData((entity, data) => {
        data.load(entity.getHeldItem().name() == 'fisktag:weapon' && entity.getHeldItem().nbt().getString('WeaponType') == 'unconventional:wonder_woman_dceu_sword' && entity.as('PLAYER').isUsingItem() ? 1 : 0);
    }).priority = -12;

    addAnimation(renderer, "shield.BLOCKING", "unconventional:aiming_shield_block")
    .setData((entity, data) => {
        data.load(entity.getHeldItem().name() == "fiskheroes:captain_americas_shield" && entity.as("PLAYER").isBlocking());
    });

    addAnimation(renderer, "shield.BLOCKING.LEFT", "unconventional:aiming_shield_block_left").setData((entity, data) => {
        data.load(entity.getHeldItem().name() == 'fisktag:weapon' && entity.getHeldItem().nbt().getString('WeaponType') == 'unconventional:taskmastersword' && entity.as('PLAYER').isUsingItem() ? 1 : 0);
    });
	
	addAnimation(renderer, "ww.LASSO", "unconventional:bloodsport_gun_player").setData((entity, data) => {
		data.load(0, entity.getInterpolatedData("unconventional:dyn/weapon1_timer"));
	}).priority = -13;
	
	utils.addAnimationEvent(renderer, "WEBSWING_DEFAULT", "fiskheroes:swing_default");
    utils.addAnimationEvent(renderer, "WEBSWING_RIGHT", "fiskheroes:swing_default");
    utils.addAnimationEvent(renderer, "WEBSWING_LEFT", "fiskheroes:swing_default");
	
}

function render(entity, renderLayer, isFirstPersonArm) {
    if (renderLayer == "CHESTPLATE") {
        if (!isFirstPersonArm) {
            chest.render();
        }
		if (entity.getData('fiskheroes:web_swinging')) {
			lasso.anchor.set("rightArm");	
			lasso.setOffset(1, 8.5, 0).setRotation(0, 0, 0);
			lasso_glow.anchor.set("rightArm");	
			lasso_glow.setOffset(1, 8.5, 0).setRotation(0, 0, 0);
		}
		else {
			lasso.anchor.set("body");
			lasso.setOffset(4.5, 10.5, 0.0).setRotation(5, 5, 5);
			lasso_glow.anchor.set("body");
			lasso_glow.setOffset(4.5, 10.5, 0.0).setRotation(5, 5, 5);
		}
		lasso.render();
		lasso_glow.opacity = entity.getData('fiskheroes:web_swinging') ? 1 : 0;
		lasso_glow.render();
    }
}