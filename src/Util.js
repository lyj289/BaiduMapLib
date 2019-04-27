/**
 * Util
 * @author liyujian <liyujian@baidu.com>
 */

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

export {
    addEvent
}