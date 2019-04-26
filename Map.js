/**
 * util for BMap
 * @author liyujian <liyujian@baidu.com>
 */

let BPt = BMap.Point

const DEFAULT_FEATURE_NAME = 'tmp'

let featureOption = {
    name: DEFAULT_FEATURE_NAME
}
/**
 * 静态方法，数组 to Point
 * @param  {Array}  [lon,lat]    
 * @return {Marker} 
 */
BMap.Point.fromArray = function(lonlat) {
    return new BMap.Point(...lonlat)
}

BMap.Map.prototype.setCenter2 = function(lonlat, zoom) {
    let point
    if (Array.isArray(lonlat)) {
        point = new BMap.Point(...lonlat)
    } else {
        point = lonlat
    }
    if (!zoom) {
        zoom = this.getZoom()
    }
    this.setCenter(point, zoom)
}
/**
 * 在地图上绘制一个点(market)
 * @param  {Array}  [lon,lat]    
 * @return {Marker} 
 */
BMap.Map.prototype.addPoint = function(lonlat) {
    let point = BPt.fromArray(lonlat)
    let mark = new BMap.Marker(point)
    this.addOverlay(mark)
    let self = this
    mark.addEventListener('dblclick', function (e) {
        self.removeOverlay(this)
    });
    return mark
};
/**
 * 在地图上绘制一个临时点(market)
 * @param  {Array}  [lon,lat]    
 * @return {Marker} 
 */
BMap.Map.prototype.addTmpPoint = function(lonlat) {
    let point = BPt.fromArray(lonlat);
    if (this.tmpMk) {
        this.tmpMk.setPosition(point);
    } else {
        this.tmpMk = this.addPoint(lonlat);
    }
    return this.tmpMk
};

BMap.Map.prototype.layers = {};

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
BMap.Overlay.prototype.toGeoJson = function() {
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

function addEvent(overlay, option) {
    let {onclick, ondblclick, dbldel, confirmdel} = option;

    if (onclick && typeof(onclick) === 'function') {
        overlay.addEventListener('click', function (e) {
            onclick.call(this, e)
        });
    }
    
    // 双击删除
    // confirmdel 是否提示
    if (dbldel) {
        ondblclick = function(e){
            if (confirmdel && confirm('确认删除？')) {
                this.map.removeOverlay(this)
                return false;
            }
            if (!confirmdel) {
                this.map.removeOverlay(this)
            }
        }
    }

    if (ondblclick && typeof(ondblclick) === 'function') {
        overlay.addEventListener('dblclick', function (e) {
            ondblclick.call(this, e)
        });
    }


}

/**
 * add polygon feature
 * @param  {array} coordinates [[[lon,lat],[lon,lat]]]
 * @param  {object} option
 * @return {BMap.Polygon}             
 */
BMap.Map.prototype.polygon = function(coordinates, option = featureOption) {
    let points = coordinates[0].map(k => {
        return new BMap.Point(...k) 
    })
    let polygon = new BMap.Polygon(points, {
        strokeColor: "red",
        strokeWeight: 2, 
        strokeOpacity: 0.5
    });
    this.addOverlay(polygon);
    let {name} = option;
    polygon.addToLayer(name);

    addEvent(polygon, option)

    return polygon;
}

/**
 * add polyline feature
 * @param  {array} coordinates [[lon,lat], [lon,lat]]
 * @param  {object} option
 * @return {BMap.Polyline}             
 */
BMap.Map.prototype.polyline = function(coordinates, option = featureOption) {
    let points = coordinates.map(k => {
        return new BMap.Point(...k) 
    })
    let polyline = new BMap.Polyline(points, {
        strokeColor: "blue",
        strokeWeight: 2, 
        strokeOpacity: 0.5
    });
    this.addOverlay(polyline);

    let {name} = option;
    polyline.addToLayer(name);
    addEvent(polyline, option)
    return polyline;
}

/**
 * add point feature
 * @param  {array} coordinates [lon,lat]
 * @param  {object} option
 * @return {BMap.Marker}             
 */
BMap.Map.prototype.point = function(coordinates, option = featureOption) {
    let point = new BMap.Point(...coordinates);
    let marker = new BMap.Marker(point);
    this.addOverlay(marker);

    let {name} = option;
    marker.addToLayer(name);
    addEvent(polyline, option)

    return marker;
}

/**
 * add point feature
 * @param  {object} coordinates geojson.feature
 * @param  {object} option
 * @return {BMap.Overlay}             
 */
BMap.Map.prototype.addFeature = function(feature, option = featureOption) {
    let geom = feature.geometry;
    let type = geom.type;
    let {name} = option;
    let coordinates = geom.coordinates;
    let overlay;
    if (type === 'Polygon') {
        overlay = this.polygon(coordinates, option)
    }
    if (type === 'LineString') {
        overlay = this.polyline(coordinates, option)
    }
    if (type === 'Point') {
        overlay = this.point(coordinatesm, option)
    }
    return overlay;
}

/**
 * add geojson feature
 * @param  {FeatureCollection|Feature|Geometry|[Feature]} geojson 
 * @param  {object} option
 * @return {BMap.Overlay}             
 */
BMap.Map.prototype.geoJson = function(geojson, option = featureOption) {
    try {
        let features = (typeof(geojson) !== 'object') 
            ? JSON.parse(geojson) : geojson;
        let overlay;
        if (features.type === 'FeatureCollection') {
            overlay = [];
            features.features.forEach(k => {
                overlay.push(this.addFeature(k, option))
            })
        }
        if (Array.isArray(features)) {
            overlay = [];
            features.forEach(k => {
                overlay.push(this.addFeature(k, option))
            })
        }

        if (features.type === 'Feature') {
            overlay = this.addFeature(features, option)    
        }
        if (features.type === 'Polygon') {
            overlay = this.polygon(features.coordinates, option)
        }
        if (features.type === 'LineString') {
            overlay = this.polyline(features.coordinates, option)
        }
        if (features.type === 'Point') {
            overlay = this.point(features.coordinates, option)
        }

        return overlay

    } catch (error) {
        
        return null;
    }
}

/**
 * get map bound min and max lonlat
 * @return {object}
 */
BMap.Map.prototype.getMbr = function() {
    let bound = this.getBounds()
    let {lng: xmin, lat: ymin} = bound.getSouthWest();
    let {lng: xmax, lat: ymax} = bound.getNorthEast();

    return {
        xmin,
        xmax,
        ymin,
        ymax,
    }
}
export default {};