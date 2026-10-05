extend("fiskheroes:hero_basic");
loadTextures({
	"hair": "unconventional:marvel/wanda/wanda_hair",
    "chest": "unconventional:marvel/wanda/wanda_chest",
    "coat": "unconventional:marvel/wanda/coat",
    "coat_hair": "unconventional:marvel/wanda/wanda_coat_hair",
    "pants": "unconventional:marvel/wanda/wanda_pants",
    "pants_coat": "unconventional:marvel/wanda/wanda_pants_coat",
    "boots": "unconventional:marvel/wanda/wanda_boots"
});

var utils = implement("fiskheroes:external/utils");
var boosters = implement("unconventional:external/bloom_booster_wanda");
var chest;

var coatRightLeg;
var coatLeftLeg;

var psionic_energy_arm;
var psionic_energy_arm1;
var psionic_energy_beam;
var psionic_energy_beam1;
var psionic_energy_shield;
var psionic_energy_body;
var psionic_energy_legs;
var psionic_energy_landing;

var psionic_booster;

function init(renderer) {
    parent.init(renderer);
    renderer.setTexture((entity, renderLayer) => {
         if (renderLayer == "CHESTPLATE") {
            return entity.getWornHelmet().suitType() == $SUIT_NAME ? "coat_hair" : "chest";
        }
        else if (renderLayer == "LEGGINGS") {
            return entity.getWornChestplate().suitType() == $SUIT_NAME ? "pants_coat" : "pants";
        }
        return renderLayer == "HELMET" ? "hair" : "boots";
    });

    renderer.showModel("HELMET", "head", "body");
    
    renderer.showModel("CHESTPLATE", "body", "rightArm", "leftArm", "rightLeg", "leftLeg");
}

