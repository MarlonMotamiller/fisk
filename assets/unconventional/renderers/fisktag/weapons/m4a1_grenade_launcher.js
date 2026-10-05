loadTextures({
    "base": "unconventional:m4_grenade_holo",
	"grip": "unconventional:m4_grip_holo",
	"grip_holo": "unconventional:m4_grip_holo",
	"grenade_launcher": "unconventional:m4_grenade_holo",
	"grenade_launcher_holo": "unconventional:m4_grenade_holo",
    "crosshair": "fisktag:crosshairs/mortar"
});

var utils = implement("fisktag:external/utils");

var scope;
var cancelAnimations = false;

function init(renderer) {
	model = utils.createModel(renderer, "unconventional:weapons/m4_accessories", "base");
	// model.bindAnimation("pwt:weapons/ak74u").setData((entity, data) => {
        // if (cancelAnimations) {
            // data.load(0, 0);
			
		// data.load(4, 0);
            // return;
        // }
        // data.load(0, entity.getInterpolatedData("fiskheroes:weapon_animation_timer"));

		// data.load(4, 0);

    // });
    // renderer.setModel(model);
    renderer.setModel(model);

	utils.addPlayerAnimation(renderer, "unconventional:weapons/m4a1_g_reload")
	.setData((entity, data) => {
        data.load(0, entity.getInterpolatedData("fiskheroes:reload_timer"));
	}).priority = 10;
    
	utils.makeDilatingCrosshair(renderer, "crosshair", 30, 60, [
        { "pos": [8, 38], "size": [15, 22], "axis": [0, 1] }, // Bottom
        { "pos": [1, 28], "size": [7, 5], "axis": [-1, 0] }, // Left
        { "pos": [23, 28], "size": [7, 5], "axis": [1, 0] }, // Right
        { "pos": [13, 16], "size": [5, 7], "axis": [0, -1] } // Top
    ], 0, 3, 4);

    utils.bindScopedBeam(renderer, "unconventional:weapon_bullet", 0xFF6A00, [
        { "firstPerson": [-5.0, 4.0, -18.0], "offset": [-3.2, 16.0, -14.0], "size": [1.0, 1.0] }
    ], [5.0, -1.0, -2.0]);
}

function render(renderer, entity, glProxy, renderType, scopeTimer, recoil, isLeftSide) {
	var f = easeInOutSine(entity.getInterpolatedData("fiskheroes:aiming_timer"));
	glProxy.translate(0, -0.75, -0.625);
	glProxy.scale(1.5);
	if (entity.isWearingFullSuit()) {
		switch (entity.getWornChestplate().nbt().getString('HeroType')) {
			case "unconventional:white_wolf":
				model.texture.set("grip_holo");
				break;
			default:
				model.texture.set("base");
				break;
		}
	}
	else {
		model.texture.set("base");
	}
	cancelAnimations = false;
    if (renderType == "HUD") {

    }
    else {
        if (renderType === "EQUIPPED" || renderType === "EQUIPPED_FIRST_PERSON") {
			glProxy.rotate(-10*f, 1, 0, 0)
			cancelAnimations = false;
			if (renderType === "EQUIPPED_FIRST_PERSON") {
				var reload = Math.sin(Math.PI*entity.getInterpolatedData("fiskheroes:reload_timer"));

				glProxy.translate(0, 0.0+1*reload, 0);

				glProxy.translate(0.1*f, -0.1+0.05*f, 0);
				// var f = Math.sin(entity.getInterpolatedData("fiskheroes:scope_timer") * Math.PI / 2);
				glProxy.rotate(-f * 10, 1, 0, 0);
				glProxy.translate(scopeTimer * -0.5, -scopeTimer * 0.11, scopeTimer * 0.1);
				glProxy.translate(0, 0, 0.2*recoil);
			}
			else {
				glProxy.translate(0, 0, 0.7*f);
			}
        }
		else if (renderType === "INVENTORY" || renderType === "ENTITY") {
        cancelAnimations = true;
    	}
    }
}

function easeInOutSine(x) {
    return -(Math.cos(Math.PI * x) - 1) / 2;
}
