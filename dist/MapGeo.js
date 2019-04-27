(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, global.MapGeo = factory());
}(this, function () { 'use strict';

    /**
     * BMap.Layer
     * @author liyujian <liyujian@baidu.com>
     */
    BMap.Layer = function Layer(map, name) {
      this.overlays = [];
      this.name = name;
      this.map = map;
      map.layers[name] = this;
    };

    BMap.Layer.prototype.add = function (overlay) {
      this.overlays.push(overlay);
    };

    BMap.Layer.prototype.remove = function (overlay) {// TODO
    };

    BMap.Layer.prototype.clear = function () {
      var map = this.map;
      this.overlays.forEach(function (k) {
        map.removeOverlay(k);
      });
      this.overlays = [];
    };

    /**
     * Util
     * @author liyujian <liyujian@baidu.com>
     */
    function addEvent(overlay, option) {
      var onclick = option.onclick,
          ondblclick = option.ondblclick,
          dbldel = option.dbldel,
          confirmdel = option.confirmdel;

      if (onclick && typeof onclick === 'function') {
        overlay.addEventListener('click', function (e) {
          onclick.call(this, e);
        });
      } // 双击删除
      // confirmdel 是否提示


      if (dbldel) {
        ondblclick = function ondblclick(e) {
          if (confirmdel && confirm('确认删除？')) {
            this.map.removeOverlay(this);
            return false;
          }

          if (!confirmdel) {
            this.map.removeOverlay(this);
          }
        };
      }

      if (ondblclick && typeof ondblclick === 'function') {
        overlay.addEventListener('dblclick', function (e) {
          ondblclick.call(this, e);
        });
      }
    }

    /**
     * BMap.Layer
     * @author liyujian <liyujian@baidu.com>
     */
    /**
     * 开启双击删除操作
     * @return {[type]} [description]
     */

    BMap.Overlay.prototype.enableDoubleClickDel = function () {
      addEvent(this, {
        dblclick: true
      });
    };
    /**
     * add overlay to a layer
     * @param {[string]} name name of layer
     */


    BMap.Overlay.prototype.addToLayer = function () {
      var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : DEFAULT_FEATURE_NAME;
      var layer = this.map.layers[name];

      if (!layer) {
        layer = new BMap.Layer(this.map, name);
      }

      this.layer = layer;
      layer.add(this);
      return this;
    };
    /**
     * overlay to geojson
     * @return {object} geojson object
     */


    BMap.Overlay.prototype.toGeoJSON = function () {
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
        this.getPath().forEach(function (k) {
          geom.coordinates[0].push([k.lng, k.lat]);
        });
      }

      if (this instanceof BMap.Polyline) {
        geom.type = 'LineString';
        this.getPath().forEach(function (k) {
          geom.coordinates.push([k.lng, k.lat]);
        });
      }

      if (this instanceof BMap.Marker) {
        geom.type = 'Point';

        var _this$getPosition = this.getPosition(),
            lng = _this$getPosition.lng,
            lat = _this$getPosition.lat;

        geom.coordinates = [lng, lat];
      }

      return feature;
    };

    /**
     * BMap.Render
     * @author liyujian <liyujian@baidu.com>
     */
    BMap.RenderMapV = function RenderMapV(map, data) {
      if (!mapv) {
        console.error('At first, needs mapv!');
        return false;
      }

      this.overlays = [];
      this.type = 'mapv';
      this.map = map;
      this.dataSet = new mapv.DataSet(data);
      var options = {
        strokeStyle: 'green',
        fillStyle: 'rgba(0,0,0,.3)',
        shadowBlur: 0,
        methods: {
          click: null
        },
        lineWidth: 3,
        draw: 'webgl'
      };
      this.mapvLayer = new mapv.baiduMapLayer(map, this.dataSet, options);
      this.mapvLayer.canvasLayer.map = map;
      this.mapvLayer.canvasLayer.canvas.classList.add('constructMap');
    };

    function _typeof(obj) {
      if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
        _typeof = function (obj) {
          return typeof obj;
        };
      } else {
        _typeof = function (obj) {
          return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
        };
      }

      return _typeof(obj);
    }

    function _defineProperty(obj, key, value) {
      if (key in obj) {
        Object.defineProperty(obj, key, {
          value: value,
          enumerable: true,
          configurable: true,
          writable: true
        });
      } else {
        obj[key] = value;
      }

      return obj;
    }

    function _objectSpread(target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);

        if (typeof Object.getOwnPropertySymbols === 'function') {
          ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
            return Object.getOwnPropertyDescriptor(source, sym).enumerable;
          }));
        }

        ownKeys.forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      }

      return target;
    }

    function _setPrototypeOf(o, p) {
      _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
        o.__proto__ = p;
        return o;
      };

      return _setPrototypeOf(o, p);
    }

    function isNativeReflectConstruct() {
      if (typeof Reflect === "undefined" || !Reflect.construct) return false;
      if (Reflect.construct.sham) return false;
      if (typeof Proxy === "function") return true;

      try {
        Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
        return true;
      } catch (e) {
        return false;
      }
    }

    function _construct(Parent, args, Class) {
      if (isNativeReflectConstruct()) {
        _construct = Reflect.construct;
      } else {
        _construct = function _construct(Parent, args, Class) {
          var a = [null];
          a.push.apply(a, args);
          var Constructor = Function.bind.apply(Parent, a);
          var instance = new Constructor();
          if (Class) _setPrototypeOf(instance, Class.prototype);
          return instance;
        };
      }

      return _construct.apply(null, arguments);
    }

    function _toConsumableArray(arr) {
      return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
    }

    function _arrayWithoutHoles(arr) {
      if (Array.isArray(arr)) {
        for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

        return arr2;
      }
    }

    function _iterableToArray(iter) {
      if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
    }

    function _nonIterableSpread() {
      throw new TypeError("Invalid attempt to spread non-iterable instance");
    }

    var BPt = BMap.Point;
    var DEFAULT_FEATURE_NAME$1 = 'tmp';
    var featureOption = {
      name: DEFAULT_FEATURE_NAME$1,
      prop: {},
      styleMap: {},
      renderer: 'svg'
      /**
       * 静态方法，数组 to Point
       * @param  {Array}  [lon,lat]    
       * @return {Marker} 
       */

    };

    BMap.Point.fromArray = function (lonlat) {
      return _construct(BMap.Point, _toConsumableArray(lonlat));
    };

    BMap.Map.prototype.setCenter2 = function (lonlat, zoom) {
      var point;

      if (Array.isArray(lonlat)) {
        point = _construct(BMap.Point, _toConsumableArray(lonlat));
      } else {
        point = lonlat;
      }

      if (!zoom) {
        zoom = this.getZoom();
      }

      this.setCenter(point, zoom);
    };
    /**
     * 在地图上绘制一个点(market)
     * @param  {Array}  [lon,lat]    
     * @return {Marker} 
     */


    BMap.Map.prototype.addPoint = function (lonlat) {
      var point = _construct(BMap.Point, _toConsumableArray(lonlat));

      var mark = new BMap.Marker(point);
      this.addOverlay(mark);
      var self = this;
      mark.addEventListener('dblclick', function (e) {
        self.removeOverlay(this);
      });
      return mark;
    };
    /**
     * 在地图上绘制一个临时点(market)
     * @param  {Array}  [lon,lat]    
     * @return {Marker} 
     */


    BMap.Map.prototype.addTmpPoint = function (lonlat) {
      var point = _construct(BMap.Point, _toConsumableArray(lonlat));

      if (this.tmpMk) {
        this.tmpMk.setPosition(point);
      } else {
        this.tmpMk = this.addPoint(lonlat);
      }

      return this.tmpMk;
    };

    BMap.Map.prototype.layers = {};
    var styleMap = {
      polyline: {
        strokeColor: "red",
        strokeWeight: 4,
        strokeOpacity: 0.5
      },
      polygon: {
        strokeColor: "blue",
        fillColor: "blue",
        strokeWeight: 2,
        fillOpacity: 0.8
      },
      point: {}
      /**
       * add polygon feature
       * @param  {array} coordinates [[[lon,lat],[lon,lat]]]
       * @param  {object} option
       * @return {BMap.Polygon}             
       */

    };

    BMap.Map.prototype.polygon = function (coordinates) {
      var option = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : featureOption;
      var points = coordinates[0].map(function (k) {
        return _construct(BMap.Point, _toConsumableArray(k));
      });

      var style = _objectSpread({}, styleMap.polygon, option.styleMap.polygon);

      var polygon = new BMap.Polygon(points, style);
      this.addOverlay(polygon);
      var name = option.name,
          prop = option.prop;
      polygon.prop = prop;
      polygon.addToLayer(name);
      addEvent(polygon, option);
      return polygon;
    };
    /**
     * add polyline feature
     * @param  {array} coordinates [[lon,lat], [lon,lat]]
     * @param  {object} option
     * @return {BMap.Polyline}             
     */


    BMap.Map.prototype.polyline = function (coordinates) {
      var option = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : featureOption;
      var points = coordinates.map(function (k) {
        return _construct(BMap.Point, _toConsumableArray(k));
      });

      var style = _objectSpread({}, styleMap.polyline, option.styleMap.polyline);

      var polyline = new BMap.Polyline(points, style);
      this.addOverlay(polyline);
      var name = option.name,
          prop = option.prop;
      polyline.prop = prop;
      polyline.addToLayer(name);
      addEvent(polyline, option);
      return polyline;
    };
    /**
     * add point feature
     * @param  {array} coordinates [lon,lat]
     * @param  {object} option
     * @return {BMap.Marker}             
     */


    BMap.Map.prototype.point = function (coordinates) {
      var option = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : featureOption;

      var point = _construct(BMap.Point, _toConsumableArray(coordinates));

      var style = _objectSpread({}, styleMap.point, option.styleMap.point);

      var marker = new BMap.Marker(point, style);
      this.addOverlay(marker);
      var name = option.name,
          prop = option.prop;
      marker.prop = prop;
      marker.addToLayer(name);
      addEvent(marker, option);
      return marker;
    };
    /**
     * add point feature
     * @param  {object} coordinates geojson.feature
     * @param  {object} option
     * @return {BMap.Overlay}             
     */


    BMap.Map.prototype.addFeature = function (feature) {
      var option = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : featureOption;
      var geom = feature.geometry;
      var type = geom.type;
      var name = option.name;
      var coordinates = geom.coordinates;
      var overlay;

      if (type === 'Polygon') {
        overlay = this.polygon(coordinates, option);
      }

      if (type === 'LineString') {
        overlay = this.polyline(coordinates, option);
      }

      if (type === 'Point') {
        overlay = this.point(coordinates, option);
      }

      return overlay;
    };
    /**
     * add geojson feature
     * @param  {FeatureCollection|Feature|Geometry|[Feature]} geojson 
     * @param  {object} option
     * @return {BMap.Overlay}             
     */


    BMap.Map.prototype.geoJSON = function (geojson) {
      var _this = this;

      var option = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : featureOption;

      try {
        var render = option.render;

        if (render === 'mapv') {
          var renderer = new BMap.RenderMapV(this, geojson);
          var overlay = renderer.mapvLayer.canvasLayer;
          return overlay.addToLayer(option.name);
        } else {
          var features = _typeof(geojson) !== 'object' ? JSON.parse(geojson) : geojson;

          var _overlay;

          if (features.type === 'FeatureCollection') {
            _overlay = [];
            features.features.forEach(function (k) {
              _overlay.push(_this.addFeature(k, option));
            });
          }

          if (Array.isArray(features)) {
            _overlay = [];
            features.forEach(function (k) {
              _overlay.push(_this.addFeature(k, option));
            });
          }

          if (features.type === 'Feature') {
            _overlay = this.addFeature(features, option);
          }

          if (features.type === 'Polygon') {
            _overlay = this.polygon(features.coordinates, option);
          }

          if (features.type === 'LineString') {
            _overlay = this.polyline(features.coordinates, option);
          }

          if (features.type === 'Point') {
            _overlay = this.point(features.coordinates, option);
          }

          return _overlay;
        }
      } catch (error) {
        console.log(error);
        return null;
      }
    };
    /**
     * get map bound min and max lonlat
     * @return {object}
     */


    BMap.Map.prototype.getMbr = function () {
      var bound = this.getBounds();

      var _bound$getSouthWest = bound.getSouthWest(),
          xmin = _bound$getSouthWest.lng,
          ymin = _bound$getSouthWest.lat;

      var _bound$getNorthEast = bound.getNorthEast(),
          xmax = _bound$getNorthEast.lng,
          ymax = _bound$getNorthEast.lat;

      return {
        xmin: xmin,
        xmax: xmax,
        ymin: ymin,
        ymax: ymax
      };
    };

    var _Map = {};

    return _Map;

}));
