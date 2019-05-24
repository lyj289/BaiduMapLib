/**
 * Util
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
    if (dbldel && !ondblclick) {
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
function preventDefault(event) {
    event = getEvent(event);
    if (event.preventDefault) {
        event.preventDefault();
    } else {
        event.returnValue = false;
    }
}

export {
    addEvent
}