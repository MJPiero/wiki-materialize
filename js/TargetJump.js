/**
 * Created by majing on 2016/6/16.
 */

;(function ($) {
    'use strict';
    var getEls = $('[targetjump]');
    $(document).on('click', getEls, function(e) {
        if(!$(e.target).hasClass('active')){
            getEls.removeClass('active');
            $(e.target).addClass('active');
        }
        // 面包屑
        var crumbs = $('.crumbs');
        var level = $(e.target).attr('level');
        var text = $(e.target).text();
        var href = $(e.target).attr('href');

        var l = parseInt(level);
        for(var i = l; i<=3; i++){
            if(crumbs.find('a').eq(i)){
                crumbs.find('a').eq(i).remove();
            }
        };
        crumbs.append('<a href="'+ href +'" class="breadcrumb">'+ text +'</a>');

    });

    $('.crumbs').on('click','a',function () {
        var index = $(this).index();
        for(var ic = index; ic<=3; ic++){
            $('.crumbs').find('a').eq(ic).remove();
        }
    });

    $(window).on('hashchange', function (e){
    });

})(jQuery);