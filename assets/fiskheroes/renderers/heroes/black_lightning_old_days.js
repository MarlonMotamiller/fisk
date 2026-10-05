extend("fiskheroes:black_lightning");
loadTextures({
    "layer1": "fiskheroes:black_lightning_old_days_layer1",
    "layer2": "fiskheroes:black_lightning_old_days_layer2",
    "visor": "unconventional:null"
});

var utils = implement("fiskheroes:external/utils");

var overlay;

function init(renderer) {
    parent.init(renderer);
	renderer.setLights((entity, renderLayer) => "null");
}