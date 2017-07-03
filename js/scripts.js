(function() {
	$(window).on('load',function() {
	    $(".preloader").fadeOut("slow");;
	});
})();

(function() {
	var previewPlayBtn = $('.preview__play');
	var popupPromo = $('.promo');
	var popupPromoCurtailBtn = $('.promo__button--curtail');

	previewPlayBtn.on('click', function(evt) {
		evt.preventDefault();

		popupPromo.slideDown(400)
	});

	popupPromoCurtailBtn.on('click', function(evt) {
		popupPromo.slideUp(200)
	});

	$(document).keyup(function(e) {
        if (e.keyCode === 27) {
			popupPromo.slideUp(200);
		}
    });
})();

(function() {
	var previewPlayBtn = $('.media-all__link');
	var popupPromo = $('.media-all');
	var popupPromoCurtailBtn = $('.media-all__button--curtail');

	previewPlayBtn.on('click', function(evt) {
		evt.preventDefault();

		popupPromo.slideDown(400)
	});

	popupPromoCurtailBtn.on('click', function(evt) {
		popupPromo.slideUp(200)
	});

	$(document).keyup(function(e) {
        if (e.keyCode === 27) {
			popupPromo.slideUp(200);
		}
    });
})();

(function() {
	var polyrulesBtn = $('.trademark__link');
	var popupPolyrules = $('.polyrules');
	var popupPolyrulesCurtailBtn = $('.polyrules__button--curtail');

	polyrulesBtn.on('click', function(evt) {
		evt.preventDefault();

		popupPolyrules.slideDown(400)
	})

	popupPolyrulesCurtailBtn.on('click', function() {
		popupPolyrules.slideUp(200)
	});

	$(document).keyup(function(e) {
        if (e.keyCode === 27) {
			popupPolyrules.slideUp(200);
		}
    });
})();