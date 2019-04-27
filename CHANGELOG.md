Changelog
=================

## 0.1.0 (2019-04-27)

### API Add

First version Done!

- Map.js 扩展map实例方法
    + map.polyline 绘线
    + map.polygon 绘面
    + map.point 绘线
    + map.geoJson 根据geojson绘要素

- BMap.Overlay 扩展
    + enableDoubleClickDel 启用双击删除
    + addToLayer 
    + toGeoJSON output GeoJSON

- BMap.Layer 增加Layer,可以将多Overlay按组管理
    + add
    + remove
    + clear

- BMap.Render 增加Render，可以指定svg, canvas

by liyujian
