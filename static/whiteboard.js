// TODO: Make it work on the ipad/iphone

function drawSegment(canvas, x1, y1, x2, y2) {
    if(x1 && y1) {
        canvas.drawLine({
            strokeWidth: 2,
            strokeStyle: "#000",
            x1: x1, y1: y1,
            x2: x2, y2: y2
        });
    }
}

var last_point = null;
var has_touch = false;

function drag(ev) {
    if(last_point) {
        drawSegment(ev.data.canvas, last_point.x, last_point.y, ev.offsetX, ev.offsetY);
        ev.data.socket.emit('draw', {x1:last_point.x, y1:last_point.y, x2:ev.offsetX, y2:ev.offsetY});
    }
    last_point = {x: ev.offsetX, y:ev.offsetY};
}

function touchdrag(ev) {
    ev.preventDefault();
    var touchX = ev.changedTouches[0].clientX - ev.data.canvas.get(0).offsetLeft;
    var touchY = ev.changedTouches[0].clientY - ev.data.canvas.get(0).offsetTop;
    if(last_point) {
        drawSegment(ev.data.canvas, last_point.x, last_point.y, touchX, touchY);
        ev.data.socket.emit('draw', {x1:last_point.x, y1:last_point.y, x2:touchX, y2:touchY});
    }
    last_point = {x: touchX, y:touchY};
}

function initalize_whiteboard(elements, options) {
    if(!options) options = {};
    if(!options.url) options.url = 'http://192.168.0.109:8080?board_id=global';
    var socket = io.connect(options.url);
    elements.each(function(idx, el) {
        el = $(el);        
        socket.on('draw', function(data) {
            drawSegment(el, data.x1, data.y1, data.x2, data.y2);
        });
        
        el.on("touchstart", function(ev) {
            has_touch = true;
            ev.preventDefault();
            el.get(0).ontouchmove = function(ev) {
                ev.data = {canvas:el, socket:socket};
                touchdrag(ev);
            };
        });
        el.on("touchend", function(ev) {
            el.get(0).ontouchmove = null;
            last_point = null;
        });
        
        el.on("mousedown", function(ev) {
            if(has_touch)
            {
                return;
            }
            el.on("mousemove", {canvas:el, socket:socket}, drag);
        });
        el.on("mouseup", function(ev) {
            el.off("mousemove", drag);
            last_point = null;
        });
    });
}

(function ($) {
    $.fn.whiteboard = function(options) {
        initalize_whiteboard($(this), options);
    }
})(jQuery);