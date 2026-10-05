extend("unconventional:electro");
loadTextures({
    "layer1": "unconventional:marvel/electro/electro_mcu_layer1",
    "layer2": "unconventional:marvel/electro/electro_mcu_layer2",
    "lights": "unconventional:marvel/electro/electro_mcu_lights_layer1"
});

var color = 0xE7B13D;
var crown;

function init(renderer) {
    parent.init(renderer);
    renderer.setLights((entity, renderLayer) => {
        if (entity.getWornChestplate().nbt().getTagList("Equipment").tagCount() > 0) {
            return renderLayer == "CHESTPLATE" ? "lights" : null;
        }
        return null
    });
    renderer.setTexture((entity, renderLayer) => renderLayer == "LEGGINGS" ? "layer2" : "layer1");

    renderer.showModel("CHESTPLATE", "body", "rightArm", "leftArm");

}

function initEffects(renderer) {
    //Electro Crown Shape
    var crown_shape = renderer.createResource("SHAPE", "unconventional:electro_crown");

    //Electro Crown Beam
    var crown_beam  = renderer.createResource("BEAM_RENDERER", "unconventional:electro_mcu_crown");
    
    //Crown
    crown = renderer.createEffect("fiskheroes:lines").setShape(crown_shape).setRenderer(crown_beam);
    crown.color.set(color);
    crown.anchor.set("head");

	utils.bindTrail(renderer, "unconventional:electro_mcu").setCondition(entity => entity.getData("fiskheroes:teleport_timer") > 0);
    utils.bindTrail(renderer, "unconventional:electro_mcu_blue").setCondition(entity => entity.getData("fiskheroes:teleport_timer") > 0);
	
	var no_flicker = renderer.createResource("TRAIL", "unconventional:electro_mcu_no_flicker");
	var flicker = renderer.createResource("TRAIL", "unconventional:electro_mcu_flicker");
	var flicker_blue = renderer.createResource("TRAIL", "unconventional:electro_mcu_flicker_blue");
	var trail_yellow = renderer.bindProperty("fiskheroes:trail");
	var trail_blue = renderer.bindProperty("fiskheroes:trail");
	trail_yellow.setCondition(entity => {
		if (entity.getData("fiskheroes:shadowform")) {
			trail_yellow.setTrail(no_flicker);
		}
		else {
			trail_yellow.setTrail(flicker);
		}
		return entity.getData("fiskheroes:shadowform");
	});
	trail_blue.setCondition(entity => {
		if (entity.getData("fiskheroes:shadowform")) {
			trail_blue.setTrail(null);
		}
		else {
			trail_blue.setTrail(flicker_blue);
		}
		return entity.getData("fiskheroes:shadowform");
	});

    glow = renderer.createEffect("fiskheroes:glowerlay");
    glow.color.set(color);

	renderer.bindProperty("fiskheroes:opacity").setOpacity((entity, renderLayer) => {
        return  1 - Math.max(2*(entity.getInterpolatedData("fiskheroes:shadowform_timer")-0.5),0);
    });

	aura = auraCreate.create(renderer, color);

    //Electro Beam
    utils.bindBeam(renderer, "fiskheroes:energy_projection", "unconventional:electro_energy_projection", "rightArm", color, [
        { "firstPerson": [-5.5, 4.75, -10.0], "offset": [-0.5, 9.0, 0.0], "size": [5.0, 5.0, -5.0] },
        { "firstPerson": [5.5, 4.75, -10.0], "offset": [0.5, 9.0, 0.0], "size": [5.0, 5.0, -5.0], "anchor": "leftArm" }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "unconventional:electro_mcu_energy_projection_impact"));

    utils.bindBeam(renderer, "fiskheroes:lightning_cast", "unconventional:electro_lightning_cast", "rightArm", color, [
        { "firstPerson": [-5.5, 4.75, -10.0], "offset": [-0.5, 9.0, 0.0], "size": [0.5, 0.5, -0.5] }
    ]);
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
}

function render(entity, renderLayer, isFirstPersonArm) {
    var teleport = entity.getInterpolatedData("fiskheroes:teleport_timer");
    var mask = entity.getInterpolatedData("fiskheroes:mask_open_timer2");
    var shooting = entity.getInterpolatedData("fiskheroes:energy_projection_timer");
    var shadowform = entity.getInterpolatedData("fiskheroes:shadowform_timer");
	aura.render(entity, renderLayer, 0.6*Math.min(teleport + Math.sin(0.9*Math.PI*shadowform),1), "HELMET", "CHESTPLATE", "LEGGINGS");
    glow.opacity = Math.min(teleport + 2*shadowform,1);
    glow.render();

    if (renderLayer == "HELMET") {
        crown.opacity = Math.min(teleport + mask + shooting - shadowform,1);
        crown.render();
	}
}