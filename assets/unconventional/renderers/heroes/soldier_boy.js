extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "unconventional:other/soldier_boy_layer1",
    "layer2": "unconventional:other/soldier_boy_layer2",
    "chest": "unconventional:other/soldier_boy_chest"
});

var utils = implement("fiskheroes:external/utils");

var overlay;
var chest_beam;

function init(renderer) {
    parent.init(renderer);
}

function initEffects(renderer) {
    parent.initEffects(renderer);
    
    overlay = renderer.createEffect("fiskheroes:overlay");
    overlay.texture.set(null, "chest");

    chest_beam = utils.createLines(renderer, "unconventional:sb_chest", 0xF43E00, [
        {"start": [0, 0.0, 0.1], "end": [0.0, 0.0, -0.05], "size": [8.0, 6.0]},
    ]);
    chest_beam.anchor.set("body");
    chest_beam.setOffset(0.0, 3.5, -2.0).setRotation(0.0, 0.0, 0.0).setScale(16.0, 16.0, 16.0);
    chest_beam.mirror = false;

    var equipped = renderer.bindProperty("fiskheroes:equipped_item");
    equipped.setItems([
        { "anchor": "body", "scale": 1.0, "offset": [0.0, 5.0, 2.75], "rotation": [0.0, 0.0, 0.0] }
    ]).slotIndex = 0;
    equipped.addOffset("QUIVER", -0.5, 0.0, 2.36);

    renderer.bindProperty("fiskheroes:equipped_item").setItems([
        { "anchor": "rightLeg", "scale": 0.6, "offset": [-2.4, 0.0, 1.25], "rotation": [90.0, 0.0, 0.0] }
    ]).slotIndex = 1;

    utils.bindBeam(renderer, "fiskheroes:charged_beam", "unconventional:soldier_boy_beam", "body", getBeamColor(), [
        { "firstPerson": [0.0, 7.0, 0.0], "offset": [0.0, 3.5, -2.0], "size": [7.0, 6.0] }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_charged_beam"));
}

function getBeamColor() {
    return 0xF43E00;
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);

}

function render(entity, renderLayer, isFirstPersonArm) {
    if (renderLayer == "CHESTPLATE") {
		
        chest_beam.progress = entity.getInterpolatedData("fiskheroes:beam_charge");
        chest_beam.opacity = entity.getInterpolatedData("fiskheroes:beam_charge");
        chest_beam.render();

        overlay.opacity = entity.getInterpolatedData("fiskheroes:beam_charge");
        overlay.render();
    }
}
