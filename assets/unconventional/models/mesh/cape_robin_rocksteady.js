var unfold;

function loadData(entity, data) {
    unfold = data.unfold;
}

function evaluate(mesh, x, y, width, length) {
    mesh.vertX *=
        (1 + unfold * y * 3.0) *
        (1 + unfold * (1 - Math.abs(x * x)) * 1.75);
    mesh.vertX += unfold * x * Math.sin(y * Math.PI) * -0.1;
    mesh.vertY *=
        (1 - unfold * x * x * 1.2) *
        (1 + unfold * 0.8);
    mesh.vertY += unfold * Math.abs(x) * Math.sin(Math.abs(y) * Math.PI) * 0.1;
}

function diagonal(x, y) {
    return Math.sin(Math.PI / 2 * Math.abs(x));
}

function spike(x) {
    if (x < 0 || x > 1) {
        return 0;
    }
    var f = Math.min(x, Math.abs(x - 1));
    return 8 * f * f * f;
}