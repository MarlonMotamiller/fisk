extend("fiskheroes:hero_basic");
loadTextures({
    "glasses": "unconventional:marvel/edith_glasses",
    "null": "unconventional:null"
    
});

var utils = implement("fiskheroes:external/utils");

var glasses;

function init(renderer) {
    parent.init(renderer);

    renderer.setTexture((entity, renderLayer) => {
        return "null";
    });

    renderer.showModel("HELMET", "head", "headwear");
    renderer.fixHatLayer("HELMET");
}

function initEffects(renderer) {
    glasses = renderer.createEffect("fiskheroes:model").setModel(utils.createModel(renderer, "unconventional:edith_glasses", "glasses"));
    glasses.setOffset(0.0, 0.0, 0.0).setRotation(0.0, 0.0, 0.0).setScale(1.0);
    glasses.anchor.set("head");

}

function render(entity, renderLayer, isFirstPersonArm) {
    if (renderLayer == "HELMET") {
        glasses.render();
    }
}