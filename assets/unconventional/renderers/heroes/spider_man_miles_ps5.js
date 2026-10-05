extend("fiskheroes:spider_man_base");
loadTextures({
    "layer1": "unconventional:marvel/spider_man_miles_ps5_layer1",
    "layer2": "unconventional:marvel/spider_man_miles_ps5_layer2",
    "invis": "unconventional:marvel/spider_man_miles_ps5_invisible"
});

var utils = implement("fiskheroes:external/utils");

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
    parent.initEffects(renderer);

    //Rad Man
    utils.bindTrail(renderer, "unconventional:spider_man_miles_ps5_venom_burst").setCondition(entity => entity.getData("fiskheroes:beam_shooting_timer") > 0);

    utils.bindBeam(renderer, "fiskheroes:charged_beam", "unconventional:radiation_beam", "head", 0xFF7B00, [
    ]);

    renderer.bindProperty("fiskheroes:equipment_wheel").color.set(0xE08600);

    utils.bindParticles(renderer, "unconventional:venom_boost").setCondition(entity => entity.getData("fiskheroes:flying"));

    utils.setOpacityWithData(renderer, 0.2, 1.0, "unconventional:dyn/invisibility_timer");

    utils.bindTrail(renderer, "unconventional:spider_man_miles_ps5_venom_trail").setCondition(entity => entity.getData("fiskheroes:energy_charging") && !entity.getData("fiskheroes:flying"));

    overlay = renderer.createEffect("fiskheroes:overlay");
    overlay.texture.set("invis");

    //Venom Punch Beams
    var venom_punch = renderer.createResource("BEAM_RENDERER", "unconventional:venom_punch");

    var venom_shape = renderer.createResource("SHAPE", "unconventional:venom_punch_arms");
    venom_punch_arm = renderer.createEffect("fiskheroes:lines").setShape(venom_shape).setRenderer(venom_punch);
    venom_punch_arm.color.set(0xFF7B00);
    venom_punch_arm.anchor.set("rightArm");
    venom_punch_arm.setOffset(1, 0, 0).setRotation(0.0, 0.0, 0.0).setScale(1.0);

    var venom_shape1 = renderer.createResource("SHAPE", "unconventional:venom_punch_arms1");
    venom_punch_armL = renderer.createEffect("fiskheroes:lines").setShape(venom_shape1).setRenderer(venom_punch);
    venom_punch_armL.color.set(0xFF7B00);
    venom_punch_armL.anchor.set("leftArm");
    venom_punch_armL.setOffset(-1, 0, 0).setRotation(0.0, 0.0, 0.0).setScale(1.0);


    //Venom Arms
    beam_arms = utils.createLines(renderer, "unconventional:aura_hands_miles", 0xFF7B00, [
        {"start": [0.0, 0.0, 0.0], "end": [0.0, -0.9, 0.0], "size": [4.8, 2.45]},
        {"start": [0.1575, 0.0, -0.065], "end": [0.1575, -0.85, -0.065], "size": [2.5, 1.25]}
    ]);
    beam_arms.anchor.set("rightArm");
    beam_arms.setOffset(2.0, 10.25, 0.0).setRotation(0, 0, 0.0).setScale(16.0, 12.0, 16.0);


    beam_arms1 = utils.createLines(renderer, "unconventional:aura_hands_miles", 0xFF7B00, [
        {"start": [0.0, 0.0, 0.0], "end": [0.0, -0.9, 0.0], "size": [4.8, 2.45]},
        {"start": [-0.1575, 0.0, -0.065], "end": [-0.1575, -0.85, -0.065], "size": [2.5, 1.25]}
    ]);
    beam_arms1.anchor.set("leftArm");
    beam_arms1.setOffset(-2.0, 10.25, 0.0).setRotation(0, 0, 0.0).setScale(16.0, 12.0, 16.0);

    utils.bindBeam(renderer, "fiskheroes:energy_manipulation", "unconventional:empty", "rightArm", 0xFF7B00, [
        { "firstPerson": [-2.5, 0.0, -7.0], "offset": [-0.5, 19.0, -12.0], "size": [1.5, 1.5] }
    ]);


