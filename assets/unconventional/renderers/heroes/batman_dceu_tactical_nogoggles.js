extend("unconventional:batman_dceu_tactical");

function init(renderer) {
    parent.init(renderer);
    renderer.setItemIcon("CHESTPLATE", "batman_dceu_tactical_nogoggles_0");
    renderer.setItemIcon("CHESTPLATE", "batman_dceu_tactical_1");
    renderer.setItemIcon("LEGGINGS", "batman_dceu_tactical_2");
    renderer.setItemIcon("BOOTS", "batman_dceu_tactical_3");
}

function hasGoggles() {
    return false;
}