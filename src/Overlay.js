/**
 * BMap.Layer
 */

import {addEvent} from './Util.js'

/**
 * 开启双击删除操作
 * @return {[type]} [description]
 */
BMap.Overlay.prototype.enableDoubleClickDel = function() {
    addEvent(this, {dblclick: true})
}

/**
 * add overlay to a layer
 * @param {[string]} name name of layer
 */
BMap.Overlay.prototype.addToLayer = function(name = DEFAULT_FEATURE_NAME) {
    let layer = this.map.layers[name];
    if (!layer) {
        layer = new BMap.Layer(this.map, name)
    }
    this.layer = layer;
    layer.add(this);
    return this;
}

/**
 * overlay to geojson
 * @return {object} geojson object
 */
BMap.Overlay.prototype.toGeoJSON = function() {
    let geom = {
        "type": "",
        "coordinates": []
    };
    let feature = {
        type: 'Feature',
        properties: {},
        geometry: geom
    };
    if (this instanceof BMap.Polygon) {
        geom.type = 'Polygon';
        geom.coordinates = [[]];
        this.getPath().forEach(k=>{
            geom.coordinates[0].push([k.lng, k.lat])
        })
    } 
    if (this instanceof BMap.Polyline) {
        geom.type = 'LineString';
        this.getPath().forEach(k=>{
            geom.coordinates.push([k.lng, k.lat])
        })
    } 
    if (this instanceof BMap.Marker) {
        geom.type = 'Point';
        let {lng, lat} = this.getPosition()
        geom.coordinates = [lng, lat]
    } 
    return feature
}
