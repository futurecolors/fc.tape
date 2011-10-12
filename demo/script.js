$(function(){
    $('.js-sample__tape').tape();

    $('.js-sample_1 .js-sample__button, .js-sample_2 .js-sample__button').click(function(){
        $(this)
            .closest('.js-sample')
            .find('.js-sample__tape')
            .tape('windToNext');
    });
});
