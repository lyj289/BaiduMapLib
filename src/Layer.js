/**
 * BMap.Layer
 */
let uid = 0;

BMap.Layer = function Layer(map, option = {}) {
    this.id = uid++;
    this.overlays = [];
    let {name, alias, show} = option;
    this.name = name || `Layer${this.id}`;
    this.show = show || true
    if (alias) {
        this.alias = alias;
    }
    this.map = map;
    map.layers[name] = this;
    // this._proto = BMap.Map.prototype.__proto__;
}

BMap.Layer.prototype.add = function(overlay) {
    this.overlays.push(overlay)
}

BMap.Layer.prototype.hide = function(overlay) {
    this.overlays.forEach(k => k.hide())
}

BMap.Layer.prototype.show = function(overlay) {
    this.overlays.forEach(k => k.show())
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
