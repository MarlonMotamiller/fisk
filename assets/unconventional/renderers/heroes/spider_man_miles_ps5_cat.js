extend("unconventional:spider_man_miles_ps5");
loadTextures({
    "layer1": "unconventional:marvel/spider_man_miles_ps5_layer1",
    "layer2": "unconventional:marvel/spider_man_miles_ps5_layer2",
    "backpack": "unconventional:marvel/spider_man_miles_ps5_backpack",
    "bp_invis": "unconventional:marvel/spider_man_miles_ps5_backpack_invisible"
});

var utils = implement("fiskheroes:external/utils");

var backpack_model;

function init(renderer) {
    parent.init(renderer);

    renderer.setItemIcon("HELMET", "spider_man_miles_ps5_0");
    renderer.setItemIcon("LEGGINGS", "spider_man_miles_ps5_2");
    renderer.setItemIcon("BOOTS", "spider_man_miles_ps5_3");
}

function initEffects(renderer) {
    parent.initEffects(renderer);

    backpack_model = renderer.createEffect("fiskheroes:model");
    backpack_model.setModel(createModelBackpack(renderer, "unconventional:spider_man_miles_ps5_backpack", "backpack"));
}

function render(entity, renderLayer, isFirstPersonArm) {
    parent.render(entity, renderLayer, isFirstPersonArm);

    if (renderLayer == "CHESTPLATE") {
        
        backpack_model.render();
    }
}

function createModelBackpack(renderer, modelType, texture, textureLights) {
    var model = renderer.createResource("MODEL", modelType);

    if (typeof textureLights !== "undefined") {
        model.texture.set(texture, textureLights);
    }
    else {
        model.texture.set(texture);
    }
	
	model.bindAnimation("unconventional:spider_man_miles_ps5_backpack").setData((entity, data) => {
		data.load(0, entity.loop(2000)); 
		data.load(1, entity.loop(400)); 
		data.load(2, entity.loop(50));
		});

    return model;
}