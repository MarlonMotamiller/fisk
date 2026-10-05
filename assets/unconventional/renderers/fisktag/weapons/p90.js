loadTextures({
    "base": "unconventional:p90_texture",
    "crosshair": "fisktag:crosshairs/burst_rifle"
});

var utils = implement("fisktag:external/utils");

var model;
var cancelAnimations = false;

function init(renderer) {
    var model = utils.createModel(renderer, "unconventional:weapons/p90", "base");
    renderer.setModel(model);

    utils.makeDilatingCrosshair(renderer, "crosshair", 20, 20, [
        { "pos": [1, 8], "size": [7, 5], "axis": [-1, 0] }, // Left
        { "pos": [13, 8], "size": [7, 5], "axis": [1, 0] }, // Right
        { "pos": [8, 1], "size": [5, 7], "axis": [0, -1] }, // Top
        { "pos": [8, 13], "size": [5, 7], "axis": [0, 1] } // Bottom
    ], 3, 5);

    utils.bindScopedBeam(renderer, "unconventional:weapon_bullet", 0xFFA03A, [
        { "firstPerson": [-5.0, 4.5, -18.0], "offset": [0.0, 15.0, -4.0], "size": [1.0, 1.0] }
    ], [5.0, -2.0, -2.0]);

}

function render(renderer, entity, glProxy, renderType, scopeTimer, recoil, isLeftSide) {
    if (renderType == "HUD") {
        renderer.crosshair.opacity = 1;
    }
    else {
        if (renderType === "EQUIPPED_FIRST_PERSON") {
            glProxy.translate(scopeTimer * 0.04359, -scopeTimer * 0.325, scopeTimer * 0.4);
            glProxy.rotate(scopeTimer * -5.5, 1, 0, 0);
            glProxy.translate(0, 0, recoil * 0.05);
        }
        else {
            if (renderType === "INVENTORY" || renderType === "ENTITY") {
                glProxy.translate(0, 0, -0.15);
                cancelAnimations = true;
            }
            renderer.opacity = 1;
        }
    
        glProxy.translate(-0.04, -1.5, -0.6);
        glProxy.scale(1.3);
    }
}
