/* @preserve
 * mapgeo 1.1.2, baidu map lib extention, for geo. https://github.com/lyj289/BaiduMapLib#readme
 * @author jearylee 
 */

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, global.MapGeo = factory());
}(this, function () { 'use strict';

    /**
     * BMap.Layer
     */
    var uid = 0;

    BMap.Layer = function Layer(map) {
      var option = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      this.id = uid++;
      this.overlays = [];
      var name = option.name,
          alias = option.alias,
          displayInSwitcher = option.displayInSwitcher;
      this.name = name || "Layer".concat(this.id);
      this.displayInSwitcher = true;

      if ('displayInSwitcher' in option) {
        this.displayInSwitcher = displayInSwitcher;
      }

      if (alias) {
        this.alias = alias;
      }

      this.map = map;
      map.layers[name] = this; // this._proto = BMap.Map.prototype.__proto__;
    };

    BMap.Layer.prototype.add = function (overlay) {
      this.overlays.push(overlay);
    };

    BMap.Layer.prototype.hide = function (overlay) {
      this.overlays.forEach(function (k) {
        return k.hide();
      });
    };

    BMap.Layer.prototype.show = function (overlay) {
      this.overlays.forEach(function (k) {
        return k.show();
      });
    };

    BMap.Layer.prototype.remove = function (overlay) {
      this.map.removeOverlay(overlay);

      this._updateIndex(overlay);
    };

    BMap.Layer.prototype._updateIndex = function (overlay) {
      this.overlays = this.overlays.filter(function (k) {
        return k !== overlay;
      });
    };

    BMap.Layer.prototype.clear = function () {
      var map = this.map;
      this.overlays.forEach(function (k) {
        map.removeOverlay(k);
      });
      this.overlays = [];
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

    /**
     * Util
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


      if (dbldel && !ondblclick) {
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
        overlay.addEventListener('dblclick', function (event) {
          ondblclick.call(this, event);
          stopBubble(event);
        });
      }
    }

    function getEvent(event) {
      return window.event || event;
    }

    function stopBubble(event) {
      event = getEvent(event);
      event.stopPropagation ? event.stopPropagation() : event.cancelBubble = true;
    }

    var DEFAULT_FEATURE_NAME = 'tmp';
    /**
     * 开启双击删除操作
     * @return {[type]} [description]
     */

    BMap.Overlay.prototype.enableDoubleClickDel = function () {
      var option = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
        confirmdel: true
      };
      addEvent(this, _objectSpread({
        dbldel: true
      }, option));
    };
    /**
     * add overlay to a layer
     * @param {Layer | object} Layer or option that has name
     */


    BMap.Overlay.prototype.addToLayer = function () {
      var option = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
        name: DEFAULT_FEATURE_NAME,
        alias: ''
      };
      var layer;

      if (option instanceof BMap.Layer) {
        layer = option;
      } else {
        var name = option.name,
            alias = option.alias;
        layer = this.map.layers[name];

        if (!layer) {
          layer = new BMap.Layer(this.map, option);
        }
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
     */
    BMap.RenderMapV = function RenderMapV(map, data, option) {
      this.type = 'mapv';
      this.map = map;
      this.dataSet = new mapv.DataSet(data);
      var _option = option,
          name = _option.name,
          prop = _option.prop,
          renderOption = _option.renderOption,
          styleMap = _option.styleMap;
      option = Object.assign({}, BMap.RenderMapV.DEFAULT_OPTION, renderOption, styleMap);
      this.layer = new mapv.baiduMapLayer(map, this.dataSet, option);
      var overlay = this.layer.canvasLayer;
      overlay.map = map;
      overlay.addToLayer({
        name: name
      });
      overlay.layer.render = this;
      this.overlays = [overlay];

      if (name) {
        overlay.canvas.classList.add(name);
      }
    };

    BMap.RenderMapV.prototype.update = function update(data) {
      this.dataSet.set(data);
    };

    BMap.RenderMapV.DEFAULT_OPTION = {
      strokeStyle: 'green',
      fillStyle: 'rgba(255,255,255,0.5)',
      shadowBlur: 0,
      methods: {
        click: null
      },
      lineWidth: 3,
      draw: 'simple'
    };

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
      var optionStyle = option.styleMap;

      if (option.styleMap.polygon) {
        optionStyle = option.styleMap.polygon;
      }

      var style = _objectSpread({}, styleMap.polygon, optionStyle);

      var polygon = new BMap.Polygon(points, style);
      this.addOverlay(polygon);
      var name = option.name,
          prop = option.prop;
      polygon.prop = prop;
      polygon.addToLayer(option);
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
      var optionStyle = option.styleMap;

      if (option.styleMap.polyline) {
        optionStyle = option.styleMap.polyline;
      }

      var style = _objectSpread({}, styleMap.polyline, optionStyle);

      var polyline = new BMap.Polyline(points, style);
      this.addOverlay(polyline);
      var name = option.name,
          prop = option.prop;
      polyline.prop = prop;
      polyline.addToLayer(option);
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

      var optionStyle = option.styleMap;

      if (option.styleMap.point) {
        optionStyle = option.styleMap.point;
      }

      var style = _objectSpread({}, styleMap.point, optionStyle);

      var marker = new BMap.Marker(point, style);
      this.addOverlay(marker);
      var name = option.name,
          alias = option.alias,
          prop = option.prop;
      marker.prop = prop;
      marker.addToLayer(option);
      addEvent(marker, option);
      return marker;
    };
    /**
     * add circle feature
     * @param  {array} coordinates [lon,lat]
     * @param  {object} option
     * @return {BMap.Overlay}             
     */


    BMap.Map.prototype.circle = function (coordinates) {
      var option = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : featureOption;

      var point = _construct(BMap.Point, _toConsumableArray(coordinates));

      var optionStyle = option.styleMap;

      if (option.styleMap.circle) {
        optionStyle = option.styleMap.circle;
      }

      var style = _objectSpread({}, styleMap.polygon, optionStyle);

      var name = option.name,
          prop = option.prop,
          radius = option.radius;
      var overlay = new BMap.Circle(point, radius, style);
      this.addOverlay(overlay);
      overlay.prop = prop;
      overlay.addToLayer(option);
      addEvent(overlay, option);
      return overlay;
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
        var name = option.name,
            render = option.render;

        if (render === 'mapv') {
          var layer = this.layers[name];
          var renderer;

          if (layer) {
            renderer = layer.render;
            renderer.update(geojson);
          } else {
            renderer = new BMap.RenderMapV(this, geojson, option);
          }

          return renderer.overlays;
        } else {
          var features = _typeof(geojson) !== 'object' ? JSON.parse(geojson) : geojson;
          var overlay;

          if (features.type === 'FeatureCollection') {
            overlay = [];
            features.features.forEach(function (k) {
              overlay.push(_this.addFeature(k, option));
            });
          }

          if (Array.isArray(features)) {
            overlay = [];
            features.forEach(function (k) {
              overlay.push(_this.addFeature(k, option));
            });
          }

          if (features.type === 'Feature') {
            overlay = this.addFeature(features, option);
          }

          if (features.type === 'Polygon') {
            overlay = this.polygon(features.coordinates, option);
          }

          if (features.type === 'LineString') {
            overlay = this.polyline(features.coordinates, option);
          }

          if (features.type === 'Point') {
            overlay = this.point(features.coordinates, option);
          }

          return overlay;
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