function initEffects(renderer) {
    parent.initEffects(renderer);
    chest = renderer.createEffect("fiskheroes:chest");
    chest.setExtrude(1).setYOffset(1);

    renderer.bindProperty("fiskheroes:spellcasting").colorGeneric.set(0x800000);

    utils.addCameraShake(renderer, 0.5, 3.75, "fiskheroes:dyn/superhero_landing_timer");

    //Particles
    utils.bindCloud(renderer, "fiskheroes:telekinesis", "unconventional:wanda_tele");

    utils.bindParticles(renderer, "unconventional:wanda_flight").setCondition(entity => entity.getData("fiskheroes:flying") 
    || entity.getData("fiskheroes:aiming")
    || entity.getData("fiskheroes:dyn/superhero_landing_timer") > 0.3);
    
    utils.bindParticles(renderer, "unconventional:wanda_flight_legs").setCondition(entity => entity.getData("fiskheroes:flying") && entity.getData("fiskheroes:aiming")
    || entity.getData("fiskheroes:flying") && entity.getData("fiskheroes:shield_blocking"));
    utils.bindParticles(renderer, "unconventional:wanda_beam_aim").setCondition(entity => entity.getData("fiskheroes:beam_charging"));

    var model_coatRightLeg = renderer.createResource("MODEL", "unconventional:coat_rightLeg");
    model_coatRightLeg.texture.set("coat");
    coatRightLeg = renderer.createEffect("fiskheroes:model").setModel(model_coatRightLeg);
    coatRightLeg.anchor.set("rightLeg");

    var model_coatLeftLeg = renderer.createResource("MODEL", "unconventional:coat_leftLeg");
    model_coatLeftLeg.texture.set("coat");
    coatLeftLeg = renderer.createEffect("fiskheroes:model").setModel(model_coatLeftLeg);
    coatLeftLeg.anchor.set("leftLeg");

    var beam = renderer.createResource("BEAM_RENDERER", "unconventional:aura_hands");
    var psionic_fire = renderer.createResource("ICON", "unconventional:psionic_fire_layer_1");
    var color = 0xB5000F;
    psionic_booster = boosters.create(renderer, "rightArm", true, color, psionic_fire, beam).setOffset(1.0, 10.0, 0.0).setRotation(0, 0, -5).setSize(10.0, 10.0);

    //Beams
    var psionic_energy_hands_beam = renderer.createResource("BEAM_RENDERER", "unconventional:psionic_energy_hands");
    var psionic_energy_body_beam = renderer.createResource("BEAM_RENDERER", "unconventional:psionic_energy_body");
    var psionic_energy_shield_beam = renderer.createResource("BEAM_RENDERER", "unconventional:psionic_energy_shield");

    eyes = utils.createLines(renderer, "unconventional:wanda_eyes", color, [
        {"start": [-0.125, 0.0, 0.0], "end": [-0.375, 0.0, 0.0], "size": [1.0, 1.0]},
        {"start": [0.125, 0.0, 0.0], "end": [0.375, 0.0, 0.0], "size": [1.0, 1.0]}
    ]);
    eyes.anchor.set("head");
    eyes.setOffset(0.0, -3.5, -3.55).setRotation(0, 0, 0.0).setScale(8.0, 8.0, 8.0);

    eyes_core = utils.createLines(renderer, "unconventional:wanda_eyes_core", color, [
        {"start": [-0.15, 0.0, 0.0], "end": [-0.225, 0.0, 0.0], "size": [1.0, 1.0]},
        {"start": [0.15, 0.0, 0.0], "end": [0.225, 0.0, 0.0], "size": [1.0, 1.0]}
    ]);
    eyes_core.anchor.set("head");
    eyes_core.setOffset(0.0, -3.5, -3.8).setRotation(0, 0, 0.0).setScale(8.0, 8.0, 8.0);

    //Psionic Arms
    beam_arms = utils.createLines(renderer, "unconventional:aura_hands", color, [
        {"start": [0.0, 0.0, 0.0], "end": [0.0, -0.4, 0.0], "size": [4.8, 2.45]},
        {"start": [0.1575, 0.0, -0.065], "end": [0.1575, -0.35, -0.065], "size": [2.5, 1.25]}
    ]);
    beam_arms.anchor.set("rightArm");
    beam_arms.setOffset(2.0, 10.25, 0.0).setRotation(0, 0, 0.0).setScale(16.0, 12.0, 16.0);


    beam_arms1 = utils.createLines(renderer, "unconventional:aura_hands", color, [
        {"start": [0.0, 0.0, 0.0], "end": [0.0, -0.4, 0.0], "size": [4.8, 2.45]},
        {"start": [-0.1575, 0.0, -0.065], "end": [-0.1575, -0.35, -0.065], "size": [2.5, 1.25]}
    ]);
    beam_arms1.anchor.set("leftArm");
    beam_arms1.setOffset(-2.0, 10.25, 0.0).setRotation(0, 0, 0.0).setScale(16.0, 12.0, 16.0);

	
	var cstl_arm_core = {"start": [0, 0.5, 0], "end": [0.0, 1.0, 0.0], "size": [10.0, 3.0]}
        beam_arms_core = utils.createLines(renderer, psionic_energy_hands_beam, color, [cstl_arm_core]);
        beam_arms_core.anchor.set("rightArm");
        beam_arms_core.setOffset(1, 4.25, 0).setRotation(0.0, 0.0, 0.0).setScale(8.35, 6.0, 8.35);

        beam_arms_core1 = utils.createLines(renderer, psionic_energy_hands_beam, color, [cstl_arm_core]);
        beam_arms_core1.anchor.set("leftArm");
        beam_arms_core1.setOffset(-1, 4.25, 0).setRotation(0.0, 0.0, 0.0).setScale(8.35, 6.0, 8.35);

            //Psionic Shield Arm
		var cstl_arm_shield = {"start": [0, 0.0, 0], "end": [0.0, 0.5, 0.0], "size": [10.0, 2.5]}
            psionic_energy_beam = utils.createLines(renderer, psionic_energy_shield_beam, color, [cstl_arm_shield]);
            psionic_energy_beam.anchor.set("rightArm");
            psionic_energy_beam.setOffset(1.0, 10.25, 0.0).setRotation(0.0, 0.0, 0.0);

            psionic_energy_beam1 = utils.createLines(renderer, psionic_energy_shield_beam, color, [cstl_arm_shield]);
            psionic_energy_beam1.anchor.set("rightArm");
            psionic_energy_beam1.setOffset(1.0, 10.25, 0.0).setRotation(0.0, 0.0, 0.0);
            psionic_energy_beam1.mirror = true;

    //Psionic Body
	var cstl_body = {"start": [0, 0.0, 0], "end": [0.0, 5.0, 0.0], "size": [10.0, 10.0]}
    psionic_energy_body = utils.createLines(renderer, psionic_energy_body_beam, color, [cstl_body]);
    psionic_energy_body.anchor.set("body");
    psionic_energy_body.setOffset(0, 6.0, 0).setRotation(0.0, 0.0, 0.0).setScale(16.0, 4.0, 16.0);

    //Psionic Legs
    psionic_energy_legs = utils.createLines(renderer, psionic_energy_body_beam, color, [cstl_body]);
    psionic_energy_legs.anchor.set("rightLeg");
    psionic_energy_legs.setOffset(0, -1.0, 0).setRotation(0.0, 0.0, 2.5).setScale(12.0, 3.5, 12.0);
    psionic_energy_legs.mirror = true;

    //Psionic Landing
	var cstl_landing = {"start": [0, 1.0, 0], "end": [0.0, 1.05, 0.0], "size": [10.0, 2.5]}
    psionic_energy_landing = utils.createLines(renderer, psionic_energy_shield_beam, color, [cstl_landing]);
    psionic_energy_landing.anchor.set("body");
    psionic_energy_landing.setOffset(0, 11.25, -2.0).setRotation(-35.0, 0.0, -2.0).setScale(-120, 5, -80);

    //Psionic Shield
    psionic_energy_shield = utils.createLines(renderer, psionic_energy_shield_beam, color, [cstl_landing]);
    psionic_energy_shield.anchor.set("head");

    //Psionic Blasts
    var psionic_blast = renderer.createResource("BEAM_RENDERER", "unconventional:psionic_energy_blast");
    
    var constln = renderer.createResource("BEAM_CONSTELLATION", null);
    var psionic_blast_beam = constln.bindBeam({
        "firstPerson": [-5.0, 3.75, -7.5],
        "offset": [-0.5, 6.0, 0.0],
        "size": [6.0, 6.0, -6.0]
    });
    
    var repulsor_blast = renderer.bindProperty("fiskheroes:repulsor_blast");
    repulsor_blast.setConstellation(constln);
    repulsor_blast.setRenderer(psionic_blast);
    repulsor_blast.color.set(color);
    
    repulsor_blast.setCondition(entity => {
		var dual = Math.random() < 0.5 ? 1 : -1;
		repulsor_blast.setAnchor(dual == 1 ? "rightArm" : "leftArm");
		psionic_blast_beam.firstPerson.x = -5.0*dual;
		psionic_blast_beam.offset.x = -0.5*dual;
        return true;
    });

    //Psionic Beam Blast
    utils.bindBeam(renderer, "fiskheroes:charged_beam", "unconventional:psionic_energy_beam", "rightArm", color, [
        { "firstPerson": [-4.5, 3.75, -7.5], "offset": [-0.75, 9.0, 0.0], "size": [6.0, 6.0, -6.0] }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "unconventional:wanda_impact"));

    utils.bindBeam(renderer, "fiskheroes:charged_beam", "unconventional:psionic_energy_beam1", "rightArm", 0xFFD0CE, [
        { "firstPerson": [-4.5, 3.75, -7.5], "offset": [-0.75, 8.0, 0.0], "size": [6.0, 6.0, -6.0] }
    ]);
    
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    
    utils.addFlightAnimation(renderer, "wanda.FLIGHT", "fiskheroes:flight/propelled_hands.anim.json");
    utils.addHoverAnimation(renderer, "wanda.HOVER", "unconventional:flight/idle/propelled_hands");

    addAnimationWithData(renderer, "wanda.LAND", "unconventional:wanda_superhero_landing", "fiskheroes:dyn/superhero_landing_timer")
    .priority = -8;

    renderer.removeCustomAnimation("basic.AIMING");
    addAnimationWithData(renderer, "wanda.AIMING", "fiskheroes:dual_aiming_fpcorr", "fiskheroes:aiming_timer")
        .priority = 10;

    renderer.removeCustomAnimation("basic.BLOCKING");
    addAnimationWithData(renderer, "wanda.BLOCKING", "fiskheroes:dual_aiming_fpcorr", "fiskheroes:shield_blocking_timer")
        .priority = -5;

    renderer.removeCustomAnimation("basic.CHARGED_BEAM");
    addAnimationWithData(renderer, "wanda.BEAM", "fiskheroes:aiming", "fiskheroes:beam_charge");

    // addAnimationWithData(renderer, "wanda.SPELL", "unconventional:wanda_blind_spell.anim.json", "fiskheroes:spellcast_timer")
    // .priority = -10;

    addAnimation(renderer, "wanda.SPELL", "unconventional:wanda_blind_spell.anim.json").setData((entity, data) => {
		data.load(entity.getInterpolatedData("fiskheroes:spellcast_timer"));
    })
	.priority = -10;

    renderer.reprioritizeDefaultAnimation("PUNCH", -9);
    renderer.reprioritizeDefaultAnimation("AIM_BOW", -9);
}

