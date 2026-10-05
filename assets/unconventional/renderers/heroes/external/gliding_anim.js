function addGlideAnimation(renderer, name, value, dataLoader) {
    var anim = renderer.createResource("ANIMATION", value);
    renderer.addCustomAnimation(name, anim);
    if (typeof dataLoader === "undefined") {
        anim.setData((entity, data) => {
            data.load(1, entity.getInterpolatedData("fiskheroes:gliding_timer"));
        });
    }
    else {
        anim.setData((entity, data) => dataLoader(entity, data));
    }
    anim.priority = -10;
    renderer.reprioritizeDefaultAnimation("PUNCH", -9);
    renderer.reprioritizeDefaultAnimation("AIM_BOW", -9);
    return anim;
}

function addGlideAnimationWithLanding(renderer, name, value) {
    return addGlideAnimation(renderer, name, value, (entity, data) => {
        data.load(1, entity.getInterpolatedData("fiskheroes:gliding_timer") * (1 - entity.getInterpolatedData("fiskheroes:dyn/superhero_landing_timer")));
    });
}