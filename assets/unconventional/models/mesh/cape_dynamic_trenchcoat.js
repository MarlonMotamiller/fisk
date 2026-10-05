var flare;

function loadData(entity, data, width, length, res) {
    flare = data.flare;

    if (entity.is("DISPLAY")) {
        res.requestResolution(1, 1);
    }
    else {
        res.requestResolution(width, length);
    }
}
//Math.max(Math.abs(2*y),Math.abs(3*x)-4)<=2
//-Math.min(Math.pow(10, 118)*Math.pow(x, 400),0.4)
function evaluate(mesh, x, y, width, length) {
    var p = 0.0625;
    var tempx = width * x;
    var smd = 0.0625-p;
    var ox;
    var f = Math.sin(y * (x * x + 0.4)) * 1 * flare;
    
    if (tempx<=-1/4){
            ox = -0.55 - f;
    }
    else if (tempx>=1/4){
         ox = 0.55 + f;
    }

    else if (tempx >= -1*p && tempx <= 0*p){
        ox = 1.2*tempx - 0*f;
    }
    else if (tempx >= -2*p && tempx <= -1*p){
        ox = 1.2*tempx - 0.33*f;
    }
    else if (tempx >= -3*p && tempx <= -2*p){
        ox = 1.2*tempx - 0.66*f;
    }
    else if (tempx >= -4*p && tempx <= -3*p){
        ox = 1.2*tempx - 1*f;
    }

    else if (tempx <= 1*p && tempx >= 0*p){
        ox = 1.2*tempx + 0*f;
    }
    else if (tempx <= 2*p && tempx >= 1*p){
        ox = 1.2*tempx + 0.33*f;
    }
    else if (tempx <= 3*p && tempx >= 2*p){
        ox = 1.2*tempx + 0.66*f;
    }
    else if (tempx <= 4*p && tempx >= 3*p){
        ox = 1.2*tempx + 1*f;
    }


    
    mesh.vertX = ox
    mesh.vertY = length* y ;
    mesh.vertZ = 1.6*(-Math.max(tempx+smd,-1/4)+smd+Math.min(tempx,1/4));
}
