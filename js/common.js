/**
 * Created by majing on 2016/6/16.
 */

const win_W = $(window).width();
const win_H = $(window).height();

/**
 * 自适应
 */
function win_resize() {
    $('.left-container,.right-container').height(win_H);
};

/**
 * 加载模板
 * @param name
 */
function load_templates(name) {
    $.ajax({
        type: 'GET',
        url: './templates/'+ name +'.html',
        success: function(resp){
            $('.right-container .main-content').html(resp);
        },
        error: function(xhr, type){
            console.log('error!');
        }
    });
};


/**
 * 加载左侧栏
 */
function load_nav() {
    $.ajax({
        type: 'GET',
        url: './data/nav.json',
        dataType: 'json',
        success: function(resp){
            console.log(resp);
            if(resp.status == "200"){
                var data_one = resp.res;
                var html = '';
                // 一级
                if(data_one.length > 0){
                    html = '<ul class="collapsible" data-collapsible="accordion">';
                    $.each(data_one, function (index, item) {
                        var data_nameen = item.name_en;
                        html += '<li level="'+ item.level +'">\
                       <div  class="collapsible-header teal one waves-effect waves-light"><a targetjump level="'+ item.level +'" href="#/'+ data_nameen +'">'+ item.name +'<i class="fa fa-file-text-o"></i></a></div>\
                       <div class="collapsible-body">';
                        // 二级
                        var data_two = item.data;
                        if(data_two.length > 0){
                            html += '<ul class="collapsible" data-collapsible="accordion">';
                            $.each(data_two, function (index, item) {
                                var dataone_nameen = item.name_en;
                                html += '<li level="'+ item.level +'">\
                               <div class="collapsible-header waves-effect waves-teal two"><a targetjump level="'+ item.level +'" href="#/'+ data_nameen + '/'+dataone_nameen +'">'+ item.name +'<i class="fa fa-caret-square-o-down"></i></a></div>\
                               <div class="collapsible-body">';
                                // 三级
                                var data_three = item.data;
                                var datatwo_nameen = item.name_en;
                                if(data_three.length > 0){
                                    html += '<div class="collection">'
                                    $.each(data_three, function (index, item) {
                                        html += '<a targetjump level="'+ item.level +'" href="#/'+ data_nameen + '/'+dataone_nameen+ '/' +datatwo_nameen + index + '" class="collection-item">'+ item.name +'</a>';
                                    });
                                    html += '</div>';
                                }else{
                                    html += '<p>NO DATA</p>';
                                }
                                html += '</div></li>';
                            });
                        }else{
                            html += '<p>NO DATA</p>';
                        }
                        html += '</div></li>';

                    });
                    html += '</ul>';
                }else{
                    html = '<p>NO DATA</p>';
                }

                $('.slide-nav').html(html);
                $('.collapsible').collapsible({
                    accordion : false
                });
                leftnav_event.load();
            }else{
                alert(resp.msg);
            }
        },
        error: function(xhr, type){
            alert('Ajax error!')
        }
    });
};

/**
 * 左侧栏事件
 */
var leftnav_event = {
    atr: '[targetjump]',
    load: function () {
        var _this = this;
        var getEls = $(_this.atr);
        $.each(getEls, function (index, item) {
            var gethref = $(item).attr('href');
            $(item).removeAttr('href').attr('jump',gethref);
        });
        var gethash = window.location.hash;
        _this.load_nav(gethash);
        _this.event_click();
        _this.hash_event();
    },
    // 绑定点击事件
    event_click: function () {
        var _this = this;
        var getEls = $(_this.atr);
        getEls.on('click', function (e) {
            console.log('click');
            if(!$(e.target).hasClass('active')){
                getEls.removeClass('active');
                $(e.target).addClass('active');
            }
            var href = $(e.target).attr('jump');

            if( typeof href.split('#')[1] != 'undefined' ){
                var leng = href.split('/').length;
                _this.load_article(href.split('/')[leng-1],href);
            }
        });
    },
    hash_event: function () {
        var _this = this;
        $(window).on('hashchange', function (e){
            console.log('hash change');
            var gethash = window.location.hash;
            _this.load_nav(gethash);
            var leng = gethash.split('/').length;
            _this.load_article(gethash.split('/')[leng-1],gethash);
        });
    },
    load_nav: function (gethash) {
        if(gethash.indexOf('#') < 0 || typeof gethash.split('#')[1] == 'undefined'){
            load_templates('index');
        }else{
            $('[level=3]').removeClass('active');
            $('.collapsible-header').removeClass('active');
            $('.collapsible-body').hide();
            var leng = gethash.split('/').length;
            leftnav_event.load_article(gethash.split('/')[leng-1],gethash);
            var thisel = $("[jump='"+gethash+"']");
            var level = thisel.attr('level');
            for(var le = 1; le <= level; le++){
                if(le == 3){
                    thisel.addClass('active');
                }
                thisel.closest('li[level='+le+']').children('.collapsible-header').addClass('active');
                thisel.closest('li[level='+le+']').children('.collapsible-body').show();
            }
        }
    },
    load_article: function (parm,href) {
        $.ajax({
            type: 'POST',
            url: './data/article/'+ parm +'.json',
            data: {parm: parm},
            dataType: 'json',
            success: function(resp){
                if(resp.status == "200"){
                    var html = resp.res.content;
                    $('.right-container .main-content').html(html);
                    window.location.hash = href;
                    Crumbs.change_crumbs(resp.res.crumbs);
                }else{
                    window.location.hash = '#';
                    console.log(resp.msg);
                }
            },
            error: function(xhr, type){
                console.log('Ajax error!');
                load_templates('index');
                Crumbs.return_index();
            }
        });
    }
};

/**
 * 面包屑
 * @type {{els: string, load: Crumbs.load, change_crumbs: Crumbs.change_crumbs}}
 */
var Crumbs = {
    els: '.crumbs',
    load: function () {
        console.log('crumb load');
    },
    change_crumbs: function (html) {
        var _this = this;
        var crumbs = $(_this.els);
        crumbs.html(html);
    },
    return_index: function () {
        var _this = this;
        var crumbs = $(_this.els);
        crumbs.html('<a href="#" class="breadcrumb">文档中心</a>');
        window.location.hash = "#";
    }
}