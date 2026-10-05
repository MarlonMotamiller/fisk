loadTextures({
    "base": "unconventional:gerber_mk_ii"
});

var utils = implement("fisktag:external/utils");

function init(renderer) {
    var model = utils.createModel(renderer, "unconventional:weapons/gerber_mk_ii", "base");
    renderer.setModel(model);
}

function render(renderer, entity, glProxy, renderType, scopeTimer, recoil, isLeftSide) {
	if (renderType === "EQUIPPED_FIRST_PERSON") {
		// glProxy.translate(-0.2, 0.1, 0.0);
		// glProxy.rotate(10, 0, -1, 0);
		// glProxy.rotate(15, -1, 0, -1);
		// glProxy.scale(0.9);
	}
    else if (renderType === "INVENTORY") {
		glProxy.translate(0.0, 0.15, 0.0);
		glProxy.rotate(40, 1, 0, 0);
		glProxy.rotate(35, 0, -1, 0);
		glProxy.rotate(10, 0, 0, 1);
		glProxy.scale(2.5);
    }
	else if (renderType === "ENTITY") {
		glProxy.translate(0.0, 0.15, 0.0);
		glProxy.rotate(40, 1, 0, 0);
		glProxy.rotate(35, 0, -1, 0);
		glProxy.rotate(10, 0, 0, 1);
		glProxy.scale(1.5);
    }
	glProxy.translate(0.0, -2.0, -0.05);
	glProxy.scale(1.5);
}
