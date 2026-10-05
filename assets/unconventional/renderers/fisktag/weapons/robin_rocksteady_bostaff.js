loadTextures({
    "bostaff": "unconventional:bostaff_robin.tx.json",
    "bostaff_texture": "unconventional:bostaff_robin_rocksteady"
});

var utils = implement("fisktag:external/utils");

var model;
var cancelAnimations = false;

function init(renderer) {
    model = renderer.createResource("MODEL", "unconventional:weapons/bostaff_robin_rocksteady");
	model.bindAnimation("unconventional:weapons/bostaff_robin_rocksteady").setData((entity, data) => {
        if (cancelAnimations) {
            data.load(0);
            return;
        }
        data.load(entity.getWornChestplate().nbt().getString('HeroType') == 'unconventional:robin_rocksteady' ? entity.getInterpolatedData("unconventional:dyn/bostaff_timer") : 1);
    });
    renderer.setModel(model);

}

function render(renderer, entity, glProxy, renderType, scopeTimer, recoil, isLeftSide) {
        cancelAnimations = false;
        var b = entity.getInterpolatedData("unconventional:dyn/shield_timer");
        model.texture.set("bostaff");

    if (renderType === "EQUIPPED") {
        glProxy.translate(0, 0.0, -0.1- 0.1*b);
        glProxy.rotate(-70*b, 0, 1, 0);
		glProxy.rotate(50*Math.sin(Math.PI*entity.getPunchTimerInterpolated()), 0, 0, 1);
    }
    if (renderType === "EQUIPPED_FIRST_PERSON") {
        glProxy.translate(0+1*b, 0.0, -0.1- 0.5*b);
        glProxy.rotate(-80*b, 0, 1, 0);
		glProxy.rotate(20*(1-b), 1, 0, 0);
		glProxy.rotate(80*Math.sin(Math.PI*entity.getPunchTimerInterpolated()), 0, 0, 1);
		glProxy.translate(0-0.5*Math.sin(Math.PI*entity.getPunchTimerInterpolated()), 0+0.5*Math.sin(Math.PI*entity.getPunchTimerInterpolated()), 0-0.3*Math.sin(Math.PI*entity.getPunchTimerInterpolated()));

    }
	else if (renderType === "INVENTORY") {
        cancelAnimations = true;
        glProxy.translate(0.3, -0.35, -0.125);
        glProxy.rotate(45, 1, 0, 0);
        glProxy.scale(1.5);
        model.texture.set("bostaff_texture");
	}
    else if (renderType === "ENTITY") {
        cancelAnimations = true;
        glProxy.translate(-0.0, -0.4, 0.6);
        glProxy.scale(1.4);
        model.texture.set("bostaff_texture");
	}
    else if (renderType === "EQUIPPED_IN_SUIT") {
        cancelAnimations = true;
	}
    glProxy.scale(1.4);
}
