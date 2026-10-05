function create(renderer, color) {
	function createLines(entries) {
		var lines = renderer.createEffect("fiskheroes:lines");
		var shape = renderer.createResource("SHAPE", null);
		for (var i = 0; i < entries.length; ++i) {
			shape.bindLine(entries[i]);
		}
		lines.setShape(shape);
		lines.setRenderer(renderer.createResource("BEAM_RENDERER", "unconventional:aura_beam"));
		lines.color.set(color);
		return lines;
	}
	
	var head = {"start": [0.0, 0.0, 0.0], "end": [0.0, -1.0, 0.0], "size": [8.0, 8.0]};
	var limb = {"start": [0.0, 0.0, 0.0], "end": [0.0, -1.0, 0.0], "size": [4.0, 4.0]};
	var limb2 = {"start": [0.0, 0.0, 0.0], "end": [0.0, -1.0, 0.0], "size": [12.0, 4.0]};
    var aura_head = createLines([head]);
    aura_head.anchor.set("head");
    aura_head.setOffset(0.0, 0.0, 0.0).setRotation(0, 0, 0.0).setScale(16.0, 8.0, 16.0);

    var aura_head2 = createLines([head]);
    aura_head2.anchor.set("head");
    aura_head2.setOffset(0.0, -4.0, 4.0).setRotation(90, 0, 0.0).setScale(16.0, 8.0, 16.0);

    var aura_body = createLines([
        {"start": [0.0, 0.0, 0.0], "end": [0.0, -1.0, 0.0], "size": [4.0, 8.0]}
    ]);
    aura_body.anchor.set("body");
    aura_body.setOffset(0.0, 12.0, 0.0).setRotation(0, 0, 0.0).setScale(16.0, 12.0, 16.0);
	
	var aura_body2 = createLines([
        {"start": [-0.25, 0.0, 0.0], "end": [0.25, 0.0, 0.0], "size": [2.0, 16.0]}
    ]);
    aura_body2.anchor.set("body");
    aura_body2.setOffset(0.0, 6.0, 0.0).setRotation(0, 0, 0.0).setScale(16.0, 12.0, 16.0);

    var aura_arms = createLines([limb]);
    aura_arms.anchor.set("rightArm");
    aura_arms.setOffset(1.0, 10.0, 0.0).setRotation(0, 0, 0.0).setScale(16.0, 12.0, 16.0);
    aura_arms.mirror = true;

    var aura_arms2 = createLines([limb2]);
    aura_arms2.anchor.set("rightArm");
    aura_arms2.setOffset(1.0, 4.0, 2.0).setRotation(90, 0, 0.0).setScale(16.0, 4.0, 16.0);
    aura_arms2.mirror = true;

    var aura_legs = createLines([limb]);
    aura_legs.anchor.set("rightLeg");
    aura_legs.setOffset(0.0, 12.0, 0.0).setRotation(0, 0, 0.0).setScale(16.0, 12.0, 16.0);
    aura_legs.mirror = true;

    var aura_legs2 = createLines([limb2]);
    aura_legs2.anchor.set("rightLeg");
    aura_legs2.setOffset(0.0, 6.0, 2.0).setRotation(90, 0, 0.0).setScale(16.0, 4.0, 16.0);
    aura_legs2.mirror = true;
	
	return {
		aura_head: aura_head,
		aura_head2: aura_head2,
		aura_body: aura_body,
		aura_body2: aura_body2,
		aura_arms: aura_arms,
		aura_arms2: aura_arms2,
		aura_legs: aura_legs,
		aura_legs2: aura_legs2,
		render: (entity, renderLayer, f, headRL, bodyRL, legsRL) => {
			aura_head.opacity = aura_head2.opacity = aura_body.opacity = aura_body2.opacity = aura_arms.opacity = aura_arms2.opacity = aura_legs.opacity = aura_legs2.opacity = f;
			if (renderLayer == headRL) {
				aura_head.render();
				aura_head2.render();
			}
			if (renderLayer == bodyRL) {
				aura_body.render();
				aura_body2.render();
				aura_arms.render();
				aura_arms2.render();
			}
			if (renderLayer == legsRL) {
				aura_legs.render();
				aura_legs2.render();
			}
		}
	};
}