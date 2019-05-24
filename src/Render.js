/**
 * BMap.Render
 */

BMap.RenderMapV = function RenderMapV(map, data, option) {
    this.type = 'mapv';
    this.map = map;
    this.dataSet = new mapv.DataSet(data);

    let {name, prop, renderOption, styleMap} = option;
    option = Object.assign({}, BMap.RenderMapV.DEFAULT_OPTION, 
            renderOption, styleMap);

    this.layer = new mapv.baiduMapLayer(map, this.dataSet, option);
    
    let overlay = this.layer.canvasLayer;
    overlay.map = map;
    overlay.addToLayer({name});
    overlay.layer.render = this;
    this.overlays = [overlay];

    if (name) {
        overlay.canvas.classList.add(name);
    }
}

BMap.RenderMapV.prototype.update = function update(data){
    this.dataSet.set(data);
}

BMap.RenderMapV.DEFAULT_OPTION = {
    strokeStyle: 'green',
    fillStyle: 'rgba(255,255,255,0.5)',
    shadowBlur: 0,
    methods: {
        click: null
    },
    lineWidth:3,
    draw: 'simple'
}
