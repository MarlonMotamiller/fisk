function init(renderer, trailType) {
    var shake = renderer.bindProperty("fiskheroes:camera_shake").setCondition(entity => {
        var speed = entity.getData("fiskheroes:speed");
        shake.factor = speed > 1 && entity.isSprinting() && entity.getData("fiskheroes:speed_sprinting") ? (Math.log(speed - 1) + 1) * 0.5 * Math.sin(Math.PI * entity.getInterpolatedData("fiskheroes:dyn/speed_sprint_timer")) : 0;
        return true;
    });
    shake.intensity = 0.05;

    var anim = renderer.createResource("ANIMATION", "unconventional:flash_dceu_sprint");
    anim.setData((entity, data) => data.load(entity.getInterpolatedData("fiskheroes:dyn/speed_sprint_timer")));
    renderer.addCustomAnimation("speedster.SPRINT", anim);
}

function bindTrail(renderer, trailType) {
    var prop = renderer.bindProperty("fiskheroes:trail");
    prop.setTrail(renderer.createResource("TRAIL", trailType));
    return prop;
}

function setTrails(listOfTrails,renderer) {
    var speeding = (entity) => {return entity.getData('fiskheroes:speeding')};
    var tick = (entity) => {return entity.ticksExisted() % 2};
    var trails = [bindTrail(renderer, listOfTrails[0]), bindTrail(renderer, listOfTrails[1]), bindTrail(renderer, listOfTrails[2])];

    trails[0].setCondition(entity => tick(entity) >= 0 && tick(entity) < 1 && entity.getData("fiskheroes:speeding"));
    trails[1].setCondition(entity => tick(entity) >= 1 && speeding(entity));
    trails[2].setCondition(entity => tick(entity) >= 1 && speeding(entity));

    return trails;
}
