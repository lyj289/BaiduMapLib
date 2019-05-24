Changelog
=================
## TODO
- Render扩展，如zrender, webgl
- MapvRender，click获取geo属性
- demo示例，引入[licia](https://licia.liriliri.io/)，一个很棒的常见集合方法
- add test

## 1.1.3 (2019-05-13)

### bug fix
- add util event
- fix overlya.enableDoubleClickDel bug
- fix MapvRender addlayer bug
- update overlay.addToLayer, can receive layer param

## 1.1.0 (2019-04-29)

### API Add

- Map.js 扩展map实例方法
    + map.circle 绘圆

- BMap.Layer 
    + show
    + hide

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
