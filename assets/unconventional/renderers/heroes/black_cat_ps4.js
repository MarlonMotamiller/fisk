extend("fiskheroes:spider_man_base");
loadTextures({
    "layer1": "unconventional:marvel/black_cat_ps4_layer1",
    "layer2": "unconventional:marvel/black_cat_ps4_layer2",
    "ponytail": "unconventional:marvel/black_cat_ponytail_texture",
    "rope": "unconventional:marvel/black_cat_ps4_rope",
    "grapple": "unconventional:marvel/black_cat_ps4_rope_grab",
    "claws": "unconventional:marvel/black_cat_claws"
});

var utils = implement("fiskheroes:external/utils");

var chest;
var ponytail;

function init(renderer) {
    parent.init(renderer);

}

function initEffects(renderer) {
    var model_ponytail = renderer.createResource("MODEL", "unconventional:black_cat_ponytail");
    model_ponytail.texture.set("ponytail");
    model_ponytail.bindAnimation("unconventional:ponytail").setData((entity, data) => {
        data.load(0, 1);
    });
    ponytail = renderer.createEffect("fiskheroes:model").setModel(model_ponytail);
    ponytail.anchor.set("head");

    chest = renderer.createEffect("fiskheroes:chest");
    chest.setExtrude(1.0).setYOffset(1);

    overlay = renderer.createEffect("fiskheroes:overlay");
    overlay.texture.set("claws");

    var webs = renderer.bindProperty("fiskheroes:webs");
    webs.textureRope.set("rope");
    webs.textureRopeBase.set("grapple");

}

function initAnimations(renderer) {


    utils.addAnimationEvent(renderer, "WEBSWING_DIVE", [
        "fiskheroes:swing_dive",
        "unconventional:black_cat_ps4/dive_1"
    ]);
    utils.addAnimationEvent(renderer, "WEBSWING_DEFAULT", [
        "fiskheroes:swing_default"
    ]);
    utils.addAnimationEvent(renderer, "WEBSWING_TRICK_DEFAULT", [
        "fiskheroes:swing_roll"
    ]);
    utils.addAnimationEvent(renderer, "WEBSWING_RIGHT", [
        "unconventional:swing_right2"
    ]);
    utils.addAnimationEvent(renderer, "WEBSWING_TRICK_RIGHT", [
        "fiskheroes:swing_rotate_right"
    ]);
    utils.addAnimationEvent(renderer, "WEBSWING_LEFT", [
        "unconventional:swing_left2"
    ]);
    utils.addAnimationEvent(renderer, "WEBSWING_TRICK_LEFT", [
        "fiskheroes:swing_rotate_left"
    ]);



    renderer.reprioritizeDefaultAnimation("PUNCH", -9);
    renderer.reprioritizeDefaultAnimation("AIM_BOW", -9);
}

function render(entity, renderLayer, isFirstPersonArm) {
    if (renderLayer == "HELMET") {
        ponytail.render();

    }
    if (renderLayer == "CHESTPLATE") {
        overlay.opacity = entity.getData("fiskheroes:blade");
        overlay.render();
    }
    if (!isFirstPersonArm) {
        chest.render();
    }
}