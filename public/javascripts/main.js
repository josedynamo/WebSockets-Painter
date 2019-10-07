(function () {
    window.requestAnimFrame = (function () {
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            function (callback) {
                window.setTimeout(callback, 1000 / 60);
            };
    })();

    var canvas = document.getElementById("draws");
    var ctx = canvas.getContext("2d");

    var pressed = false;
    var position;

    function onMouseDown(e) {
        var p = positionWithE(e);
        pressed = true;
        position = p;

    }

    function onMouseUp(e) {
        var p = positionWithE(e);
        pressed = false;

    }

    function onMouseMove(e) {
        var p = positionWithE(e);
        if (pressed) {
            ctx.moveTo(position.x, position.y);
            ctx.lineTo(p.x, p.y);
            ctx.stroke();
            position = p;
        }

    }

    function positionWithE(e) {
        var left = document.querySelector("#draws").offsetLeft;
        var top = document.querySelector("#draws").offsetTop;
        var newX = e.clientX - left;
        var newY = e.clientY - top;

        return {x: newX, y: newY};
    }

    canvas.addEventListener("mouseup", onMouseUp);

    canvas.addEventListener("mousedown", onMouseDown);

    canvas.addEventListener("mousemove", onMouseMove);

    function render() {

    }

    requestAnimFrame(function loop() {
        requestAnimFrame(loop);
        render();

    }, canvas);

}());