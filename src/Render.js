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
    let options = {
        strokeStyle: 'green',
        fillStyle: 'rgba(0,0,0,.3)',
        shadowBlur: 0,
        methods: {
            click: null
        },
        lineWidth:3,
        draw: 'webgl'
    };
    this.mapvLayer = new mapv.baiduMapLayer(map, this.dataSet, options);
    this.mapvLayer.canvasLayer.map = map;
    this.mapvLayer.canvasLayer.canvas.classList.add('constructMap');
}
