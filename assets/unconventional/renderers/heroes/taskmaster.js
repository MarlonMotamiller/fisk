extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "unconventional:marvel/taskmaster/taskmaster_layer1",
    "layer2": "unconventional:marvel/taskmaster/taskmaster_layer2",
    "taskpack": "unconventional:marvel/taskmaster/taskpack_texture",

    "shield": "unconventional:marvel/taskmaster/taskmaster_shield",
    "arrow": "fiskheroes:arrow/prometheus",

    "claws": "fiskheroes:black_panther_claws",
    "blades_armor": "unconventional:marvel/taskmaster/taskmaster_hand_blades",
    "blade": "unconventional:marvel/taskmaster/taskmaster_blade"
});

var utils = implement("fiskheroes:external/utils");

function init(renderer) {
    parent.init(renderer);
    renderer.setTexture((entity, renderLayer) => {
        if (renderLayer == "HELMET" && (entity.is("DISPLAY") && entity.as("DISPLAY").isStatic() ? entity.getData("fiskheroes:mask_open") : entity.getData("fiskheroes:mask_open_timer2") > 0.35)) {
            return "layer2";
        }
        return renderLayer == "LEGGINGS" ? "layer2" : "layer1";
    });
}

function initEffects(renderer) {
    parent.initEffects(renderer);

    taskpack = renderer.createEffect("fiskheroes:model").setModel(utils.createModel(renderer, "unconventional:taskpack2", "taskpack"));
    taskpack.setOffset(0, 0, -1);
    taskpack.anchor.set("body");
    taskpack.setScale(1.0);

    var model_blades = renderer.createResource("MODEL", "unconventional:taskmaster_blades");
    model_blades.bindAnimation("unconventional:taskmaster_blades_open").setData((entity, data) => {
        data.load(entity.getInterpolatedData("unconventional:dyn/weapon2_timer"));
    });
    model_blades.texture.set("blades_armor");
    model_blades.generateMirror();
    blades_armor = renderer.createEffect("fiskheroes:model").setModel(model_blades);
    blades_armor.setOffset(-5, -2, 0);
    blades_armor.anchor.set("rightArm");
    blades_armor.setScale(1.0);
    blades_armor.mirror = true;

    overlay = renderer.createEffect("fiskheroes:overlay");
    overlay.texture.set("claws");

    utils.addLivery(renderer, "SHIELD", "shield");
    utils.addLivery(renderer, "ARROW", "arrow");
    utils.addLivery(renderer, "QUIVER", "unconventional:null");

    blade = renderer.createEffect("fiskheroes:shield");
    blade.texture.set("blade");
    blade.anchor.set("rightArm");

    blade1 = renderer.createEffect("fiskheroes:shield");
    blade1.texture.set("blade");
    blade1.anchor.set("leftArm");

    renderer.bindProperty("fiskheroes:equipped_item").setItems([
        { "anchor": "leftArm", "scale": 1.0, "offset": [3.0, 6.5, 0], "rotation": [0.0, 180.0, 98.0] }
    ]).setCondition(entity => entity.getHeldItem().name() == 'fisktag:weapon' && entity.getHeldItem().nbt().getString('WeaponType') == 'unconventional:taskmastersword' && !entity.as('PLAYER').isUsingItem()).slotIndex = 0;

    renderer.bindProperty("fiskheroes:equipped_item").setItems([
        { "anchor": "leftArm", "scale": 1.0, "offset": [3.0, 8.0, -1], "rotation": [-5.0, 205.0, 115.0] }
    ]).setCondition(entity => entity.getHeldItem().name() == 'fisktag:weapon' && entity.getHeldItem().nbt().getString('WeaponType') == 'unconventional:taskmastersword' && entity.as('PLAYER').isUsingItem()).slotIndex = 0;

    renderer.bindProperty("fiskheroes:equipped_item").setItems([
        { "anchor": "rightLeg", "scale": 0.5, "offset": [-2.4, -0.5, 1.25], "rotation": [90.0, 0.0, 0.0] }
    ]).slotIndex = 2;

}

function initAnimations(renderer) {
    parent.initAnimations(renderer);

    renderer.reprioritizeDefaultAnimation("PUNCH", -10);
    renderer.reprioritizeDefaultAnimation("AIM_BOW", -9);

    addAnimation(renderer, "taskmaster.HOOD", "unconventional:remove_cowl")
    .setData((entity, data) => {
        var f = entity.getInterpolatedData("fiskheroes:mask_open_timer2");
        data.load(f < 1 ? f : 0);
    });
	
    addAnimation(renderer, "taskmaster.LEFT_BLOCKING", "unconventional:blocking_left").setData((entity, data) => {
        data.load(entity.getHeldItem().name() == 'fisktag:weapon' && entity.getHeldItem().nbt().getString('WeaponType') == 'unconventional:taskmastersword' && entity.as('PLAYER').isUsingItem() ? 1 : 0);
    }).priority = -12;

    addAnimation(renderer, "taskmaster.CLAW", "unconventional:double_punch").setData((entity, data) => data.load(Math.max(entity.getPunchTimerInterpolated())))
    .setCondition(entity => (entity.getData("unconventional:dyn/weapon1") )).priority = -8;

    addAnimation(renderer, "taskmaster.SLICE", "unconventional:double_slice").setData((entity, data) => data.load(Math.max(entity.getPunchTimerInterpolated())))
    .setCondition(entity => (entity.getData("unconventional:dyn/weapon2") )).priority = -8;

    addAnimation(renderer, "taskmaster.THROW", "unconventional:shield_throw")
    .setData((entity, data) => {
        data.load(0, Math.max(entity.getInterpolatedData("unconventional:dyn/shield_throw_timer") - (entity.isPunching() || entity.getHeldItem().name() == "fiskheroes:captain_americas_shield" && entity.as("PLAYER").isBlocking()), 0));
    }).priority = -8;

    addAnimation(renderer, "shield.BLOCKING", "unconventional:aiming_shield_block")
    .setData((entity, data) => {
        data.load(entity.getHeldItem().name() == "fiskheroes:captain_americas_shield" && entity.as("PLAYER").isBlocking());
    });

    addAnimation(renderer, "shield.BLOCKING.LEFT", "unconventional:aiming_shield_block_left").setData((entity, data) => {
        data.load(entity.getHeldItem().name() == 'fisktag:weapon' && entity.getHeldItem().nbt().getString('WeaponType') == 'unconventional:taskmastersword' && entity.as('PLAYER').isUsingItem() ? 1 : 0);
    });

    renderer.reprioritizeDefaultAnimation("PUNCH", -9);

}

function render(entity, renderLayer, isFirstPersonArm) {

    if (renderLayer == "CHESTPLATE") {

        taskpack.render();

        overlay.opacity = entity.getData("unconventional:dyn/weapon1");
        overlay.render();

        blade.unfold = blade1.unfold = entity.getInterpolatedData("unconventional:dyn/weapon2_timer");

        blades_armor.render();

        var f = Math.min(blade.unfold * 5, 1);
        blade.setOffset(2.9 + 0.2 * f, 6.0 + 2.0 * f, 0.0);
        blade.render();

        blade1.setOffset(-2.9 + -0.2 * f, 6.0 + 2.0 * f, 0.0);
        blade1.render();
    }
}
