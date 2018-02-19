var Ball = (function () {
    function Ball(zjz) {
        this.zjz = zjz;

        this.R = this.zjz.width / 20;

        //this.x = this.zjz.width / 2 - this.R / 2;
        this.x = 150;
        //this.y = this.zjz.height - 50;
        this.y = 100;


        this.zl = 0.1;            // 重力
        this.laliX = 0;          // 拉力
        this.lali = 0;          // 拉力
        this.gx = 0;            // 惯性
        this.speedX = 0;         // 最终计算后的力
        this.speedY = 0;         // 最终计算后的力
        this.up = false;
        this.jiantou = false;   // 预判箭头

        this.isSheng = false;
        this.ctx = this.zjz.ctx;
        //this.renderBall();


        this.shengzi = new Shengzi(this);
    }

    // 画球
    Ball.prototype.renderBall = function () {

        if ( this.jiantou ) {
            this.shengzi.jiantou();
        }

        this.ctx.beginPath();
        this.ctx.arc(this.x,this.y,this.R,0,Math.PI * 2);
        this.ctx.closePath();
        this.ctx.fillStyle = '#f09';
        this.ctx.fill();

        this.ctx.beginPath();
        this.ctx.arc(this.x,this.y,this.R / 4 * 2.5,0,Math.PI * 2);
        this.ctx.closePath();
        this.ctx.fillStyle = '#cf9';
        this.ctx.fill();

        this.ctx.beginPath();
        this.ctx.arc(this.x,this.y,this.R / 4,0,Math.PI * 2);
        this.ctx.closePath();
        this.ctx.fillStyle = '#f09';
        this.ctx.fill();
    };

    // 更新
    Ball.prototype.update = function () {
        if ( this.isSheng ) {

            // 绳子受力 惯性减小
            this.gx -= 0.25;

            // 惯性验收 防止超过
            if (this.gx < 0 ) {
                this.gx = 0
            }

            // 球开始反弹
            if( this.speedY < 0 && this.shengzi.length > 30){
                this.shengzi.length -= 2;
                //this.gx = 0;
            } else if ( this.shengzi.length < 40) {
                this.isSheng = false;
            }

        } else {
            // 没丢绳子 的惯性递增值
            this.gx += 0.06;
        }

        // 计算下一次的离上一次的距离
        this.speedX =  this.laliX;
        this.speedY = this.zl + this.gx + this.lali;

        this.x += this.speedX;
        this.y += this.speedY;

        this.renderBall();
        this.zjz.isBarrier();
    };



    // 开始钩绳子
    Ball.prototype.start = function () {
        //this.shengzi.deg = 0;

        // 转为弧度,并且设置 正上方为0度
        var Hdeg = (this.shengzi.deg - 90) * Math.PI / 180;

        var x = Math.cos(Hdeg) * this.shengzi.length;
        var y = Math.sin(Hdeg) * this.shengzi.length;

        this.laliX = x / 30;
        this.lali = y / 12;

        this.shengzi.x = this.x + x;
        this.shengzi.y = this.y + y;

        //console.log(this.shengzi.x,this.shengzi.y);

        this.shengzi.render();

    };

// ======================================
// ============== 绳子类 =================
// ======================================

    function Shengzi(ball) {
        this.ball = ball;
        this.ctx = this.ball.ctx;
        this.length = 120;
        this.deg = 0;
        this.x = 0;
        this.y = 0;
    }



    // 画绳子
    Shengzi.prototype.render = function () {

        // 画绳子
        this.ctx.beginPath();
        this.ctx.moveTo(this.ball.x,this.ball.y);
        this.ctx.lineTo(this.x,this.y);
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = 'red';
        this.ctx.stroke();

    };

    // 画预判箭头
    Shengzi.prototype.jiantou = function () {

        var Hdeg = (this.deg - 90) * Math.PI / 180;

        var x = Math.cos(Hdeg) * this.length;
        var y = Math.sin(Hdeg) * this.length;

        this.x = this.ball.x + x;
        this.y = this.ball.y + y;


        this.ctx.beginPath();
        this.ctx.moveTo(this.ball.x,this.ball.y);
        this.ctx.lineTo(this.x,this.y);
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = 'blue';
        this.ctx.stroke();

    };



    return Ball;
})();