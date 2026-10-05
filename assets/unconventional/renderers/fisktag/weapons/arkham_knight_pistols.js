loadTextures({
    "base": "unconventional:arkham_knight_gun",
    "L": "unconventional:arkham_knight_gun_L",
    "R": "unconventional:arkham_knight_gun_R",

    "crosshair": "fisktag:crosshairs/sniper"
});

var utils = implement("fisktag:external/utils");

var model;

var cancelAnimations = false;
var leftSide = false;

function init(renderer) {
    model = utils.createModel(renderer, "unconventional:weapons/arkham_knight_gun", "base");
	model.bindAnimation("unconventional:weapons/arkham_knight_gun_combine").setData((entity, data) => {
	var ammo = entity.getHeldItem().nbt().getShort("Ammo");
        if (cancelAnimations) {
            data.load(0, 0);
            data.load(2, 0);
            return;
        }
        data.load(0, entity.getInterpolatedData('unconventional:dyn/switch_timer'));
        data.load(2, leftSide == true ? 1 : 0);
    });
    renderer.setModel(model);	

	utils.addPlayerAnimation(renderer, "unconventional:weapons/arkham_knight_gun_combine")
	.setData((entity, data) => {
        data.load(0, entity.getInterpolatedData('unconventional:dyn/switch_timer'));
		data.load(1, 1);
	});
	
	utils.addPlayerAnimation(renderer, "unconventional:weapons/pistol_reload")
	.setData((entity, data) => {
        data.load(0, entity.getInterpolatedData("fiskheroes:reload_timer"));
	});

	utils.makeDilatingCrosshair(renderer, "crosshair", 22, 18, [
        { "pos": [9, 7], "size": [5, 5] }, // Center
        { "pos": [1, 7], "size": [8, 5], "axis": [-1, 0] }, // Left
        { "pos": [14, 7], "size": [8, 5], "axis": [1, 0] }, // Right
        { "pos": [9, 1], "size": [5, 6], "axis": [0, -1] }, // Top
        { "pos": [9, 12], "size": [5, 6], "axis": [0, 1] } // Bottom
    ], 6, 4);

    utils.bindScopedBeam(renderer, "unconventional:weapon_bullet", 0xFFA03A, [
        { "firstPerson": [-6.0, 4.5, -18.0], "offset": [-0.5, 14.0, -3.5], "size": [1.0, 1.0] }
    ], [6.0, -2.0, -2.0]);
}

function render(renderer, entity, glProxy, renderType, scopeTimer, recoil, isLeftSide) {
	if (isLeftSide) {
		model.texture.set("L");
	}
	else {
		model.texture.set("R");
	}
	cancelAnimations = false;
	leftSide = isLeftSide;
    //glProxy.translate(0, -1.4, -0.82);

    if (renderType === "EQUIPPED" || renderType === "EQUIPPED_FIRST_PERSON") {
		cancelAnimations = false;
		if (renderType === "EQUIPPED_FIRST_PERSON") {
			var reload = Math.sin(Math.PI*entity.getInterpolatedData("fiskheroes:reload_timer")) + 2.5*entity.getInterpolatedData('unconventional:dyn/switch_timer')
			glProxy.translate(0.05, -0.05+1*reload, 0);
			
			var f = 1 - scopeTimer * 0.4;
			recoil *= 0.3;
			glProxy.rotate(-recoil * (20 - scopeTimer * 7), 1, 0, 0);
			glProxy.translate(-0.05*scopeTimer, -0.65*scopeTimer * 0.125, scopeTimer * 0.2);
			glProxy.translate(0.02 * recoil * (1 - scopeTimer), -0.04 * recoil * f, (Math.sin(recoil * Math.PI) * 0.1) * f);
		}
		else {
			if (isLeftSide) {
				var f = Math.min(Math.max(6*(entity.getInterpolatedData('unconventional:dyn/switch_timer')-0.7),0),1);
				glProxy.rotate(67.8*f, 0, 1, 0);
			}
			else {
				var f = Math.min(Math.max(4*(entity.getInterpolatedData('unconventional:dyn/switch_timer')-0.4),0),1);
				glProxy.rotate(20*f, 0, -1, 0);
			}	
		}
    }
	else if (renderType === "EQUIPPED_IN_SUIT") {
		cancelAnimations = true;
	}
	else if (renderType === "ENTITY" || renderType === "INVENTORY") {
		cancelAnimations = true;
    }

    //glProxy.scale(1.5);

		glProxy.translate(0, -1.4, -0.82);
    	glProxy.scale(1.5);
   	

}
