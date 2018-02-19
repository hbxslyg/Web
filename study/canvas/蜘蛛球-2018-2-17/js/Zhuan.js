var Zhuan = (function () {

    function Zhuan(zjz) {
        this.zjz = zjz;
        this.ctx = this.zjz.ctx;



    }


    var json = {
        '1':[
            {'x':20,'y':400},
            {'x':170,'y':400},
            {'x':300,'y':400}
        ],

        '2':[
            {'x':100,'y':600},
            {'x':100,'y':600},
            {'x':100,'y':600}
        ],

        '3':[
            {'x':100,'y':100},
            {'x':100,'y':200},
            {'x':100,'y':300}
        ]
    };

    Zhuan.prototype.createZhuan = function (gk) {
        this.gk = gk; // 关卡
        this.data = json[this.gk];

        for ( var i = 0 ; i < this.data.length ; i++ ){
            this.ctx.beginPath();
            this.ctx.fillStyle = '#CCF';
            this.ctx.fillRect(this.data[i].x,this.data[i].y,50,50)
        }




    };




    return  Zhuan;
})();