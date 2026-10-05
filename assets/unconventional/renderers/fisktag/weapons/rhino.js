loadTextures({
    "base": "unconventional:rhino",
    "crosshair": "fisktag:crosshairs/pistol"
});

var utils = implement("fisktag:external/utils");

var model;
var cancelAnimations = false;

function init(renderer) {
    model = utils.createModel(renderer, "unconventional:weapons/rhino", "base");
    model.bindAnimation("unconventional:weapons/rhino").setData((entity, data) => {
        if (cancelAnimations) {
            data.load(0);
            return;
        }
        data.load(entity.getInterpolatedData("fiskheroes:weapon_animation_spin_timer"));
    });
    renderer.setModel(model);

    utils.addPlayerAnimation(renderer, "unconventional:weapons/revolver_reload")
	.setData((entity, data) => {
        data.load(0, entity.getInterpolatedData("fiskheroes:reload_timer"));
	});

    utils.bindScopedBeam(renderer, "unconventional:weapon_bullet", 0xFFA03A, [
        { "firstPerson": [-6.0, 4.0, -18.0], "offset": [-0.5, 15.0, -3.0], "size": [1.0, 1.0] }
    ], [6.0, -2.0, -2.0]);
}

function render(renderer, entity, glProxy, renderType, scopeTimer, recoil, isLeftSide) {
    cancelAnimations = false;
    if (renderType === "EQUIPPED_FIRST_PERSON") {
        var reload = Math.sin(Math.PI*entity.getInterpolatedData("fiskheroes:reload_timer"));

        glProxy.translate(0, 0.0+1*reload, 0);

        recoil *= 20.0;
        glProxy.rotate(-recoil, 1, 0, 0);
        glProxy.translate(0, scopeTimer *-0.10, 0.0);
    }
    else if (renderType === "ENTITY") {
        cancelAnimations = true;
    }
    else if (renderType === "INVENTORY") {
        glProxy.scale(1.5);
        cancelAnimations = true;
    }
    else if (renderType === "EQUIPPED_IN_SUIT") {
        glProxy.scale(1.0);
        cancelAnimations = true;
	}
    glProxy.translate(0, -1.15, -0.65);
    glProxy.scale(1.2);
}