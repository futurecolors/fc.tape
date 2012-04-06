hljs.initHighlightingOnLoad();

$(function(){
    $('.js-sample__tape').tape({preload: false});

    $('.js-sample_1 .js-sample__button, .js-sample_2 .js-sample__button').click(function(){
        $(this)
            .closest('.js-sample')
            .find('.js-sample__tape')
            .tape('setPosition', 0) // For loop play
            .tape('stepInTo', 4);
    });

    $('.js-sample__button.js-sample_3').bind('click', function(){
        $(this)
            .closest('.js-sample')
            .find('.js-sample__tape')
            .tape('windToNext');
    });
    $('.js-sample__button.js-sample_4').bind('click', function(){
        $(this)
            .closest('.js-sample')
            .find('.js-sample__tape')
            .tape('windToPrev');
    });

    var sample5Position = 0;
    $('.js-sample_5 .js-sample__button').click(function(){
        console.log(sample5Position ? 0 : 20);
        $(this)
            .closest('.js-sample')
            .find('.js-sample__tape')
            .tape('setPosition', sample5Position)
            .tape('windTo', sample5Position ? 0 : 20);
        sample5Position = sample5Position ? 0 : 20;
    });
    $('.js-sample_6 .js-sample__button').click(function(){
        $(this)
            .closest('.js-sample')
            .find('.js-sample__tape')
            .tape('setPosition', 0)
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
