function tick(entity, manager, min_motion) {
	if (entity.getData('unconventional:dyn/sprint_break_timer')==1) {
		manager.setData(entity, "unconventional:dyn/sprint_break", false);
	}
	if (!entity.isSprinting() && !entity.getData('fiskheroes:speeding') && entity.isOnGround() && entity.getData('fiskheroes:dyn/speed_sprint_timer')>0 && entity.getData('unconventional:dyn/prev_speed_sprint_timer')>0) {
		manager.setData(entity, "unconventional:dyn/sprint_break", true);
	}
	manager.incrementData(entity, "unconventional:dyn/sprint_break_timer", 3, 8,entity.getData('unconventional:dyn/sprint_break'));
	manager.incrementData(entity, 'unconventional:dyn/prev_speed_sprint_timer', 5, entity.motion().length()>min_motion);
}