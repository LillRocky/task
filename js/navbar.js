/**
 * Created by GF on 2017/9/26.
 */
$(function(){
    var Adapter = {
        init: function(){
            Adapter.waterfall("adapter-container", "adapter-col", 2, 5);
            Adapter.waterfall("leke-class-box", "leke-filter-button", 4, 7, $('#leke-class-box').width(), function(h){
                $('#leke-class-box').height(h+40);
            });
            Adapter.waterfall("leke-status-box", "leke-filter-button", 4, 7, $('#leke-status-box').width(), function(h){
                $('#leke-status-box').height(h+40);
            });
            $(window).on("resize", Adapter.debounce(100, function(){
                Adapter.waterfall("adapter-container", "adapter-col", 2, 5);
                Adapter.waterfall("leke-class-box", "leke-filter-button", 4, 7, $('#leke-class-box').width(), function(h){
                    $('#leke-class-box').height(h+40);
                });
                Adapter.waterfall("leke-status-box", "leke-filter-button", 4, 7, $('#leke-status-box').width(), function(h){
                    $('#leke-status-box').height(h+40);
                });
            }));
            $('#set-height').click(function(){
                $('#leke-navbar').toggleClass('height-60-navbar');
            });
        },
        /*
         parend 父级id
         clsName 元素class
         */

        waterfall: function(parent,clsName, minCols, maxCols, defaultWidth, callback){
            var $parent = $('#'+parent),//父元素
                $boxs = $parent.find('.'+clsName),//所有box元素
                iPinW = $boxs.eq(0).outerWidth(), // 一个块框box的宽
                wWidth = defaultWidth || $(window).width(), // 窗口宽度
                cols = Math.floor((wWidth-80)/iPinW ),//列数 -80保证外边距
                pWidth;
            if(wWidth <= 1024){
                pWidth = 1024;
            }else if(wWidth >= 1920){
                pWidth = 1920;
            }else{
                pWidth = defaultWidth || (iPinW * cols + 40+(wWidth-iPinW * cols-40)/2);
            }
            // 限制最大最小值 防止以后需求变更所以不和宽度条件写在一起
            if(cols <= minCols){
                cols = minCols
            }else if(cols >= maxCols){
                cols = maxCols;
            }
            $('.leke-adapt-line').width(pWidth); // header
            $parent.width(pWidth).css({
                'margin': '0 auto',
                'position': 'relative'
            });
            var pinHArr=[];//用于存储每列中的所有块框相加的高度。
            var extraMargin = (pWidth-cols*iPinW-40)/(cols-1);
            $boxs.each(function(index, dom){
                if(index < cols){
                    pinHArr[index] = $(dom).outerHeight(); //所有列的高度
                    $(dom).css({
                        'position': 'absolute',
                        'top': 20,
                        'left': index*iPinW + 20 + index*extraMargin + 'px'
                    });

                }else{
                    var minH = Math.min.apply(null, pinHArr);//数组pinHArr中的最小值minH
                    var minHIndex = $.inArray(minH, pinHArr);
                    $(dom).css({
                        'position': 'absolute',
                        'top': minH + 40,
                        'left': minHIndex*iPinW + 20 + minHIndex*extraMargin + 'px'
                    });
                    //
                    //添加元素后修改pinHArr
                    pinHArr[minHIndex] += $(dom).outerHeight() + 20;//更新添加了块框后的列高
                }
            });
            if(typeof callback === 'function'){
                callback(Math.max.apply(null, pinHArr));
            }
        },
        //检验是否满足加载数据条件，即触发添加块框函数waterfall()的高度：最后一个块框的距离网页顶部+自身高的一半(实现未滚到底就开始加载)
        checkscrollside: function(parent,clsName){
            //最后一个块框
            var $lastBox = $('#'+parent).find('.'+clsName).last(),
                lastBoxH = $lastBox.offset().top + $lastBox.height()/ 2,
                scrollTop = $(window).scrollTop(),
                documentH = $(document).height();
            
            return lastBoxH < scrollTop + documentH;
        },
        // 防抖
        debounce: function(idle, action){
            var last,
                args = Array.prototype.slice.call(arguments, 2);
            return function(){
               clearTimeout(last);
               last = setTimeout(function(){
                   action.apply(this, args);
               }, idle)
            }
        }
    };
    var Tool = {
        init: function(){
            $('.adapter-col').click(function(){
                $(this).toggleClass('checked-col');
            });
            $('.btn-up-down').click(function(){
                var $this = $(this);
                if(!$this.hasClass('active')){
                    $('.btn-up-down.active').trigger('click');
                }
                $this.toggleClass('active').find('.arrow-icon').toggleClass('glyphicon-menu-up glyphicon-menu-down');
                $('#'+$this.attr('data-target')).slideToggle();
            });
            $('.leke-filter-button').click(function(){
                $(this).toggleClass('active');
            });
        }
    };
    Adapter.init();
    Tool.init();
});
// $(window).on("load", function(){
    // waterfall('adapter-container','adapter-col');
    // var dataJson = {'data': [{'src':'30.jpg'},{'src':'31.jpg'},{'src':'32.jpg'},{'src':'33.jpg'},{'src':'34.jpg'},{'src':'35.jpg'},{'src':'36.jpg'},{'src':'37.jpg'},{'src':'38.jpg'},{'src':'39.jpg'},{'src':'40.jpg'},{'src':'41.jpg'},{'src':'42.jpg'},{'src':'43.jpg'},{'src':'44.jpg'},{'src':'45.jpg'}]};
    // window.onscroll=function(){
    //     var isPosting = false;
    //     if(checkscrollside('main','box') && !isPosting){
    //         isPosting = true;
    //         $.each(dataJson.data,function(index,dom){
    //             var $box = $('<div class="box"></div>');
    //             $box.html('<div class="pic"><img src="./images/'+$(dom).attr('src')+'"></div>');
    //             $('#main').append($box);
    //             waterfall('main','box');
    //             isPosting = false;
    //         });
    //     }
    // }
// });

