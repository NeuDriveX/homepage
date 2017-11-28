;(function($){
    //可传参数 autoplay, speed, loop
    function Turn(target, obj) {
        var self = this;
        var tar = $(target);

        //默认配置参数
        this.setting = {
            speed: 300,     //切换速度
            loop: false     //是否无缝滚动
        }

        $.extend(this.setting, obj)

        //获取元素
        this.main = tar.find('.main_list');
        this.ul = tar.find('ul');
        this.li = tar.find('li');
        this.prev = tar.find('.prev');
        this.next = tar.find('.next');
        this.pag = tar.find('.span');
        this.span = this.pag.find('span');

        //其他变量
        this.liW = this.main.innerWidth();
        this.num = 0;
        this.all = this.li.length;

        //无缝滚动
        if(this.setting.loop) {
            var qian = this.li.eq(0).clone();
            var hou = this.li.eq(-1).clone();
            this.ul.append(qian).prepend(hou);
            this.ul.css('left', - this.liW);
            this.li = tar.find('li');
            this.num = 1;
            this.all = this.li.length;
        }

        this.li.each(function() {
            $(this).css('width', self.liW)  //li的宽度等于main_list的宽度
        })

        this.prev.click(function(){
            if(self.setting.loop) self.prev2() //无缝滚动
            else self.prev1()   //正常滚动
        })
        this.next.click(function(){
            if(self.setting.loop) self.next2() //无缝滚动
            else self.next1()   //正常滚动
        })
        this.span.click(function() {
            if(self.setting.loop) {
                self.num = $(this).index() + 1
                self.tabw();
            } 
            else {
                self.num = $(this).index()
                self.tab();
            }
        })

        //设置定时器
        if(this.setting.autoplay) {
            var timer = null;

            timer = setInterval(function(){
                if(self.setting.loop) self.next2() //无缝滚动
                else self.next1()   //正常滚动
            },this.setting.autoplay)

            this.main.hover(function(){
                clearInterval(timer)
            },function(){
                timer = setInterval(function(){
                    if(self.setting.loop) self.next2() //无缝滚动
                    else self.next1()   //正常滚动
                },self.setting.autoplay)
            })
        }

        //手机端滑屏
        if(!this.IsPC()) {
            this.initX = 0;
            this.main.on('touchstart', this.fnStart)
            this.main.on('touchend', function(ev) {
                var endX = ev.originalEvent.changedTouches[0].pageX;
                if(ev.originalEvent.changedTouches[0].pageX - this.initX > 30) {
                    if(self.setting.loop) self.next2() //无缝滚动
                    else self.next1()   //正常滚动
                } else if(ev.originalEvent.changedTouches[0].pageX - this.initX < -30) {
                    if(self.setting.loop) self.prev2() //无缝滚动
                    else self.prev1()   //正常滚动
                }
            })

            this.prev.off('click');
            this.next.off('click');

            this.prev.on('touchend', function(ev){
                if(self.setting.loop) self.prev2() //无缝滚动
                else self.prev1()   //正常滚动
                return false;
            })
            this.next.on('touchend', function(ev){
                if(self.setting.loop) self.next2() //无缝滚动
                else self.next1()   //正常滚动
                return false;
            })

        }

    }

    Turn.prototype = {
        next1: function() {
            this.num++;
            if(this.num === this.all) {
                this.num = this.all - 1
            }
            this.tab()
        },
        prev1: function() {
            this.num--;
            if(this.num === -1) {
                this.num = 0;
            }
            this.tab()
        },
        //无缝滚动
        prev2: function() {
            var _this = this;
            this.num--;
            if(this.num === 0) {
                this.num = this.all - 2
                this.span.eq(this.num - 1).addClass('active').siblings().removeClass('active')
                this.ul.animate({'left': 0}, this.setting.speed, function() {
                    _this.ul.css('left', - _this.liW * (_this.all - 2))
                })
            } else this.tabw()
        },
        next2: function() {
            var _this = this;
            this.num++;
            if(this.num === this.all - 1) {
                this.num = 1
                this.span.eq(this.num - 1).addClass('active').siblings().removeClass('active')
                this.ul.animate({'left': - this.liW * (this.all - 1)}, this.setting.speed, function() {
                    _this.ul.css('left', - _this.liW)
                })
            } else this.tabw()
        },
        tab: function() {
            this.ul.animate({'left': - this.liW * this.num}, this.setting.speed)
            this.span.eq(this.num).addClass('active').siblings().removeClass('active')
        },
        tabw: function() {
            this.ul.animate({'left': - this.liW * this.num}, this.setting.speed)
            this.span.eq(this.num - 1).addClass('active').siblings().removeClass('active')
        },
        IsPC: function() {   //判断手持设备还是电脑
            var userAgentInfo = navigator.userAgent;
            var Agents = ["Android", "iPhone",
                        "SymbianOS", "Windows Phone",
                        "iPad", "iPod"];
            var flag = true;
            for (var v = 0; v < Agents.length; v++) {
                if (userAgentInfo.indexOf(Agents[v]) > 0) {
                    flag = false;
                    break;
                }
            }
            return flag;
        },
        fnStart: function(ev) {  //手机屏幕按下
            this.initX = ev.originalEvent.changedTouches[0].pageX
        }

    }

    window.Turn = Turn;
})(jQuery);