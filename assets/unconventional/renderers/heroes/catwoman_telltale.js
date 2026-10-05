extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "unconventional:dc/catwoman_telltale_layer1",
    "layer2": "unconventional:dc/catwoman_telltale_layer2",
    "claws": "fiskheroes:black_panther_claws",
});

var chest;

function initEffects(renderer) {
    parent.initEffects(renderer);
    chest = renderer.createEffect("fiskheroes:chest");
    chest.setExtrude(1.0).setYOffset(1);

    overlay = renderer.createEffect("fiskheroes:overlay");
    overlay.texture.set("claws");

}

function render(entity, renderLayer, isFirstPersonArm) {
    if (renderLayer == "CHESTPLATE") {
        overlay.opacity = entity.getData("fiskheroes:blade");
        overlay.render();
    }
    if (!isFirstPersonArm) {
        chest.render();
    }
}
