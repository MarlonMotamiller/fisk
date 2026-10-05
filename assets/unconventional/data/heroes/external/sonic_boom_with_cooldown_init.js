function init(hero, sonic_boom, boostKey, sprintSpeed, tickHandler) {
    sonic_boom.addKeyBind(hero, "key.boost", boostKey);

    hero.setAttributeProfile(entity => entity.getData("fiskheroes:dyn/flight_super_boost") > 0 ? "SUPER_BOOST" : null);
    hero.addAttributeProfile("SUPER_BOOST", profile => {
        profile.inheritDefaults();
        profile.addAttribute("SPRINT_SPEED", sprintSpeed, 1);
    });

    hero.setTickHandler((entity, manager) => {
        var boost = entity.getData("unconventional:dyn/sonic_boom");
        var flying = boost > 0 || entity.getData("fiskheroes:flying");
        manager.incrementData(entity, "fiskheroes:dyn/booster_timer", 2, flying);

        sonic_boom.tick(entity, manager);
        manager.incrementData(entity, "unconventional:dyn/sonic_boom_timer", 20, 0, boost > 0);

        if (typeof tickHandler !== "undefined") {
            tickHandler(entity, manager);
        }
    });
}