//OPEN-SIGN for Soul

    // var size = [1, 1]
    // o_beams = utils.createLines(renderer, "domain:beam", 0xFFFFFF, [
    //     {"start": [0.0, 0.0, 0.0], "end": [0.0, 7.0, 0.0], "size": size},
    //     {"start": [0.0, 7.0, 0.0], "end": [4.0, 7.0, 0.0], "size": size},
    //     {"start": [4.0, 7.0, 0.0], "end": [4.0, 0.0, 0.0], "size": size},
    //     {"start": [4.0, 0.0, 0.0], "end": [0.0, 0.0, 0.0], "size": size}
    // ]);
    // o_beams.anchor.set("head");
    // o_beams.setOffset(0.0, 0.0, 6.0).setRotation(0, 0, 0.0).setScale(16);

    // p_beams = utils.createLines(renderer, "domain:beam", 0xFFFFFF, [
    //     {"start": [0.0, 0.0, 0.0], "end": [0.0, 7.0, 0.0], "size": size},
    //     {"start": [0.0, 7.0, 0.0], "end": [4.0, 7.0, 0.0], "size": size},
    //     {"start": [4.0, 7.0, 0.0], "end": [4.0, 4.0, 0.0], "size": size},
    //     {"start": [4.0, 4.0, 0.0], "end": [0.0, 4.0, 0.0], "size": size}
    // ]);
    // p_beams.anchor.set("head");
    // p_beams.setOffset(5.0, 0.0, 6.0).setRotation(0, 0, 0.0).setScale(16);

    // e_beams = utils.createLines(renderer, "domain:beam", 0xFFFFFF, [
    //     {"start": [0.0, 0.0, 0.0], "end": [0.0, 7.0, 0.0], "size": size},
    //     {"start": [0.0, 7.0, 0.0], "end": [4.0, 7.0, 0.0], "size": size},
    //     {"start": [0.0, 4.0, 0.0], "end": [3.0, 4.0, 0.0], "size": size},
    //     {"start": [0.0, 0.0, 0.0], "end": [4.0, 0.0, 0.0], "size": size}
    // ]);
    // e_beams.anchor.set("head");
    // e_beams.setOffset(10.0, 0.0, 6.0).setRotation(0, 0, 0.0).setScale(16);

    // n_beams = utils.createLines(renderer, "domain:beam", 0xFFFFFF, [
    //     {"start": [0.0, 0.0, 0.0], "end": [0.0, 7.0, 0.0], "size": size},
    //     {"start": [0.0, 7.0, 0.0], "end": [4.0, 0.0, 0.0], "size": size},
    //     {"start": [4.0, 0.0, 0.0], "end": [4.0, 7.0, 0.0], "size": size}
    // ]);
    // n_beams.anchor.set("head");
    // n_beams.setOffset(10.0, 0.0, 6.0).setRotation(0, 0, 0.0).setScale(16);


}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    addAnimation(renderer, "radioactive.CHARGED_BEAM", "unconventional:radiation_charged_beam").setData((entity, data) => {
        var charge = entity.getInterpolatedData("fiskheroes:beam_charge");
        data.load(0, entity.getData("fiskheroes:beam_charging") ? charge : 0);
		data.load(1, entity.getInterpolatedData("fiskheroes:beam_shooting_timer"));
    })
	.priority = -11;

    utils.addAnimationEvent(renderer, "WEBSWING_DIVE", [
        "fiskheroes:swing_dive", 
        "fiskheroes:swing_dive2", 
        "unconventional:swing_dive3", 
        "unconventional:swing_dive4", 
        "unconventional:swing_dive5"
    ]).priority = -10;
    utils.addAnimationEvent(renderer, "WEBSWING_DEFAULT", [
        "fiskheroes:swing_default", 
        "unconventional:swing_default1"
    ]).priority = -10;
    utils.addAnimationEvent(renderer, "WEBSWING_TRICK_DEFAULT", [
        "fiskheroes:swing_roll", 
        "unconventional:swing_roll1", 
        "unconventional:swing_roll2", 
        "unconventional:swing_roll3", 
        "unconventional:swing_roll4", 
        "unconventional:swing_roll5", 
        "unconventional:swing_roll6"
    ]).priority = -10;
    utils.addAnimationEvent(renderer, "WEBSWING_RIGHT", [
        "fiskheroes:swing_right", 
        "unconventional:swing_right2",
        "unconventional:swing_right3"
    ]).priority = -10;
    utils.addAnimationEvent(renderer, "WEBSWING_TRICK_RIGHT", [
        "fiskheroes:swing_rotate_right", 
        "fiskheroes:swing_rotate_right1",
        "unconventional:swing_roll7_360r"
    ]).priority = -10;
    utils.addAnimationEvent(renderer, "WEBSWING_LEFT", [
        "fiskheroes:swing_left", 
        "unconventional:swing_left2", 
        "unconventional:swing_left3"
    ]).priority = -10;
    utils.addAnimationEvent(renderer, "WEBSWING_TRICK_LEFT", [
        "fiskheroes:swing_rotate_left", 
        "fiskheroes:swing_rotate_left1",
        "unconventional:swing_roll7_360l"
    ]).priority = -10;
    utils.addAnimationEvent(renderer, "WEBSWING_LEAP", [
        "fiskheroes:swing_springboard", 
        "unconventional:swing_roll4"
    ]).priority = -10;

    addAnimationWithData(renderer, "miles.LAND", "unconventional:spider_man_miles_ps5_superhero_landing", "fiskheroes:dyn/superhero_landing_timer")
    .priority = -10;

    addAnimationWithData(renderer, "miles.PERCH", "unconventional:miles_perch", "unconventional:dyn/perch_timer")
    .priority = -10;


    addAnimation(renderer, "miles.FLIGHT", "unconventional:venom_boost_new")
    .setData((entity, data) => {
        data.load(0, entity.getInterpolatedData("fiskheroes:flight_timer"));
    })
    .priority = -5;

    addAnimationWithData(renderer, "miles.ROLL", "fiskheroes:flight/barrel_roll", "fiskheroes:barrel_roll_timer")
        .priority = 10;


    addAnimation(renderer, "spiderman.MASK", "fiskheroes:remove_cowl")
    .setData((entity, data) => {
        var f = entity.getInterpolatedData("fiskheroes:mask_open_timer2");
        data.load(f < 1 ? f : 0);
    });

    addAnimation(renderer, "spiderman.DISPLAY", "unconventional:spiderman_ps5_miles_pose").setData((entity, data) => data.load(entity.as("DISPLAY").getDisplayType() == "HOLOGRAM"))
    .priority = -10;
    addAnimation(renderer, "spiderman.DISPLAY2", "unconventional:spiderman_ps5_miles_pose").setData((entity, data) => data.load(entity.as("DISPLAY").getDisplayType() == "DATABASE_PREVIEW"))
    .priority = -10;

    renderer.reprioritizeDefaultAnimation("PUNCH", -9);
    renderer.reprioritizeDefaultAnimation("AIM_BOW", -9);
}

function render(entity, renderLayer, isFirstPersonArm) {
    var invis = entity.getInterpolatedData("unconventional:dyn/invisibility_timer");
    
    overlay.opacity = invis;
    overlay.render();

    if (renderLayer == "CHESTPLATE") {
        var venom_timer = entity.getInterpolatedData('fiskheroes:energy_charge');
        var venom_boost = entity.getInterpolatedData('fiskheroes:flight_boost_timer')
        
        venom_punch_arm.progress = venom_timer || venom_boost;
        venom_punch_arm.opacity = venom_timer || venom_boost;
        venom_punch_arm.render();

        venom_punch_armL.progress = venom_timer || venom_boost;
        venom_punch_armL.opacity = venom_timer || venom_boost;
        venom_punch_armL.render();

        beam_arms.progress = venom_timer || venom_boost;
        beam_arms.opacity = venom_timer || venom_boost;
        beam_arms.render();

        beam_arms1.progress = venom_timer || venom_boost;
        beam_arms1.opacity = venom_timer || venom_boost;
        beam_arms1.render();
    }
}