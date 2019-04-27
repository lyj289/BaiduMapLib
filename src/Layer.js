/**
 * BMap.Layer
 */

BMap.Layer = function Layer(map, name) {
    this.overlays = [];
    this.name = name;
    this.map = map;
    map.layers[name] = this;
}

BMap.Layer.prototype.add = function(overlay) {
    this.overlays.push(overlay)
}

BMap.Layer.prototype.remove = function(overlay) {
    // TODO
}
BMap.Layer.prototype.clear = function() {
    let map = this.map
    this.overlays.forEach(k => {
        map.removeOverlay(k)
    })
    this.overlays = []
}
