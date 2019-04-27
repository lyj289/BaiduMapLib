# MapGeo
Baidu Map Lib 扩展, 主要用来快速加载点线面各种要素

内容说明
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
