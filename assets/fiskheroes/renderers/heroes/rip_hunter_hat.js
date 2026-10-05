extend("fiskheroes:rip_hunter");
loadTextures({
    "hat": "fiskheroes:rip_hunter_hat"
});

function init(renderer) {
    parent.init(renderer);
    renderer.setItemIcons("rip_hunter_0", "rip_hunter_1", "rip_hunter_2", "rip_hunter_3")
}

function initEffects(renderer) {
    renderer.bindProperty("fiskheroes:energy_bolt").color.set(0x005EFF);

    var model_hat = renderer.createResource("MODEL", "fiskheroes:rip_hunter_hat");
    model_hat.texture.set("hat");

    hat = renderer.createEffect("fiskheroes:model").setModel(model_hat);
    hat.setOffset(0, 0.0, 0);
    hat.anchor.set("head");
    hat.setScale(1.025);
}

function render(entity, renderLayer, isFirstPersonArm) {
    
    hat.render();
}