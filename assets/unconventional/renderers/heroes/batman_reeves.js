extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "unconventional:dc/the_batman_layer1",
    "layer2": "unconventional:dc/the_batman_layer2",
    "compressed": "unconventional:dc/the_batman_compressed",
    "cape": "unconventional:dc/the_batman_cape",
    "ears": "unconventional:dc/the_batman_ears",
    "wingsuit": "unconventional:dc/the_batman_wingsuit",
    "wings": "unconventional:dc/the_batman_wings",

    "grapple_gun": "unconventional:dc/grappling_gun_reeves"
});

var utils = implement("fiskheroes:external/utils");
var capes = implement("fiskheroes:external/capes");
var cape;

function init(renderer) {
    parent.init(renderer);

    renderer.setTexture((entity, renderLayer) => {
        if (entity.getData('unconventional:dyn/wingsuit_timer') >= 0.8) {
	        return "compressed";
        }
        return renderLayer == "LEGGINGS" ? "layer2" : "layer1";
    });
}

function initEffects(renderer) {
    wings = renderer.createEffect("fiskheroes:wingsuit");
    wings.texture.set("wings");

    var livery = renderer.bindProperty("fiskheroes:livery");
    livery.texture.set("grapple_gun");
    livery.weaponType = "GRAPPLING_GUN";

    var physics = renderer.createResource("CAPE_PHYSICS", null);
    physics.weight = 1.5;
    physics.maxFlare = 0.9;
    physics.flareDegree = 0.5;
    physics.flareFactor = 0.4;
    physics.flareElasticity = 5;

    cape = capes.createDefault(renderer, 23, "fiskheroes:cape_default.mesh.json", physics);
    cape.effect.texture.set("cape");
    cape.effect.width = 14;

    renderer.bindProperty("fiskheroes:equipment_wheel").color.set(0x870002);

    //Ears
    bat_ears = renderer.createEffect("fiskheroes:model").setModel(utils.createModel(renderer, "unconventional:batman_ears", "ears"));
    bat_ears.setOffset(0, -24.4, 0);
    bat_ears.anchor.set("head");

    renderer.bindProperty("fiskheroes:equipped_item").setItems([
        { "anchor": "rightArm", "scale": 0.4, "offset": [0.635, 6.0, 0.0], "rotation": [90.0, 0.0, 0.0] },
        { "anchor": "leftArm", "scale": 0.4, "offset": [-0.635, 6.0, 0.0], "rotation": [90.0, 0.0, 0.0] }
    ]).slotIndex = 0;
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);

    // renderer.removeCustomAnimation("basic.AIMING");
    // addAnimation(renderer, "basic.AIMING", "unconventional:aiming_binoculars")
    // .setData((entity, data) => {
    //     data.load(Math.max(entity.getInterpolatedData("fiskheroes:aiming_timer"), entity.getHeldItem().name() == "fisktag:weapon"));
    // })
    // .priority = -9;

    addAnimation(renderer, "batman_reeves.GRAPPLE", "unconventional:grapple_anim")
    .setData((entity, data) => {
        data.load(entity.getInterpolatedData("unconventional:dyn/grapple_timer"));
    });
}

function render(entity, renderLayer, isFirstPersonArm) {
    if (!isFirstPersonArm && renderLayer == "HELMET") {
        bat_ears.render();
    }
    if (renderLayer == "CHESTPLATE") {
        cape.render(entity);

    }
}