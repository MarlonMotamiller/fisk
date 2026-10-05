function create(renderer, beam, color, numParts, spacing, height, size) {
    var parts = [ ];

    if (typeof beam === "string") {
        beam = renderer.createResource("BEAM_RENDERER", beam);
    }

    for (var i = 0; i < numParts; ++i) {
        var effect = renderer.createLineEffect();
        var shape = renderer.createResource("SHAPE", null);
        var z = -i * spacing;
        shape.bindLine({ "start": [0, 0, z], "end": [0, height, z], "size": size });
        effect.setShape(shape);
        effect.setRenderer(beam);
        effect.color.set(color);
        parts.push({ effect: effect, shape: shape });
    }

    return {
        setOffset: (x, y, z) => {
            parts.forEach(value => value.effect.setOffset(x, y, z));
        },
        render: (progress, color) => {
            parts.forEach((value, i) => {
                if (typeof color !== "undefined") {
                    value.effect.color.set(color);
                }
                value.effect.opacity = Math.min(progress * numParts - i, 1);
                value.effect.progress = value.effect.opacity;
                value.effect.render();
            });
        }
    };
}
