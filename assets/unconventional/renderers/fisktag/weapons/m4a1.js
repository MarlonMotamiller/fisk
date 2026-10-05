loadTextures({
    "base": "unconventional:m4_base",
	"grip": "unconventional:m4_grip_holo",
	"grip_holo": "unconventional:m4_grip_holo",
	"grenade_launcher": "unconventional:m4_grenade_holo",
	"grenade_launcher_holo": "unconventional:m4_grenade_holo",
	"mw": "unconventional:m4_mw_grip_ironsight",
	"jw": "unconventional:m4_jw_grip_ironsight",
    "crosshair": "fisktag:crosshairs/sniper"
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

	utils.addPlayerAnimation(renderer, "unconventional:weapons/m4a1_reload")
	.setData((entity, data) => {
        data.load(0, entity.getInterpolatedData("fiskheroes:reload_timer"));
	}).priority = 10;
    
	utils.makeDilatingCrosshair(renderer, "crosshair", 22, 18, [
        { "pos": [9, 7], "size": [5, 5] }, // Center
        { "pos": [1, 7], "size": [8, 5], "axis": [-1, 0] }, // Left
        { "pos": [14, 7], "size": [8, 5], "axis": [1, 0] }, // Right
        { "pos": [9, 1], "size": [5, 6], "axis": [0, -1] }, // Top
        { "pos": [9, 12], "size": [5, 6], "axis": [0, 1] } // Bottom
    ], 11, 11);

    utils.bindScopedBeam(renderer, "unconventional:weapon_bullet", 0xFFA03A, [
        { "firstPerson": [-6.0, 3.0, -18.0], "offset": [-3.2, 16.0, -14.0], "size": [1.0, 1.0] }
    ], [6.0, -1.0, -2.0]);
}

function render(renderer, entity, glProxy, renderType, scopeTimer, recoil, isLeftSide) {
	glProxy.translate(0, -0.75, -0.625);
	glProxy.scale(1.5);
	if (entity.isWearingFullSuit()) {
		switch (entity.getWornChestplate().nbt().getString('HeroType')) {
			case "unconventional:winter_soldier":
				model.texture.set("grenade_launcher_holo");
				break;
			case "unconventional:white_wolf":
				model.texture.set("grip_holo");
				break;
			case "unconventional:captain_america_jw":
				model.texture.set("mw");
				break;
			case "unconventional:john_wick":
				model.texture.set("jw");
				break;
			default:
				model.texture.set("base");
				break;
		}
	}
	else {
		model.texture.set("base");
	}
	
	
	// scope.opacity = scopeTimer * scopeTimer * scopeTimer;
	renderer.crosshair.opacity = 1 - (scopeTimer * scopeTimer * scopeTimer);
	
	// cancelAnimations = false;
    if (renderType == "HUD") {

    }
    else {
        if (renderType === "EQUIPPED" || renderType === "EQUIPPED_FIRST_PERSON") {
			cancelAnimations = false;
			if (renderType === "EQUIPPED_FIRST_PERSON") {
				var reload = Math.sin(Math.PI*entity.getInterpolatedData("fiskheroes:reload_timer"));

				glProxy.translate(0, -0.1+1*reload, 0);
				var f = Math.sin(entity.getInterpolatedData("fiskheroes:scope_timer") * Math.PI / 2);
				glProxy.rotate(-f * 10, 1, 0, 0);
				glProxy.translate(scopeTimer * 0.00075, -scopeTimer * 0.155, scopeTimer * 0.2);
				glProxy.translate(0, 0, 0.2*recoil * (0.7 - 0.5 * scopeTimer));
			}
			else {
				
			}
        }
		else if (renderType === "EQUIPPED_IN_SUIT") {
			cancelAnimations = true;
		}
		else if (renderType === "INVENTORY" || renderType === "ENTITY") {
			cancelAnimations = true;
    	}
    }
}
