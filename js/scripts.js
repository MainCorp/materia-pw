(function() {
	/**
	 * Отображает список сообщений из обсуждения в vk.com 
	 * @variable {Object} template шаблон для обсуждений
	 * @variable {Object} container контейнер, где будут обсуждения
	 *
	 * @variable {Number} group_id (id группы в вк)
	 * @variable {Number} topic_id (id обсуждения)
	 * @variable {Number} count колличество загруженных комментариев на странице
	 * @variable {Number} extended будут ли загружены профили в отзывы (0 - нет, 1 - да)
	 *
	 * @variable {String} linkToGroup ссылка на группу или администратора
	 * @variable {String} adminName имя администратора
	 * @variable {String} adminIcon иконка администратора
	 * @variable {Number} startComment точка отсчёта для комментария
	 */

	var template = document.querySelector('#comment-template');
	var container = $('.discuss-vk__content');

	var group_id = 144772246;
	var topic_id = 35034711;
	var count = 100;
	var extended = 1;

	var linkToGroup = 'https://vk.com/';
	var adminName = 'Администратор';
	var adminIcon = '';
	var startComment = 1;

	var apiLink;

	function showDiscussion(req, templateElement, commentsContainer, idStartComment) {
		var elementToClone;

		if ('content' in templateElement) {
			elementToClone = templateElement.content.querySelector('.comment');
		} else {
		  	elementToClone = templateElement.querySelector('.comment');
		}

		/**
		 * Парсит полученный объект и проводит валидацию
		 * @param {Object} comment клон комментария
		 * @param {Object} data объект с комментариями
		 * @param {Object} getText
		 * @param {String} getLink
		 */

		function validationComment(comment, data, getText, getLink) {
			var collectionTextItem = [];
			if (getText.length > 0) {
				getText = data.text.split('<br>');
			} else {
				getText = '';
			}

			for (key in data) {
				if (typeof data[key] === 'object') {
					if (getText.length > 0) {
						getLink = getText[1].split('Оригинал здесь:')[1];
					} else {
						getLink = '';
					}

					switch(data.attachments[0].type) {
						case 'photo':
							comment.querySelector('.comment__image').src = data.attachments[0].photo.src_big;
							break;
						case 'video':
							comment.querySelector('.comment__image').src = data.attachments[0].video.image_big;
							break;
						case 'sticker':
							comment.querySelector('.comment__image').src = data.attachments[0].sticker.photo_128;
								break;
					}
				}
			}

			collectionTextItem = [getText, getLink];

			return collectionTextItem;
		}

		/**
		 * Добавляет содержимое (автор, иконка, онлайн, ссылки) к комментарию
		 * @param {Number} i текущий элемент
		 * @param {Object} comments коллекция комментариев
		 * @param {Object} profiles коллекция пользователей
		 * @param {Object} comment ссылка на текущий комментарий
		 */

		function addAuthor(i, comments, profiles, comment) {
			for (var j = 0; j < profiles.length; j++) {
				if (i-1 === comments.length - 1) {
					return false;
				} else {
					if (comments[i].from_id === profiles[j].uid) {
	    				comment.querySelector('.comment__logo-image').src = profiles[j].photo_medium_rec;
	    				comment.querySelector('.comment__group-title').textContent = profiles[j].first_name + ' ' + profiles[j].last_name;
	    				
	    				if (profiles[j].online === 1) {
	    					comment.querySelector('.comment__online').textContent = 'online';
	    					comment.querySelector('.comment__online').style = 'font-weight: bold';
	    				} else {
	    					comment.querySelector('.comment__online').textContent = 'offline';
	    					comment.querySelector('.comment__online').style = 'font-weight: 300';
	    				}

	    				if (comments[i].from_id === 101) {
	    					comment.querySelector('.comment__group-title').textContent = adminName;
	    					comment.querySelector('.comment__group-title').href = linkToGroup;
	    					comment.querySelector('.comment__logo').href = linkToGroup;
	    					comment.querySelector('.comment__logo-image').src = adminIcon;
	    				} else {
	    					comment.querySelector('.comment__group-title').href = 'http://vk.com/' + profiles[j].screen_name;
	    					comment.querySelector('.comment__logo').href = 'http://vk.com/' + profiles[j].screen_name;
	    				}
	    			}
				}
    		}
		}

		/**
		 * Возвращает комментарий
		 * @param {Object} data объект с комментарием
		 * @param {Object} comments коллекция комментариев
		 * @param {Object} profiles коллекция пользователей
		 * @param {Object} i идентификатор текущего комментария
		 */

		function showCommentElement(data, comments, profiles, i) {
			var comment = elementToClone.cloneNode(true);
			var getText = data.text;
			var getLink;
			
			if (validationComment(comment, data, getText, getLink)[0][1] === 'Оригинал здесь: https://vk.com/wall-125264591_744') {
				comment.querySelector('.comment__text-title').textContent = validationComment(comment, data, getText, getLink)[0][0];
				comment.querySelector('.comment__original-link').textContent = validationComment(comment, data, getText, getLink)[0][1];
				comment.querySelector('.comment__original-link').href = validationComment(comment, data, getText, getLink)[1];
			} else {
				comment.querySelector('.comment__text-title').textContent = validationComment(comment, data, getText, getLink)[0];
			}

			addAuthor(i, comments, profiles, comment);

			return comment;
		}

		$.ajax({
		    url : req,
		    type : "GET",
		    dataType : "jsonp",
		    success : function(msg){
		    	var comments = $(msg.response.comments);
		    	var profiles = $(msg.response.profiles);
		    	
		    	for (var i = idStartComment; i < comments.length; i++) {
					commentsContainer.append(showCommentElement(comments[i], comments, profiles, i));
				}
		    }
		});
	}

	apiLink = 'https://api.vk.com/method/board.getComments?group_id=' + group_id + '&topic_id=' + topic_id + '&count=' + count + '&extended=' + extended;

	console.log(apiLink);
	showDiscussion(apiLink, template, container, startComment);
})();

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