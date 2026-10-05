loadTextures({
    "bostaff": "unconventional:bostaff_deathstroke_rocksteady"
});

var utils = implement("fisktag:external/utils");

var model;
var cancelAnimations = false;

function init(renderer) {
    var model = utils.createModel(renderer, "unconventional:weapons/bostaff_deathstroke_rocksteady", "bostaff");
	model.bindAnimation("unconventional:weapons/bostaff_deathstroke_rocksteady").setData((entity, data) => {
        if (cancelAnimations) {
            data.load(0);
            return;
        }
        data.load(entity.getWornChestplate().nbt().getString('HeroType') == 'unconventional:deathstroke_rocksteady' ? entity.getInterpolatedData("unconventional:dyn/bostaff_timer") : 1);
    });
    renderer.setModel(model);

}

function render(renderer, entity, glProxy, renderType, scopeTimer, recoil, isLeftSide) {
        cancelAnimations = false;
        glProxy.translate(0, 0.0, 0.0);

	if (renderType === "EQUIPPED") {
		glProxy.rotate(50*Math.sin(Math.PI*entity.getPunchTimerInterpolated()), 0, 0, 1);
    }
    else if (renderType === "EQUIPPED_FIRST_PERSON") {
	glProxy.rotate(20, 1, 0, 0);
	glProxy.rotate(80*Math.sin(Math.PI*entity.getPunchTimerInterpolated()), 0, 0, 1);
	glProxy.translate(0-0.5*Math.sin(Math.PI*entity.getPunchTimerInterpolated()), 0+0.5*Math.sin(Math.PI*entity.getPunchTimerInterpolated()), 0-0.3*Math.sin(Math.PI*entity.getPunchTimerInterpolated()));
    }
	else if (renderType === "INVENTORY") {
        cancelAnimations = true;
        glProxy.translate(0.3, -0.35, -0.125);
        glProxy.rotate(45, 1, 0, 0);
        glProxy.scale(1.5);
	}
    else if (renderType === "ENTITY") {
        cancelAnimations = true;
        glProxy.translate(-0.0, -0.4, 0.2);
        glProxy.scale(1.4);
	}
    else if (renderType === "EQUIPPED_IN_SUIT") {
        cancelAnimations = true;
	}
    glProxy.scale(1.3);
}