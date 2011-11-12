$(function(){
    $('.js-sample__tape').tape({preload: false});

    $('.js-sample_1 .js-sample__button, .js-sample_2 .js-sample__button').click(function(){
        $(this)
            .closest('.js-sample')
            .find('.js-sample__tape')
            .tape('setPosition', 0) // For loop play
            .tape('stepInTo', 4);
    });
    $('.js-sample_3 .js-sample__tape').bind('mouseenter mouseleave', function(){
        $(this)
            .tape('windToNext');
    });
    $('.js-sample_4 .js-sample__tape').bind('mouseenter mouseleave', function(){
        $(this)
            .tape('windToPrev');
    });
    $('.js-sample_5 .js-sample__button').click(function(){
        $(this)
            .closest('.js-sample')
            .find('.js-sample__tape')
            .tape('windTo', 20);
    });
    $('.js-sample_6 .js-sample__button').click(function(){
        $(this)
            .closest('.js-sample')
            .find('.js-sample__tape')
            .tape('stepInTo', 20);
    });
    $('.js-sample_7 .js-sample__tape')
        .tape('rotate');
    $('.js-sample_7 .js-sample__tape')
        .tape('rotate', {
            element: $('.js-sample_7 .js-sample__rotation-handler'),
            direction: -1,
            deltaX: 5
        });
});
