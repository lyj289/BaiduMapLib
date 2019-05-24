/**
 * BMap.Layer
 */

import {addEvent} from './Util.js'
const DEFAULT_FEATURE_NAME = 'tmp'

/**
 * 开启双击删除操作
 * @return {[type]} [description]
 */
BMap.Overlay.prototype.enableDoubleClickDel = function(option = {confirmdel: true}) {
    addEvent(this, {
        dbldel: true,
        ...option
    })
}

/**
 * add overlay to a layer
 * @param {Layer | object} Layer or option that has name
 */
BMap.Overlay.prototype.addToLayer = function(option = {name: DEFAULT_FEATURE_NAME, 
        alias: ''}) {
    let layer;
    if (option instanceof BMap.Layer) {
        layer = option
    } else {
        let {name, alias} = option;
        layer = this.map.layers[name];
        if (!layer) {
            layer = new BMap.Layer(this.map, option)
        }
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
