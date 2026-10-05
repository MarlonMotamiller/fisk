function create(renderer, beam, color, entries) {
    var effect = renderer.createLineEffect();
    var shape = renderer.createResource("SHAPE", null);
    var lines = [ ];

    if (typeof beam === "string") {
        beam = renderer.createResource("BEAM_RENDERER", beam);
    }

    for (var i = 0; i < entries.length; ++i) {
        lines.push(shape.bindLine(entries[i]));
    }

    effect.setShape(shape);
    effect.setRenderer(beam);
    effect.color.set(color);
    return {
        effect: effect,
        render: (offset, rot, scale) => {
            var cosR = Math.cos(rot * Math.PI / 180);
            var sinR = Math.sin(rot * Math.PI / 180);
            lines.forEach((line, i) => {
                var s = entries[i].start;
                line.start.x = (cosR * s[0] + sinR * s[1]) * scale;
                line.start.y = (cosR * s[1] - sinR * s[0]) * scale;
                line.start.z = s[2] + offset;
            });
            effect.render();
        }
    };
}