function render(entity, renderLayer, isFirstPersonArm) {

    var large = entity.world().getEntityById(entity.getData("fiskheroes:grab_id")).getData("fiskheroes:scale") >= 1.2 || entity.world().getEntityById(entity.getData("fiskheroes:grab_id")).getEntityName() == "VillagerGolem" || entity.world().getEntityById(entity.getData("fiskheroes:grab_id")).isWearingFullSuit() == "fiskheroes:vision";
    
    var item = entity.getWornChestplate();
    var hash = item.nbt().getInteger("Upgrades");
    var slot = 0;
    var level = hash >> 5 * slot & 0xF;

    var shield = entity.getInterpolatedData("fiskheroes:shield_blocking_timer");

    var opacity = level ? Math.max(shield) : 0;
	
	var flight = entity.getInterpolatedData("fiskheroes:flight_timer");
	var flying = entity.getInterpolatedData("fiskheroes:flying");
	var flying_s = flight && entity.isSprinting();
	var flight_boost = entity.getInterpolatedData("fiskheroes:flight_boost_timer");

	var fists = entity.getInterpolatedData("unconventional:dyn/psionic_fists_timer");
	var aiming = entity.getInterpolatedData("fiskheroes:aiming_timer");
	var aiming_hand = entity.getInterpolatedData("fiskheroes:beam_charge");
	var shield = entity.getInterpolatedData("fiskheroes:shield_blocking_timer");

	var fist_flying_aiming = fists && flight && aiming || fists && flight && shield;

	var landing = entity.getData("fiskheroes:dyn/superhero_landing_ticks")>0 ? Math.max((5/3)*(entity.getInterpolatedData("fiskheroes:dyn/superhero_landing_timer")-0.4),0) : Math.max((10/3)*(entity.getInterpolatedData("fiskheroes:dyn/superhero_landing_timer")-0.7),0);

	if (renderLayer == "HELMET") {
		
		eyes.opacity = large || opacity;
		eyes.render();
		eyes_core.opacity = large || opacity;
		eyes_core.render();
	}
	else if (renderLayer == "CHESTPLATE") {

		beam_arms.opacity = beam_arms_core.opacity = fists || shield || landing || aiming_hand;
		beam_arms.render();

		beam_arms1.opacity = beam_arms_core1.opacity = fists || shield || landing;
		beam_arms1.render();

		beam_arms_core.render();
		beam_arms_core1.render();

		psionic_energy_beam.setScale(0 -12*aiming_hand, 0 +7*shield, 0 -12*aiming_hand);
		psionic_energy_beam.opacity = aiming_hand;
		psionic_energy_beam.progress = aiming_hand;
		psionic_energy_beam.render();

		var f = Math.min(Math.max(flight_boost * 3 - 1.25, 0), 1);
		f = entity.isSprinting() ? 0.5 - Math.cos(2 * f * Math.PI) / 2 : 0;
		psionic_energy_beam1.setScale(0 - f*20, 0 + f*7, 0 - f*20);
		psionic_energy_beam1.progress = psionic_energy_beam1.opacity = flight_boost;
		psionic_energy_beam1.render();

		psionic_energy_landing.progress = landing;
		psionic_energy_landing.render();

		psionic_energy_body.opacity = psionic_energy_body.progress = fist_flying_aiming;
		psionic_energy_body.render();

		var pitch = entity.rotPitch() * Math.PI / 180;
		psionic_energy_shield.setOffset(0, 2 * Math.cos(pitch), -18 - 12 * Math.pow(Math.sin(Math.max(pitch, 0)), 2));
		psionic_energy_shield.setRotation(90.0, 0.0, 0.0)
		psionic_energy_shield.setScale(0 -95*shield, 0 +5*shield, 0 -70*shield);
		psionic_energy_shield.opacity = shield;
		psionic_energy_shield.progress = shield;
		psionic_energy_shield.anchor.ignoreAnchor(isFirstPersonArm);

		psionic_energy_shield.render();
    
		if (!isFirstPersonArm) {
			coatRightLeg.render();
			coatLeftLeg.render();
			
			chest.render();

			psionic_booster.speedScale = 0.5 * flight_boost;
			psionic_booster.flutter = 1 + flight_boost;
		
			var f = Math.min(Math.max(flight_boost * 3 - 1.25, 0), 1);
			f = entity.isSprinting() ? 0.5 - Math.cos(2 * f * Math.PI) / 2 : 0;
			psionic_booster.setSize(3.0 + f * 2, 1.0 - f * 2);
			psionic_booster.progress = flight_boost;
			psionic_booster.render(entity, flight_boost);
		}
	}
	else if (renderLayer == "LEGGINGS") {
		psionic_energy_legs.opacity = fist_flying_aiming || landing;
        psionic_energy_legs.progress = fist_flying_aiming;
        psionic_energy_legs.render();
    }
}