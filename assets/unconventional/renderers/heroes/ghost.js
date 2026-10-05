extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "unconventional:marvel/ghost_layer1",
    "layer2": "unconventional:marvel/ghost_layer2",
    "lights": "unconventional:marvel/ghost_eyes"
});

var utils = implement("fiskheroes:external/utils");

var vibration;
var chest;

function init(renderer) {  
    parent.init(renderer); 
    renderer.setLights((entity, renderLayer) => renderLayer == "HELMET" ? "lights" : null);
}

function initEffects(renderer) {
    renderer.bindProperty("fiskheroes:opacity").setOpacity((entity, renderLayer) => {
        if (!entity.isDisplayStand() && (Math.random() < 0.25 && entity.isSprinting() || Math.random() < 0.3 && !entity.isOnGround() || Math.random() < 0.5 && entity.getData('fiskheroes:intangible') || Math.random() < 0.15 && entity.isPunching())) {
            return 0.4;
        }
        return 0.9999;
    });
	
    chest = renderer.createEffect("fiskheroes:chest");
    chest.setExtrude(0.95).setYOffset(1);
	
    vibration = renderer.createEffect("fiskheroes:vibration");
    vibration.includeEffects(chest);
	
    utils.bindTrail(renderer, "unconventional:ghost_gray").setCondition(entity => (entity.isWearingFullSuit() && entity.getData('fiskheroes:moving') && !entity.getData('fiskheroes:invisible')));

}

function initAnimations(renderer) {
    parent.initAnimations(renderer);

    addAnimation(renderer, "ghost.PUNCH", "unconventional:ghost/ghost_punching").setData((entity, data) => data.load(Math.max(entity.isPunching() && Math.random() < 0.05)))
    .priority = -10;
    addAnimation(renderer, "ghost.PUNCH1", "unconventional:ghost/ghost_punching1").setData((entity, data) => data.load(Math.max(entity.isPunching() && Math.random() < 0.05)))
    .priority = -10;
    addAnimation(renderer, "ghost.PUNCH2", "unconventional:ghost/ghost_punching2").setData((entity, data) => data.load(Math.max(entity.isPunching() && Math.random() < 0.05)))
    .priority = -10;
    addAnimation(renderer, "ghost.PUNCH3", "unconventional:ghost/ghost_punching3").setData((entity, data) => data.load(Math.max(entity.isPunching() && Math.random() < 0.05)))
    .priority = -10;
    addAnimation(renderer, "ghost.PUNCH4", "unconventional:ghost/ghost_punching4").setData((entity, data) => data.load(Math.max(entity.isPunching() && Math.random() < 0.05)))
    .priority = -10;



    addAnimation(renderer, "ghost.SPRINT", "unconventional:ghost/ghost_running").setData((entity, data) => data.load(Math.max(entity.isSprinting() && Math.random() < 0.05)))
    .priority = -10;
    addAnimation(renderer, "ghost.SPRINT1", "unconventional:ghost/ghost_running1").setData((entity, data) => data.load(Math.max(entity.isSprinting() && Math.random() < 0.05)))
    .priority = -10;
    addAnimation(renderer, "ghost.SPRINT2", "unconventional:ghost/ghost_running2").setData((entity, data) => data.load(Math.max(entity.isSprinting() && Math.random() < 0.05)))
    .priority = -10;

    addAnimation(renderer, "ghost.DISPLAY", "unconventional:ghost_pose1").setData((entity, data) => data.load(entity.as("DISPLAY").getDisplayType() == "HOLOGRAM"))
    .priority = -10;
    addAnimation(renderer, "ghost.DISPLAY2", "unconventional:ghost_pose1").setData((entity, data) => data.load(entity.as("DISPLAY").getDisplayType() == "DATABASE_PREVIEW"))
    .priority = -10;
}

function render(entity, renderLayer, isFirstPersonArm) {
	if (!isFirstPersonArm && renderLayer == "CHESTPLATE") {
        chest.render();
    }
    if (!entity.isDisplayStand() && Math.random() < 0.25) {
        vibration.render();
    }
}