extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "unconventional:dc/spoiler_comics_layer1",
    "layer2": "unconventional:dc/spoiler_comics_layer2",
    "cape": "unconventional:dc/spoiler_comics_cape",
    "tonfa": "unconventional:dc/spoiler_tonfa",

    "grapple_gun": "unconventional:dc/grappling_gun_spoiler",
    "grapple_gun_lights": "unconventional:dc/grapple_gun_lights_spoiler"
});

var utils = implement("fiskheroes:external/utils");
var capes = implement("fiskheroes:external/capes");

var cape;
var chest;

function init(renderer) {
    parent.init(renderer);
}

function initEffects(renderer) {
    var physics = renderer.createResource("CAPE_PHYSICS", null);
    physics.weight = 1.5;
    physics.maxFlare = 0.8;
    physics.flareDegree = 0.5;
    physics.flareFactor = 0.4;
    physics.flareElasticity = 5;

    cape = capes.createDefault(renderer, 19, "fiskheroes:cape_default.mesh.json", physics);
    cape.effect.texture.set("cape");
    cape.effect.width = 14;

    chest = renderer.createEffect("fiskheroes:chest");
    chest.setExtrude(0.95).setYOffset(1);


    utils.addLivery(renderer, "TONFA", "tonfa");

    var livery = renderer.bindProperty("fiskheroes:livery");
    livery.texture.set("grapple_gun", "grapple_gun_lights");
    livery.weaponType = "GRAPPLING_GUN";

    renderer.bindProperty("fiskheroes:equipment_wheel").color.set(0x41125E);

    renderer.bindProperty("fiskheroes:equipped_item").setItems([
        { "anchor": "rightLeg", "scale": 1.0, "offset": [-2.5, 1.0, 0.5], "rotation": [90.0, 180.0, -2.0] },
        { "anchor": "leftLeg", "scale": 1.0, "offset": [2.5, 1.0, 0.5], "rotation": [90.0, 180.0, 2.0] }
    ]).slotIndex = 0;
    renderer.bindProperty("fiskheroes:equipped_item").setItems([
        { "anchor": "body", "scale": 0.7, "offset": [-4.5, 10.5, 0.4], "rotation": [110.0, 5.0, 0.0] }
    ]).slotIndex = 1;
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);

    addAnimation(renderer, "batman_reeves.GRAPPLE", "unconventional:grapple_anim")
    .setData((entity, data) => {
        data.load(entity.getInterpolatedData("unconventional:dyn/grapple_timer"));
    });
}

function render(entity, renderLayer, isFirstPersonArm) {
    if (!isFirstPersonArm && renderLayer == "CHESTPLATE") {
        cape.render(entity);
        chest.render();
    }
}