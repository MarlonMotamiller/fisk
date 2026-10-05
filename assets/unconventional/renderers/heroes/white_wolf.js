extend("unconventional:winter_soldier");
loadTextures({
    "layer1": "unconventional:marvel/white_wolf_layer1",
    "layer2": "unconventional:marvel/white_wolf_layer2"
});

function init(renderer) {
    parent.init(renderer);
}

function initEquipped(renderer) {
	renderer.bindProperty("fiskheroes:equipped_item").setItems([
        { "anchor": "body", "scale": 0.6, "offset": [-2.0, 1.0, 3.5], "rotation": [0.0, -95.0, 60.0] }
    ]).addOffset("QUIVER", 0.0, 0.0, 2.5).slotIndex = 0;
	renderer.bindProperty("fiskheroes:equipped_item").setItems([
        { "anchor": "leftLeg", "scale": 0.6, "offset": [2.4, 0.5, 1.0], "rotation": [90.0, 0.0, 0.0] }
    ]).slotIndex = 1;
}

