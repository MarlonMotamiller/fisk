extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "unconventional:other/five_layer1",
    "layer2": "unconventional:other/five_layer2",
    "layer2_jacket": "unconventional:other/five_jacket_layer2",
});

var utils = implement("fiskheroes:external/utils");
var auraCreate = implement("unconventional:external/aura");
var glow;
var aura;

function init(renderer) {
    parent.init(renderer);
    renderer.setTexture((entity, renderLayer) => {
        if (renderLayer == "LEGGINGS") {
            return entity.getWornChestplate().suitType() == $SUIT_NAME ? "layer2_jacket" : "layer2";
        }
        return "layer1";
    });
    
    renderer.fixHatLayer("CHESTPLATE");

    renderer.showModel("CHESTPLATE", "head", "body", "rightArm", "leftArm");
}

function initEffects(renderer) {
    parent.initEffects(renderer);
    
    glow = renderer.createEffect("fiskheroes:glowerlay");
    glow.color.set(0x9EFFF2);

    aura = auraCreate.create(renderer, 0x9EFFF2);
    

}
function initAnimations(renderer) {
    parent.initAnimations(renderer);

    addAnimation(renderer, "five.TELEPORT", "unconventional:five_teleport_anim")
    .setData((entity, data) => {
        data.load( entity.getData("fiskheroes:teleport_delay") > 0 ? entity.getInterpolatedData("fiskheroes:teleport_timer") : 0 );
    }).priority = -10;
}

function render(entity, renderLayer, isFirstPersonArm) {
    var teleport = (entity.getData("fiskheroes:teleport_delay") > 0 ? entity.getInterpolatedData("fiskheroes:teleport_timer") : 0);
    var beam = entity.getInterpolatedData("fiskheroes:beam_charge");

    glow.opacity = teleport;
    glow.render();

    aura.render(entity, renderLayer, teleport, "CHESTPLATE", "CHESTPLATE", "LEGGINGS")
}
