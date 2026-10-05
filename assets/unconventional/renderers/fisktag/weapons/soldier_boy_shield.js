loadTextures({
    "base": "unconventional:soldier_boy_shield"
});

var utils = implement("fisktag:external/utils");

var model;
var cancelAnimations = false;

function init(renderer) {
    model = utils.createModel(renderer, "unconventional:weapons/soldier_boy_shield", "base");
    renderer.setModel(model);

    utils.addPlayerAnimation(renderer, "unconventional:blocking_arm")
	.setData((entity, data) => {
        data.load(0, entity.getInterpolatedData("unconventional:dyn/shield_timer"));
	}).priority = 10;

    utils.addPlayerAnimation(renderer, "unconventional:aiming_shield_block")
    .setData((entity, data) => {
        data.load((entity.getHeldItem().name() == "fisktag:weapon" && entity.getHeldItem().isWeapon()) && entity.as("PLAYER").isUsingItem());
    }).priority = 11;
}

function render(renderer, entity, glProxy, renderType, scopeTimer, recoil, isLeftSide) {
        cancelAnimations = false;
        var b = entity.getInterpolatedData("unconventional:dyn/shield_timer");

    if (renderType === "EQUIPPED") {
        glProxy.translate(-0.32-0.115*b, -0.3, 0.5- 0.1*b);
        glProxy.rotate(85-15*b, 0, 1, 0);
        glProxy.rotate(-45, 0, 0, 1);
    }
    if (renderType === "EQUIPPED_FIRST_PERSON") {
        glProxy.translate(0.2+0.7*b, -0.5-0.3*b, -0.1 + 0.1*b);
        glProxy.rotate(50-45*b, 0, 1, 0);
    }
	else if (renderType === "INVENTORY") {
        cancelAnimations = false;
        glProxy.translate(0.3, -1.25, -0.0);
        glProxy.rotate(210, 0, 1, 0);
        glProxy.scale(1.2);
	}
    else if (renderType === "ENTITY") {
        cancelAnimations = false;
        glProxy.translate(-0.2, -1.8, -0.15);
        glProxy.rotate(210, 0, 1, 0);
        glProxy.scale(1.2);
	}
    else if (renderType === "EQUIPPED_IN_SUIT") {
        cancelAnimations = true;
        glProxy.translate(-0.2, -0.4, 0.04);
        glProxy.rotate(180, 0, 1, 0);
        glProxy.rotate(25, 0, 0, 1);
        glProxy.scale(0.65);
	}
    glProxy.scale(1.0);
}
