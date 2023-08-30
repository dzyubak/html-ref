var show_li = function(el, showOrSlide) {
    if (el.is('[data-code]')) {
        var page = $('body').data('page');
        var code = el.data('code');
        var url = '/api/' + page + '/' + code;

        $.get(url, function(data) {
            if (showOrSlide === 'slide') {
                $(data).hide().appendTo(el).slideDown('fast');
            } else {
                $(data).hide().appendTo(el).show();
            }
            $('pre code').each(function(i, block) {
                hljs.highlightBlock(block);
            });
        }, 'html');
    } else {
        if (showOrSlide === 'slide') {
            el.children().slideDown('fast');
            //el.parent().find( '.hidable' ).slideDown('fast');
        } else {
            el.children().show();
            //el.parent().find( '.hidable' ).show();
        }
    }
};

var hide_li = function(el, showOrSlide) {
    if (showOrSlide === 'slide') {
        el.children( 'ul, ol, .hidable' ).slideUp('fast');
        //el.children( '.hidable' ).slideUp('fast');
        //el.parent().find( '.hidable' ).slideUp('fast');
    } else {
        el.children( 'ul, ol, .hidable' ).hide();
        //el.children( '.hidable' ).hide();
        //el.parent().find( '.hidable' ).hide();
    }
};

var init_expandable = function(el) {
    if (el.is('[data-code]')) {
        el.text( el.data('code') );
    }
    
    if(el.is('.collapsed')) {
        hide_li(el);
    } else {
        el.addClass('expanded');
        show_li(el);
    }
};

var init_dblclick = function(el) {
//    el.dblclick(function(event) {
//        if (this === event.target) {
//            if(el.is('.collapsed')) {
//                show_li(el, 'slide');
//            } else {
//                hide_li(el, 'slide');
//            }
//            el.toggleClass('collapsed expanded');
//        }
//    });
    
    //el.add( el.find('*').not('li > ul > *, .hidable > *') ).on('dblclick', function(event) {
    //el.add( el.find('code, kbd, em').not('li > ul > li > code') ).on('dblclick', function(event) {
    //el.find(':not(li, ul, .hidable)').on('dblclick', function(event) {
    
    // working examples:
    //el.add( el.children().not('ul, .hidable') ).on('dblclick', function(event) {
    el.add( el.find( '> *, > * > *' ).not('ul, ol, li, .hidable, .expandable') ).on('dblclick', function(event) {
        //event.stopPropagation();
        //$( event.target ).closest( '.expandable' ).toggleClass( "hilight" );
        if (this === event.target) {
            if(el.is('.collapsed')) {
                show_li(el, 'slide');
            } else {
                hide_li(el, 'slide');
            }
            el.toggleClass('collapsed expanded');
        }
    });
    
//    el.on('dblclick', '*', function(event) {
//        console.log('a');
//        if (this === event.target) {
//            if(el.is('.collapsed')) {
//                show_li(el, 'slide');
//            } else {
//                hide_li(el, 'slide');
//            }
//            el.toggleClass('collapsed expanded');
//        }
//    });
};

var expand_all_button = function(btn) {
    if(btn.is('.all-expanded')) {
        $('li.expandable').each(function() {
            var li = $(this);
            li.removeClass('expanded');
            hide_li(li, 'slide');
            li.addClass('collapsed');
        });
        btn.val('expand all');
    } else {
        $('li.expandable').each(function() {
            var li = $(this);
            if ( ! li.is('.expanded') ) { // if NOT already expanded
                li.removeClass('collapsed');
                show_li(li, 'slide');
                li.addClass('expanded');
            }
        });
        btn.val('collapse all');
    }
    
    btn.toggleClass('all-expanded');
};

function linkify(inputText) {
    var replacePattern;
    //URLs starting with http://, https://
    // default:
    //replacePattern = /(\b(https?):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
    // my customized one:
    replacePattern = /(\b(?<!")(https?|file?):\/\/[-A-ZäА-Яа-яІіЇї0-9+&@#\/%?=~_|!:,.;()]*[-A-ZäА-Яа-яІіЇї0-9+&@#\/%=~_|()])/gim;
    // info: (?<!") = negative lookbehind, string does not contain " before
    return inputText.replace(replacePattern, '<a href="$1" target="_blank">$1</a>');
    //return inputText.replace(replacePattern, '<a href="https://piv.pivpiv.dk/" target="_blank">$1</a>'); // ;-)
}

$(document).ready(function() {
    $( "div.container" ).html( linkify( $( "div.container" ).html() ) );
    
    //$('li').has('ul').addClass('expandable').children('ul').addClass('hidable');
    //$('li').has('ul').add('li > code').addClass('expandable');
    $('li').has('ul, ol').addClass('expandable');
    $('li[data-code]').addClass('expandable');
    
    //$('li > code').addClass('expandable');
    
    //$('.expandable').each(function() {
    $('.expandable').each(function() {
        var el = $(this);
        //el.add( el.children('code') );
        //el.next('code');
        
        init_expandable(el);
        init_dblclick(el);
    });
    
    $('#expand-all').click(function(event) {
        expand_all_button( $(this) );
    });

    inputSelect();

    //hljs.initHighlightingOnLoad(); // causes errors in other scripts
});

function inputSelect() {
    $("input:text")
        .focus(function () {
            $(this).select();
            document.execCommand("copy");
        } )
        .mouseup(function (e) {e.preventDefault(); });
}
