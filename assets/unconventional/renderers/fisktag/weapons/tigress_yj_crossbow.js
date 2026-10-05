loadTextures({
    "base": "unconventional:tigress_crossbow_texture",
    "polar": "unconventional:tigress_crossbow_polar_texture",
    "crosshair": "fisktag:crosshairs/pistol"
});

var utils = implement("fisktag:external/utils");

var model;
var cancelAnimations = false;

function init(renderer) {
    model = utils.createModel(renderer, "unconventional:weapons/tigress_crossbow", "base");
    renderer.setModel(model);

    utils.addPlayerAnimation(renderer, "unconventional:weapons/scorpion_reload")
	.setData((entity, data) => {
        data.load(0, entity.getInterpolatedData("fiskheroes:reload_timer"));
	}).priority = 10;

    utils.bindScopedBeam(renderer, "unconventional:weapon_bullet", 0xD3D1D3, [
        { "firstPerson": [-6.0, 3.5, -18.0], "offset": [-0.5, 16.0, -3.75], "size": [0.75, 0.75] }
    ], [6.0, -1.5, -2.0]);
}

function render(renderer, entity, glProxy, renderType, scopeTimer, recoil, isLeftSide) {
    if (entity.isWearingFullSuit()) {
		switch (entity.getWornChestplate().nbt().getString('HeroType')) {
			case "unconventional:tigress_yj/polar":
				model.texture.set("polar");
				break;
			default:
				model.texture.set("base");
				break;
		}
	}
	else {
		model.texture.set("base");
	}

    if (renderType === "EQUIPPED_FIRST_PERSON") {
        var reload = Math.sin(Math.PI*entity.getInterpolatedData("fiskheroes:reload_timer"));

        glProxy.translate(0, 0.0+1*reload, 0);

        recoil *= 1.0;
        glProxy.rotate(-recoil, 1, 0, 0);
    }
    else if (renderType === "ENTITY") {
    }
    else if (renderType === "INVENTORY") {
        glProxy.scale(1.0);
    }
    else if (renderType === "EQUIPPED") {
        recoil *= 1.0;
        glProxy.rotate(-recoil, 1, 0, 0);
    }
    else if (renderType === "EQUIPPED_IN_SUIT") {
        glProxy.scale(1.0);
	}
    glProxy.translate(0, 0.0, 0.0);
    glProxy.scale(1.5);
}