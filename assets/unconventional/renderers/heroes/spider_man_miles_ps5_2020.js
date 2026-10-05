extend("unconventional:spider_man_miles_ps5");
loadTextures({
    "layer1": "unconventional:marvel/spider_man_miles_ps5_2020_layer1",
    "layer2": "unconventional:marvel/spider_man_miles_ps5_2020_layer2",
    "lights_layer1": "unconventional:marvel/spider_man_miles_ps5_2020_lights_layer1",
    "lights_layer2": "unconventional:marvel/spider_man_miles_ps5_2020_lights_layer2",
    "invis": "unconventional:marvel/spider_man_miles_ps5_2020_invisible"
});

var utils = implement("fiskheroes:external/utils");

function init(renderer) {
    parent.init(renderer);
    renderer.setLights((entity, renderLayer) => renderLayer == "LEGGINGS" ? "lights_layer2" : "lights_layer1");
}