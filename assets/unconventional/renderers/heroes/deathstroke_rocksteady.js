extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "unconventional:dc/deathstroke_rocksteady_layer1",
    "layer2": "unconventional:dc/deathstroke_rocksteady_layer2",
    "sheath": "fiskheroes:prometheus_sheath",
    "chokuto": "unconventional:dc/deathstroke_rocksteady_chokuto",
    "gun": "fiskheroes:deathstroke_dceu_gun",
    "ammo_bag": "fiskheroes:deathstroke_dceu_ammo_bag",

    "grapple_gun": "unconventional:dc/grappling_gun_rocksteady",
    "grapple_gun_lights": "unconventional:dc/grapple_rocksteady_lights_deathstroke"
});

var utils = implement("fiskheroes:external/utils");

var sheath;
var sheath1;

function init(renderer) {
    parent.init(renderer);
    
}

function initEffects(renderer) {
    parent.initEffects(renderer);
    
    sheath = renderer.createEffect("fiskheroes:model");
    sheath.setModel(utils.createModel(renderer, "fiskheroes:prometheus_sheath", "sheath"));
    sheath.anchor.set("body");
    sheath.setOffset(0.8, -1.0, 5.0).setRotation(0.0, 180.0, 0.0);

    sheath1 = renderer.createEffect("fiskheroes:model");
    sheath1.setModel(utils.createModel(renderer, "fiskheroes:prometheus_sheath", "sheath"));
    sheath1.anchor.set("body");
    sheath1.setOffset(2.1, -1.0, 5.0).setRotation(0.0, 180.0, 0.0);

    utils.addLivery(renderer, "CHOKUTO", "chokuto");
    utils.addLivery(renderer, "DESERT_EAGLE", "gun");
    utils.addLivery(renderer, "AMMO_BAG", "ammo_bag");
    
    var livery = renderer.bindProperty("fiskheroes:livery");
    livery.texture.set("grapple_gun", "grapple_gun_lights");
    livery.weaponType = "GRAPPLING_GUN";

    renderer.bindProperty("fiskheroes:equipment_wheel").color.set(0xB2603B);

    renderer.bindProperty("fiskheroes:equipped_item").setItems([
        { "anchor": "body", "scale": 0.535, "offset": [2.90, 0.38, 2.6], "rotation": [150.0, 90.0, 0.0] }
    ]);
    renderer.bindProperty("fiskheroes:equipped_item").setItems([
        { "anchor": "body", "scale": 0.535, "offset": [4.25, 0.28, 2.6], "rotation": [150.0, 90.0, 0.0] }
    ]).slotIndex = 1;
    renderer.bindProperty("fiskheroes:equipped_item").setItems([
        { "anchor": "rightLeg", "scale": 0.7, "offset": [-2.4, 0.5, 1.25], "rotation": [90.0, 0.0, 0.0] }
    ]).slotIndex = 2;
    renderer.bindProperty("fiskheroes:equipped_item").setItems([
        { "anchor": "body", "scale": 0.6, "offset": [-3.0, 1.25, 3.0], "rotation": [12.0, 90.0, 0.0] }
    ]).slotIndex = 3;
    renderer.bindProperty("fiskheroes:equipped_item").setItems([
        { "anchor": "body", "scale": 0.7, "offset": [4.5, 10.5, 0.4], "rotation": [110.0, 5.0, 0.0] }
    ]).slotIndex = 4;
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);

    addAnimation(renderer, "deathstroke_rocksteady.SLIDE", "unconventional:ground_slide")
    .setData((entity, data) => {
        data.load(entity.getInterpolatedData("unconventional:dyn/sliding_timer") / 2);
    });

    addAnimation(renderer, "deathstroke_rocksteady.GRAPPLE", "unconventional:grapple_anim")
    .setData((entity, data) => {
        data.load(entity.getInterpolatedData("unconventional:dyn/grapple_timer"));
    });
}

function render(entity, renderLayer, isFirstPersonArm) {
    if (!isFirstPersonArm && renderLayer == "CHESTPLATE") {
        sheath.render();
        sheath1.render();
    }
}
