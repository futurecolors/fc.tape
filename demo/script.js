$(function(){
    $('.js-sample__tape').tape({preload: false});

    $('.js-sample_1 .js-sample__button, .js-sample_2 .js-sample__button').click(function(){
        $(this)
            .closest('.js-sample')
            .find('.js-sample__tape')
            .tape('stepInTo', 9);
    });
    $('.js-sample_3 .js-sample__button').click(function(){
        $(this)
            .closest('.js-sample')
            .find('.js-sample__tape')
            .tape('windToNext');
    });
    $('.js-sample_4 .js-sample__button').click(function(){
        $(this)
            .closest('.js-sample')
            .find('.js-sample__tape')
            .tape('windToPrev');
    });
    $('.js-sample_5 .js-sample__button').click(function(){
        $(this)
            .closest('.js-sample')
            .find('.js-sample__tape')
            .tape('windTo', 9);
    });
    $('.js-sample_6 .js-sample__button').click(function(){
        $(this)
            .closest('.js-sample')
            .find('.js-sample__tape')
            .tape('stepInTo', 9);
    });
});
