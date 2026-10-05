function tick(entity, manager, condition, sound, vol, pitch, incr, dec) {
    var t = entity.getData("fiskheroes:dyn/superhero_landing_ticks");

    if (t == 0 && !entity.isOnGround() && entity.motionY() < -1.0 && condition && entity.world().blockAt(entity.pos().add(0, -2, 0)).isSolid()) {
        manager.setDataWithNotify(entity, "fiskheroes:dyn/superhero_landing_ticks", t = 12);
        entity.playSound(sound, vol, pitch);
    }
    else if (t > 0) {
        manager.setData(entity, "fiskheroes:dyn/superhero_landing_ticks", --t);
    }

    manager.incrementData(entity, "fiskheroes:dyn/superhero_landing_timer", incr, dec, t > 0);
}
