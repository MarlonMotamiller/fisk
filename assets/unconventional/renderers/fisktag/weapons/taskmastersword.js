loadTextures({
    "base": "unconventional:taskmaster_sword"
});

var utils = implement("fisktag:external/utils");

var model;

function init(renderer) {
    model = utils.createModel(renderer, "unconventional:weapons/taskmaster_sword", "base");
    renderer.setModel(model);
}

function render(renderer, entity, glProxy, renderType, scopeTimer, recoil, isLeftSide) {
	///x:0.04
	if (renderType === "EQUIPPED_FIRST_PERSON") {
		glProxy.translate(-0.0, 0.0, -0.2);
		// glProxy.rotate(10, 0, -1, 0);
		glProxy.rotate(10, 0, -1, -1);
		glProxy.rotate(15, -1, 0, 0);
		glProxy.scale(0.9);
	}
    else if (renderType === "INVENTORY") {
		glProxy.translate(1.1, 0.0, 0.0);
		glProxy.rotate(45, 0, -1, 0);
		glProxy.rotate(45, -1, 0, 0);
		glProxy.rotate(15, 0, 0, -1);
    }
	else if (renderType === "ENTITY") {
		glProxy.translate(0, 0.0, -0.2);
		glProxy.rotate(45, -1, 0, 0);
    }
	glProxy.translate(0.0, -0.05, 0.0);
	glProxy.scale(1.5);

}
