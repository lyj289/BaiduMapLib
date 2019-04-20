/**
 * BaiduMap Extend
 */

/**
 * overlay to geojson
 * @return {object} geojson object
 */
BMap.Overlay.prototype.toGeoJson = function() {
    var geom = {
        "type": "",
        "coordinates": []
    };
    var feature = {
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

/**
 * add polygon feature
 * @param  {array} coordinates [[[lon,lat],[lon,lat]]]
 * @return {BMap.Polygon}             
 */
BMap.Map.prototype.polygon = function(coordinates) {
    var points = coordinates[0].map(k => {
        return new BMap.Point(...k) 
    })
    var polygon = new BMap.Polygon(points, {
        strokeColor: "red",
        strokeWeight: 2, 
        strokeOpacity: 0.5
    });
    this.addOverlay(polygon);
    return polygon;
}

/**
 * add polyline feature
 * @param  {array} coordinates [[lon,lat], [lon,lat]]
 * @return {BMap.Polyline}             
 */
BMap.Map.prototype.polyline = function(coordinates) {
    var points = coordinates.map(k => {
        return new BMap.Point(...k) 
    })
    var polyline = new BMap.Polyline(points, {
        strokeColor: "blue",
        strokeWeight: 2, 
        strokeOpacity: 0.5
    });
    this.addOverlay(polyline);
    return polyline;
}

/**
 * add point feature
 * @param  {array} coordinates [lon,lat]
 * @return {BMap.Marker}             
 */
BMap.Map.prototype.point = function(coordinates) {
    var point = new BMap.Point(...coordinates);
    var marker = new BMap.Marker(point);
    this.addOverlay(marker);
    return marker;
}

/**
 * add point feature
 * @param  {object} coordinates geojson.feature
 * @return {BMap.Overlay}             
 */
BMap.Map.prototype.addFeature = function(feature) {
    var geom = feature.geometry
    var type = geom.type;
    var coordinates = geom.coordinates;
    if (type === 'Polygon') {
        return this.polygon(coordinates)
    }
    if (type === 'LineString') {
        return this.polyline(coordinates)
    }
    if (type === 'Point') {
        return this.point(coordinates)
    }
}

/**
 * add geojson feature
 * @param  {FeatureCollection|Feature|Geometry} geojson 
 * @return {BMap.Overlay}             
 */
BMap.Map.prototype.geoJson = function(geojson) {
    try {
        var features = (typeof(geojson) !== 'object') 
            ? JSON.parse(geojson) : geojson;
        if (features.type === 'FeatureCollection') {
            features.features.forEach(k => {
                return this.addFeature(k)
            })
        }
        if (features.type === 'Feature') {
            return this.addFeature(features)    
        }
        if (features.type === 'Polygon') {
            return this.polygon(features.coordinates)
        }
        if (features.type === 'LineString') {
            return this.polyline(features.coordinates)
        }
        if (features.type === 'Point') {
            return this.point(features.coordinates)
        }
    } catch (error) {
        
        return null;
    }
}
