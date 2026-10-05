extend("fiskheroes:spider_man_base");
loadTextures({
    "layer1": "unconventional:marvel/spider_man_miles_sv_layer1",
    "layer2": "unconventional:marvel/spider_man_miles_sv_layer2",
    "invis": "unconventional:marvel/spider_man_miles_sv_invisible"
});

var utils = implement("fiskheroes:external/utils");

var spell_venom_punch_arms;
var spell_venom_boost_arms;

var venom_arms;

function init(renderer) {
    parent.init(renderer);

    renderer.setTexture((entity, renderLayer) => {
        if (renderLayer == "HELMET" && (entity.isDisplayStand() || entity.isBookPlayer() ? entity.getData("fiskheroes:mask_open") : entity.getData("fiskheroes:mask_open_timer2") > 0.35)) {
            return "layer2";
        }
        return renderLayer == "LEGGINGS" ? "layer2" : "layer1";
    });
}

function initEffects(renderer) {

renderer.bindProperty("fiskheroes:equipment_wheel").color.set(0x00BFFF);

//Venom Punch Beams
var venom_punch = renderer.createResource("BEAM_RENDERER", "unconventional:venom_punch");
var venom_hands = renderer.createResource("BEAM_RENDERER", "unconventional:venom_arms");

utils.setOpacityWithData(renderer, 0.1, 1.0, "fiskheroes:invisibility_timer");

overlay = renderer.createEffect("fiskheroes:overlay");
overlay.texture.set("invis");

//Venom Punch
spell_venom_punch_arms = utils.createLines(renderer, venom_punch, 0x00CBFF, [
    //Front
    {"start": [1.0, 1.0, -2.65], "end": [-1.2, 5.5, -2.65], "size": [12.0, 12.0]},
    {"start": [1.0, 1.0, -2.65], "end": [-2.5, 3.0, -2.65], "size": [10.0, 10.0]},
    {"start": [-1.2, 5.5, -2.65], "end": [0.5, 8.0, -2.65], "size": [9.0, 9.0]},
    {"start": [0.5, 8.0, -2.65], "end": [-2.0, 10.0, -2.5], "size": [8.0, 8.0]},

    //Front Side
    {"start": [-2.5, 3.0, -2.65], "end": [-2.0, 10.0, 2.5], "size": [12.0, 12.0]},
    {"start": [-2.0, 10.0, -2.5], "end": [-2.5, 3.0, 2.65], "size": [8.0, 8.0]},

    //Front Bottom
    {"start": [-2.0, 10.0, -2.5], "end": [-2.0, 10.0, -1.0], "size": [8.0, 8.0]},
    {"start": [-2.0, 10.0, -1.0], "end": [-0.0, 10.0, 0.0], "size": [8.0, 8.0]},

    //Back
    {"start": [1.0, 1.0, 2.65], "end": [-1.2, 5.5, 2.65], "size": [12.0, 12.0]},
    {"start": [1.0, 1.0, 2.65], "end": [-2.5, 3.0, 2.65], "size": [10.0, 10.0]},
    {"start": [-1.2, 5.5, 2.65], "end": [0.5, 8.0, 2.65], "size": [9.0, 9.0]},
    {"start": [0.5, 8.0, 2.65], "end": [-2.0, 10.0, 2.5], "size": [8.0, 8.0]},

    //Back Side
    {"start": [-2.5, 3.0, 2.65], "end": [-1.2, 5.5, -2.65], "size": [8.0, 8.0]},

    //Back Bottom
    {"start": [-2.0, 10.0, 2.5], "end": [-2.0, 10.0, 1.0], "size": [8.0, 8.0]},
    {"start": [-2.0, 10.0, 1.0], "end": [-0.0, 10.0, 0.0], "size": [8.0, 8.0]},

]);
spell_venom_punch_arms.anchor.set("rightArm");
spell_venom_punch_arms.setOffset(1, 0, 0).setRotation(0.0, 0.0, 0.0).setScale(1.0);
spell_venom_punch_arms.mirror = false;

//Venom Arms
venom_arms = utils.createLines(renderer, venom_hands, 0x00CBFF, [
    {"start": [0, 0.85, 0], "end": [0.0, -0.1, 0.0], "size": [10.0, 3.0]},
]);
venom_arms.anchor.set("rightArm");
venom_arms.setOffset(1, 4.0, 0).setRotation(0.0, 0.0, 0.0).setScale(8.0, 6.0, 8.0);
venom_arms.mirror = false;

utils.bindBeam(renderer, "fiskheroes:energy_manipulation", "unconventional:empty", "rightArm", 0x00CBFF, [
    { "firstPerson": [-2.5, 0.0, -7.0], "offset": [-0.5, 19.0, -12.0], "size": [1.5, 1.5] }
]);

}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    utils.addAnimationEvent(renderer, "WEBSWING_DIVE", [
        "fiskheroes:swing_dive", 
        "fiskheroes:swing_dive2", 
        "unconventional:swing_dive3", 
        "unconventional:swing_dive4"
    ]);
    utils.addAnimationEvent(renderer, "WEBSWING_DEFAULT", [
        "fiskheroes:swing_default"
    ]);
    utils.addAnimationEvent(renderer, "WEBSWING_TRICK_DEFAULT", [
        "fiskheroes:swing_roll", 
        "unconventional:swing_roll1", 
        "unconventional:swing_roll2", 
        "unconventional:swing_roll4", 
        "unconventional:swing_roll5"
    ]);
    utils.addAnimationEvent(renderer, "WEBSWING_RIGHT", [
        "unconventional:swing_right2"
    ]);
    utils.addAnimationEvent(renderer, "WEBSWING_TRICK_RIGHT", [
        "fiskheroes:swing_rotate_right"
    ]);
    utils.addAnimationEvent(renderer, "WEBSWING_LEFT", [
        "unconventional:swing_left2", 
        "unconventional:swing_left3"
    ]);
    utils.addAnimationEvent(renderer, "WEBSWING_TRICK_LEFT", [
        "fiskheroes:swing_rotate_left"
    ]);
    utils.addAnimationEvent(renderer, "WEBSWING_LEAP", [
        "fiskheroes:swing_springboard"
    ]);

    addAnimation(renderer, "spiderman.MASK", "fiskheroes:remove_cowl")
    .setData((entity, data) => {
        var f = entity.getInterpolatedData("fiskheroes:mask_open_timer2");
        data.load(f < 1 ? f : 0);
    });

    renderer.reprioritizeDefaultAnimation("PUNCH", -9);
    renderer.reprioritizeDefaultAnimation("AIM_BOW", -9);
}

function render(entity, renderLayer, isFirstPersonArm) {
    var invis = entity.getInterpolatedData("fiskheroes:invisibility_timer");
    
    overlay.opacity = invis;
    overlay.render();
    
    if (renderLayer == "CHESTPLATE") {
        var venom_timer = entity.getInterpolatedData('fiskheroes:energy_charge');
        
        spell_venom_punch_arms.progress = venom_timer;
        spell_venom_punch_arms.render();

        venom_arms.progress = venom_timer;
        venom_arms.render();
    }
}