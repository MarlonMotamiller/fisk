function bindScopedBeam(renderer, beam, color, entries, scopeOffset) {
    var prop = renderer.bindBeamProperty();
    var constln = renderer.createResource("BEAM_CONSTELLATION", null);
    var array = [ ];

    for (var i = 0; i < entries.length; ++i) {
        var e = entries[i];
        var b = constln.bindBeam({
            "firstPerson": [0, 0, 0], "offset": e.offset, "size": e.size
        });
        array.push({ beam: b, entry: e });
    }

    if (typeof beam === "string") {
        beam = renderer.createResource("BEAM_RENDERER", beam);
    }

    var condition = entity => {
        var scope = entity.getData("fiskheroes:scope_timer");
        array.forEach(obj => {
            var pos = obj.entry.firstPerson;
            obj.beam.firstPerson.set(pos[0] + scopeOffset[0] * scope, pos[1] + scopeOffset[1] * scope, pos[2] + scopeOffset[2] * scope);
        });
        return true;
    };

    if (typeof color === "function") {
        var c = condition;
        condition = entity => {
            c(entity);
            prop.color.set(color(entity));
            return true;
        };
    }
    else {
        prop.color.set(color);
    }

    prop.setConstellation(constln);
    prop.setRenderer(beam);
    prop.setCondition(condition);
    return prop;
}

function bindBeam(renderer, beam, color, entries) {
    var prop = renderer.bindBeamProperty();
    var constln = renderer.createResource("BEAM_CONSTELLATION", null);

    for (var i = 0; i < entries.length; ++i) {
        constln.bindBeam(entries[i]);
    }

    if (typeof beam === "string") {
        beam = renderer.createResource("BEAM_RENDERER", beam);
    }

    prop.setConstellation(constln);
    prop.setRenderer(beam);

    if (typeof color === "function") {
        prop.setCondition(entity => {
            prop.color.set(color(entity));
            return true;
        });
    }
    else {
        prop.color.set(color);
    }
    
    return prop;
}

function createModel(renderer, modelType, texture, textureLights) {
    var model = renderer.createResource("MODEL", modelType);

    if (typeof textureLights !== "undefined") {
        model.texture.set(texture, textureLights);
    }
    else {
        model.texture.set(texture);
    }

    return model;
}

function createLines(renderer, beam, color, entries) {
    var lines = renderer.createLineEffect();
    var shape = renderer.createResource("SHAPE", null);

    for (var i = 0; i < entries.length; ++i) {
        shape.bindLine(entries[i]);
    }

    if (typeof beam === "string") {
        beam = renderer.createResource("BEAM_RENDERER", beam);
    }

    lines.setShape(shape);
    lines.setRenderer(beam);
    lines.color.set(color);
    return lines;
}

function teamBasedColor(defaultColor) {
    return entity => getTeamBasedColor(entity, defaultColor);
}

function getTeamBasedColor(entity, defaultColor) {
    var s = entity.team().name();
    return s == "fisktag_RED" ? 0xFF0000 : s == "fisktag_BLUE" ? 0x0011FF : defaultColor;
}

function setTeamBasedTexture(entity, texture, lightTexture) {
    var s = entity.team().name();
    var tex = s == "fisktag_RED" ? "red" : s == "fisktag_BLUE" ? "blue" : "base";

    if (typeof lightTexture !== "undefined") {
        texture.set(tex, lightTexture);
    }
    else {
        texture.set(tex);
    }
}

function setTeamBasedTextures(entity, texture, lightTexture) {
    var s = entity.team().name();
    var tex = s == "fisktag_RED" ? "red" : s == "fisktag_BLUE" ? "blue" : "base";

    if (typeof lightTexture !== "undefined") {
        texture.set(tex, lightTexture);
    }
    else {
        texture.set(tex);
    }
}
