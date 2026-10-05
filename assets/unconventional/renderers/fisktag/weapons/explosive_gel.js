loadTextures({
    "texture": "unconventional:explosive_gel_texture",
    "texture_lights": "unconventional:explosive_gel_texture_lights",

    "crosshair": "fisktag:crosshairs/pistol"
});

var utils = implement("fisktag:external/utils");

var model;
var cancelAnimations = false;

function init(renderer) {
    var model = utils.createModel(renderer, "unconventional:weapons/explosive_gel", "texture", "texture_lights");
    renderer.setModel(model);

    renderer.crosshair.texture.set("crosshair");
    renderer.crosshair.width = 16;
    renderer.crosshair.height = 8;

    utils.bindScopedBeam(renderer, "unconventional:explosive_gel", 0xBED6C5, [
        { "firstPerson": [-5.0, 4.0, -18.0], "offset": [-0.5, 18.0, -3.0], "size": [0.4, 0.4] }
    ], [5.0, -2.0, -2.0]);

}

function render(renderer, entity, glProxy, renderType, scopeTimer, recoil, isLeftSide) {
        cancelAnimations = false;

    if (renderType === "EQUIPPED_FIRST_PERSON") {
    }
	else if (renderType === "INVENTORY" || renderType === "ENTITY") {
        cancelAnimations = false;
        glProxy.translate(0, -0.1, -0.125);
	}
    else if (renderType === "EQUIPPED_IN_SUIT") {
        cancelAnimations = true;
	}

    glProxy.scale(1.3);
}
