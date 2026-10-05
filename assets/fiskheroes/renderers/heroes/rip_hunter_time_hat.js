extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "fiskheroes:rip_hunter_time_master",
    "layer2": "fiskheroes:rip_hunter_pants",
    "hat": "fiskheroes:rip_hunter_hat"
});

function init(renderer) {
    parent.init(renderer);
    renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm");
    renderer.setItemIcons("rip_hunter_0", "rip_hunter_time_master_1", "rip_hunter_2", "rip_hunter_3")
    renderer.fixHatLayer("CHESTPLATE");
}

function initEffects(renderer) {
    var model_hat = renderer.createResource("MODEL", "fiskheroes:rip_hunter_hat");
    model_hat.texture.set("hat");

    hat = renderer.createEffect("fiskheroes:model").setModel(model_hat);
    hat.setOffset(0, 0.0, 0);
    hat.anchor.set("head");
    hat.setScale(1.025);

    renderer.bindProperty("fiskheroes:energy_bolt").color.set(0x005EFF);
    renderer.bindProperty("fiskheroes:equipped_item").setItems([
        { "anchor": "rightLeg", "scale": 0.325, "offset": [-2.0, 0.0, 1.5], "rotation": [90.0, 0.0, -7.0] }
    ]);
}

function render(entity, renderLayer, isFirstPersonArm) {
    
    hat.render();
}
