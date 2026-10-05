function create(boostTime, recoveryTime, recoveryDelay) {
    return {
        addKeyBind: (hero, boostName, boostKey) => {
            hero.addKeyBindFunc("func_BOOST", (player, manager) => {
                manager.setData(player, "unconventional:dyn/sonic_boom", 1);
                return true;
            }, boostName, boostKey);
        },
        tick: (entity, manager) => {
            var boost = entity.getData("unconventional:dyn/sonic_boom");

            if (boost == 1) {
                manager.setData(entity, "unconventional:dyn/sonic_boom", boost = 2);
                manager.setData(entity, "fiskheroes:flying", true);
                manager.setData(entity, "fiskheroes:flight_timer", entity.getData("fiskheroes:prev_flight_timer"));
                manager.setData(entity, "fiskheroes:flight_boost_timer", entity.getData("fiskheroes:prev_flight_boost_timer"));
            }
            else if (!(entity.isSprinting() && entity.getData("fiskheroes:flying")) && boost > 0) {
                manager.setData(entity, "unconventional:dyn/sonic_boom", boost = 0);
            }

            if (boost > 0) {
                manager.setData(entity, "unconventional:dyn/sonic_boom_timeout", recoveryDelay);
            }
            else {
                var t = entity.getData("unconventional:dyn/sonic_boom_timeout");
                if (t > 0) {
                    manager.setData(entity, "unconventional:dyn/sonic_boom_timeout", t - 1);
                }
            }

            manager.incrementData(entity, "unconventional:dyn/sonic_boom_cooldown", boostTime, recoveryTime, boost > 0, boost == 0 && entity.getData("unconventional:dyn/sonic_boom_timeout") == 0);

            if (boost > 0 && entity.getData("unconventional:dyn/sonic_boom_cooldown") >= 1) {
                manager.setData(entity, "unconventional:dyn/sonic_boom", 0);
            }
        },
        isModifierEnabled: (entity, modifier) => {
            if (modifier.name() == "fiskheroes:controlled_flight") {
                var boost = entity.getData("unconventional:dyn/sonic_boom");
                return boost != 1 && (modifier.id() == "boosted") == (boost > 0);
            }
            return true;
        },
        isKeyBindEnabled: (entity, keyBind) => {
            if (keyBind == "func_BOOST") {
                return entity.isSprinting() && entity.getData("fiskheroes:flying") && entity.getData("unconventional:dyn/sonic_boom") == 0 && entity.getData("unconventional:dyn/sonic_boom_cooldown") < 1;
            }
            return true;
        }
    };
}

