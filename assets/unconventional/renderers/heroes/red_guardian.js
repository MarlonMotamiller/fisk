extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "unconventional:marvel/red_guardian_layer1",
    "layer2": "unconventional:marvel/red_guardian_layer2",
    "shield": "unconventional:marvel/red_guardian_shield"
});

function initEffects(renderer) {
    parent.initEffects(renderer);

    var equipped = renderer.bindProperty("fiskheroes:equipped_item");
    equipped.setItems([
        { "anchor": "body", "scale": 1.0, "offset": [0.0, 5.0, 2.75], "rotation": [90.0, -180.0, 0.0] }
    ]).slotIndex = 0;
    equipped.addOffset("QUIVER", -0.5, 0.0, 2.36);
    
    chest = renderer.createEffect("fiskheroes:chest");
    chest.setExtrude(0.5).setYOffset(5);

    var livery = renderer.bindProperty("fiskheroes:livery");
    livery.texture.set("shield");
    livery.weaponType = "SHIELD";
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);

    addAnimation(renderer, "red_guardian.THROW", "unconventional:shield_throw")
    .setData((entity, data) => {
        data.load(0, Math.max(entity.getInterpolatedData("unconventional:dyn/shield_throw_timer") - (entity.isPunching() || entity.getHeldItem().name() == "fiskheroes:captain_americas_shield" && entity.as("PLAYER").isBlocking()), 0));
    }).priority = -8;

    addAnimation(renderer, "shield.BLOCKING", "unconventional:aiming_shield_block")
    .setData((entity, data) => {
        data.load(entity.getHeldItem().name() == "fiskheroes:captain_americas_shield" && entity.as("PLAYER").isBlocking());
    });

    renderer.reprioritizeDefaultAnimation("PUNCH", -9);

}

function render(entity, renderLayer, isFirstPersonArm) {
    if (!isFirstPersonArm && renderLayer == "CHESTPLATE") {
        chest.render();
    }
}