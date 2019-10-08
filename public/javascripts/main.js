(function () {
    window.requestAnimFrame = (function () {
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            function (callback) {
                window.setTimeout(callback, 1000 / 60);
            };
    })();

    var socket = new WebSocket("ws://"+location.host+"/stream");
    var connected = false;
    socket.onopen = function (ev) { connected = true;  };
    socket.onclose = function (ev) { connected = false;  };
    socket.onmessage = function (e) {
        //socket.send


    };

    var canvas = document.getElementById("draws");
    var ctx = canvas.getContext("2d");

    var pressed = false;
    var position;

    var COLORS = ["red", "blue", "yellow", "green", "white"];
    var SIZES = [2, 5, 8, 10, 14];

    var color = COLORS[0];
    var size = 5;

    function onMouseDown(e) {
        var p = positionWithE(e);
        pressed = true;
        position = p;

    }

    ctx.lineJoin ='round';
    ctx.lineCap = 'round';

    function onMouseUp(e) {
        var p = positionWithE(e);
        pressed = false;

    }

    function onMouseMove(e) {
        var p = positionWithE(e);
        if (pressed) {
            ctx.beginPath();
            ctx.strokeStyle = color;
            ctx.lineWidth = size;
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

    (function () {
        var canvas = document.getElementById("controls");
        var ctx = canvas.getContext("2d");

        var dirty = true;

        var BUTTON = 40;
        var RADIUS = 10;
        var SELECT = 4;

        canvas.addEventListener("click", function (e) {
            var p = positionWithE(e);
            var i = Math.floor(p.x / BUTTON);
            if (i < COLORS.length) {
                color = COLORS[i];
            } else {
                i -= COLORS.length;
                if (i < SIZES.length) {
                    size = SIZES[i];
                }
            }
            dirty = true;
        });


        function render() {
            if (!dirty) return;
            dirty = false;
            var w = canvas.width, h = canvas.height;
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, w, h);

            var x = BUTTON / 2, y = h / 2, radius = RADIUS;
            COLORS.forEach(function (c) {

                ctx.fillStyle = c;
                ctx.beginPath();
                ctx.arc(x, y, radius, 0, 2 * Math.PI);
                ctx.fill();
                ctx.lineWidth = 1;
                ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
                ctx.stroke();
                if (c == color) {
                    ctx.lineWidth = 2;
                    ctx.strokeStyle = 'black';
                    ctx.beginPath();
                    ctx.arc(x, y, radius + SELECT, 0, 2 * Math.PI);
                    ctx.stroke();
                }
                x += BUTTON;
            });


            ctx.fillStyle = 'black';
            SIZES.forEach(function (s) {
                ctx.beginPath();
                ctx.arc(x, y, s, 0, 2 * Math.PI);
                ctx.fill();
                ctx.lineWidth = 1;
                if (s == size) {
                    ctx.lineWidth = 2;
                    ctx.strokeStyle = 'black';
                    ctx.beginPath();
                    ctx.arc(x, y, s + SELECT, 0, 2 * Math.PI);
                    ctx.stroke();
                }
                x += BUTTON;


            });
        }

        requestAnimFrame(function loop() {
            requestAnimFrame(loop);
            render();

        }, canvas);
    }());

}());