loadTextures({
    "axe": "unconventional:fire_axe"
});

var utils = implement("fisktag:external/utils");

var model;
var cancelAnimations = false;

function init(renderer) {
    var model = utils.createModel(renderer, "unconventional:weapons/fire_axe", "axe");
    renderer.setModel(model);
}

function render(renderer, entity, glProxy, renderType, scopeTimer, recoil, isLeftSide) {
        glProxy.translate(0, -1.6, -0.05);
        glProxy.scale(1.5);

    if (renderType === "EQUIPPED_FIRST_PERSON") {
        glProxy.rotate(15, 0, -1, 0);
    }
	else if (renderType === "INVENTORY" || renderType === "ENTITY") {
        glProxy.translate(0, -0.1, -0.125);
	}
}
