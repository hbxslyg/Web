var Game = (function () {

    function Game(id) {
        this.box = document.getElementById(id);
        this.canvas = document.createElement('canvas');
        this.canvas.innerText = '您的浏览器不支持canvas,请升级Chrome浏览器';
        this.box.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');

        this.init();
        this.zhuan = new Zhuan(this);
        this.ball = new Ball(this);
        this.zhuan.createZhuan(1);
    }


    Game.prototype.init = function () {
        this.setStyle();
        this.bindEvent();
        this.start();


    };

    // 设置样式
    Game.prototype.setStyle = function () {
        this.width = document.body.clientWidth;
        this.height = document.body.clientHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        // this.canvas.style.backgroundColor = '#cfc';
        this.canvas.style.position = 'absolute';
    };


    // 游戏主循环
    Game.prototype.start = function () {
        var that = this;
        var f = 0;
        this.timer = setInterval(function () {
            f++;
            that.ctx.clearRect(0,0,that.canvas.width,that.canvas.height);

            that.zhuan.createZhuan(1);
            if (that.ball.isSheng){

                that.ball.shengzi.render();
            }
            that.ball.update();
        },16)
    };

    // 事件监听
    Game.prototype.bindEvent = function () {
        var that = this;

// 移动版事件----开始

        // 触摸事件
        this.canvas.addEventListener('touchstart',function (event) {
            that.ball.shengzi.deg = 0;
            that.ball.jiantou = true;
            var x = event.targetTouches[0].clientX;
            that.ball.shengzi.length = 25;

            // 滑动事件
            that.canvas.addEventListener('touchmove',function (event) {
                that.ball.shengzi.deg = (event.targetTouches[0].clientX - x) / that.canvas.width * 90;
                console.log(x,that.ball.shengzi.deg)

            });

            // 离开事件
            that.canvas.addEventListener('touchend',function () {
                that.ball.jiantou = false;
                that.canvas.onmousemove = null;

                that.ball.lali = -5;
                that.ball.shengzi.length = 60;
                that.ball.isSheng = true;
                //console.log(that.ball.shengzi.length,that.ball.gx,that.ball.lali);

                that.ball.start();
            });

            event.preventDefault();
        })

// 移动版事件----结束


/*
// PC 版事件-----开始

        this.canvas.onmousedown = function (event) {
            that.ball.jiantou = true;
            var x = event.clientX;
            that.ball.shengzi.length = 40;
            that.canvas.onmousemove = function (event) {
                that.ball.shengzi.deg = (event.clientX - x) / that.canvas.width * 90;
            };

            that.canvas.onmouseup = function () {
                that.ball.jiantou = false;
                that.canvas.onmousemove = null;

                that.ball.lali = -5;
                that.ball.shengzi.length = 60;
                that.ball.isSheng = true;
                //console.log(that.ball.shengzi.length,that.ball.gx,that.ball.lali);

                that.ball.start();
            }
        }

// PC 版事件-----结束
*/

    };





    // 碰撞检测
    Game.prototype.isBarrier = function () {
        var r = this.ball.R;
        for ( var i = 0 ; i < this.zhuan.data.length ; i++ ) {
            var x1 = this.zhuan.data[i].x,
            y1 = this.zhuan.data[i].y,
            x2 = x1 + 100,
            y2 = y1 + 100;

            if ( this.ball.y > y1 - r && this.ball.y < y2 + r && this.ball.x > x1 - r && this.ball.x < x2 + r) {
                clearInterval(this.timer);
            }



        }

    };





    return Game;
})();

