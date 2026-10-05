extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "unconventional:dc/the_signal_comics_layer1",
    "layer2": "unconventional:dc/the_signal_comics_layer2",
    "lights": "unconventional:dc/the_signal_comics_lights",
    "escrimas": "unconventional:dc/signal_escrimas"
});

var utils = implement("fiskheroes:external/utils");

function init(renderer) {
    parent.init(renderer); 
    renderer.setLights((entity, renderLayer) => renderLayer == "HELMET" ? "lights" : null);
}

function initEffects(renderer) {
    renderer.bindProperty("fiskheroes:equipment_wheel").color.set(0xD19300);

    var chain = utils.bindCloud(renderer, "fiskheroes:telekinesis_chain", "fiskheroes:shadow_smoke");
    chain.anchor.set("rightArm");
    chain.setOffset(-0.5, 10.0, 0.0);
    chain.setFirstPerson(-4.75, 4.0, -8.5);

    utils.setOpacityWithData(renderer, 0, 1.0, "unconventional:dyn/invisible_float");

    utils.bindCloud(renderer, "fiskheroes:particle_cloud", "fiskheroes:shadow_smoke").setCondition(entity => entity.getData("fiskheroes:shadowform"));



    var model_escrima = renderer.createResource("MODEL", "unconventional:signalspikes");
    model_escrima.texture.set("escrimas");
    model_escrima.generateMirror();

    escrima = renderer.createEffect("fiskheroes:model").setModel(model_escrima);
    escrima.anchor.set("rightArm");
    escrima.setScale(1);
    escrima.mirror = true;

}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    addAnimation(renderer, "signal.ESCRIMA", "unconventional:signal_punch").setData((entity, data) => data.load(Math.max(entity.isPunching() && entity.getInterpolatedData("fiskheroes:blade"))))
    .setCondition(entity => (entity.getData("fiskheroes:blade") )).priority = -10;

    addAnimation(renderer, "signal.ESCRIMA_EQUIP", "unconventional:signal_escrima_equip").setData((entity, data) => data.load(entity.getInterpolatedData("fiskheroes:blade_timer")))
    .priority = -10;
	
}

function render(entity, renderLayer, isFirstPersonArm) {
    if (renderLayer == "CHESTPLATE") {
        if (entity.getData("fiskheroes:blade_timer") > 0.4) {
            var blade_anchor = escrima.anchor.set("rightArm");
            var blade_offSet = escrima.setOffset(0.775, 11.0, -21.0);
            var blade_rot = escrima.setRotation(95, 0, 0);
            
            escrima.anchor = blade_anchor, blade_offSet, blade_rot;
            escrima.render();
        }
        else {
            var back_anchor = escrima.anchor.set("body");
            var back_offSet = escrima.setOffset(-0.1, 22.0, 1.0);
            var back_rot = escrima.setRotation(15, 75, 160);

            escrima.anchor = back_anchor, back_offSet, back_rot;
            escrima.render();
        }
    }
}