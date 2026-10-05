extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "unconventional:dc/superman_gunn_layer1",
    "layer2": "unconventional:dc/superman_gunn_layer2",
    "boots": "unconventional:dc/superman_gunn_boots",
    "cape": "unconventional:dc/superman_gunn_cape",
    "heat_vision": "unconventional:dc/superman_dcu_heat_vision"
});

var utils = implement("fiskheroes:external/utils");
var capes = implement("fiskheroes:external/capes");
var bfu = implement("unconventional:external/boosted_flight_utils");

var cape;

var sonic_boom_visual;

function init(renderer) {
    parent.init(renderer);
    renderer.setTexture((entity, renderLayer) => {
        if (renderLayer == "LEGGINGS") {
            return "layer2";
        }
        if (renderLayer == "BOOTS") {
            return "boots";
        }
        return "layer1";
    });

    renderer.setLights((entity, renderLayer) => renderLayer == "CHESTPLATE" && entity.getData("fiskheroes:heat_vision_timer") ? "heat_vision" : null);

    renderer.showModel("CHESTPLATE", "head", "body", "rightArm", "leftArm", "rightLeg", "leftLeg");
}

function initEffects(renderer) {
    var physics = renderer.createResource("CAPE_PHYSICS", null);
    physics.weight = 1.6;
    physics.maxFlare = 0.4;
    physics.flareDegree = 0.3;
    physics.flareFactor = 0.3;
    physics.flareElasticity = 4;
    physics.setTickHandler(entity => {
        if (entity.getData("fiskheroes:flight_timer")) {
            var f = 1 - entity.getData("fiskheroes:flight_timer");
            f = 1 - f * f * f;
            physics.headingAngle = 90 - f * 20;
            physics.restAngle = f * 5;
            physics.restFlare = f * 1.6;
            physics.idleFlutter = 0.15 + 0.25 * f;
        }
        if (entity.getData("unconventional:dyn/sonic_boom_cooldown")) {
            var b = 1 - entity.getData("unconventional:dyn/sonic_boom_cooldown");
            b = 1 - b * b * b;
            physics.restFlare = b * 0.1;
            physics.idleFlutter = 0.25 + 0.35 * b;
        }
    });

    cape = capes.createDefault(renderer, 24, "fiskheroes:cape_default.mesh.json", physics);
    cape.effect.texture.set("cape");
    cape.effect.width = 14;

    utils.addCameraShake(renderer, 0.015, 0.75, "fiskheroes:flight_boost_timer");
    utils.addCameraShake(renderer, 0.055, 0.75, "unconventional:dyn/sonic_boom_timer");
    var shake = renderer.bindProperty("fiskheroes:camera_shake").setCondition(entity => {
        shake.factor = entity.isSprinting() && entity.getData("fiskheroes:flying") ? 0.15 * Math.sin(Math.PI * entity.getInterpolatedData("fiskheroes:flight_boost_timer")) : 0;

        if (entity.getData("unconventional:dyn/sonic_boom") > 0) {
            shake.factor += 0.35 * Math.sin(Math.PI * entity.getInterpolatedData("unconventional:dyn/sonic_boom_timer"));
        }
        return true;
    });
    shake.intensity = 0.05;
    
    sonic_boom_visual = utils.createLines(renderer, "unconventional:sonic_boom", 0xF2F7EF, [
        {"start": [0, -6.0, 0], "end": [0.0, -7.0, 0.0], "size": [16.0, 16.0]},
        {"start": [0, -8.0, 0], "end": [0.0, -7.0, 0.0], "size": [16.0, 16.0]},

        {"start": [0, -9.0, 0], "end": [0.0, -8.0, 0.0], "size": [12.0, 12.0]},
        {"start": [0, -10.0, 0], "end": [0.0, -9.0, 0.0], "size": [12.0, 12.0]},
        {"start": [0, -11.0, 0], "end": [0.0, -10.0, 0.0], "size": [12.0, 12.0]},

        {"start": [0, -12.0, 0], "end": [0.0, -11.0, 0.0], "size": [8.0, 8.0]},
        {"start": [0, -13.0, 0], "end": [0.0, -12.0, 0.0], "size": [8.0, 8.0]},
        {"start": [0, -14.0, 0], "end": [0.0, -13.0, 0.0], "size": [8.0, 8.0]}
    ]);
    sonic_boom_visual.anchor.set("body");
    sonic_boom_visual.setRotation(-0.5, 0.0, 0.0);


    utils.bindTrail(renderer, "fiskheroes:shazam");

    utils.bindBeam(renderer, "fiskheroes:heat_vision", "fiskheroes:heat_vision", "head", 0xC6061A, [
        { "firstPerson": [2.2, 0.0, 2.0], "offset": [1.5, -3.3, -4.0], "size": [1.0, 0.5] },
        { "firstPerson": [-2.2, 0.0, 2.0], "offset": [-1.5, -3.3, -4.0], "size": [1.0, 0.5] }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_heat_vision"));
    

    utils.bindBeam(renderer, "fiskheroes:charged_beam", "unconventional:freeze_breath_dcu", "head", 0xBAFFFF, [
        { "firstPerson": [0.0, 3.0, 3.0], "offset": [0.0, -1.0, -4.0], "size": [1.0, 1.0] }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "unconventional:impact_freeze_breath"));
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);

    bfu.addFlightAnimation(renderer, "superman_dcu.FLIGHT", "unconventional:flight/superman_dcu.anim.json");
    utils.addHoverAnimation(renderer, "superman_dcu.HOVER", "fiskheroes:flight/idle/neutral");
    addAnimationWithData(renderer, "superman_dcu.ROLL", "fiskheroes:flight/barrel_roll", "fiskheroes:barrel_roll_timer")
        .priority = 10;
}

function render(entity, renderLayer, isFirstPersonArm) {
    if (renderLayer == "CHESTPLATE") {
        cape.render(entity);

        var sb = entity.getData("unconventional:dyn/sonic_boom") > 0 ? Math.sin(Math.PI * entity.getInterpolatedData("unconventional:dyn/sonic_boom_timer")) : 0;
        var pitch = entity.rotPitch() * Math.PI / 180;
        sonic_boom_visual.setOffset(0, 10 + 20 * sb, 7);
        sonic_boom_visual.setScale(2 + 26 * sb, 1, 2 + 26 * sb);
        sonic_boom_visual.opacity = 0.0 + 0.25 * sb;
        sonic_boom_visual.progress = sb
        sonic_boom_visual.render();
    }
}
