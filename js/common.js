//'use strict';

window.dataLayer = window.dataLayer || [];

var uni_touch_support;
	
if ('ontouchstart' in document.documentElement) uni_touch_support = true;

$(function() {	
	if(uni_touch_support) {
		$('body').addClass('touch-support');
	}
	
	if (document.documentMode || /Edge/.test(navigator.userAgent)) {
		$('body').css('line-height', '20px');
	}
	
	$('header #phone .dropdown-menu').on('mouseenter', function() {
	    $(this).css('display', 'block');
	}).on('mouseleave',function () {
	    $(this).removeAttr('style');
	});
	
	// menu	
	$('main').on('click', function() {
		$('#menu .navbar-collapse').removeClass('in');
	});
	
	$('#menu').on('click', 'span.visible-xs', function() {
		$(this).parent().toggleClass('open');
	});
	
	uniMenuAim();
	uniMenuDropdownPos();
	uniMenuMobile();
	uniMenuBlur();
	// menu
	
	uniChangeBtn(uni_incart_products);
	
	$('#language').on('click', 'li a', function(e) {
		e.preventDefault();
		$('#language input[name=\'code\']').val($(this).data('code'));
		$('#language').submit();
	});
	
	$('#currency').on('click', 'li a', function(e) {
		e.preventDefault();
		$('#currency input[name=\'code\']').val($(this).data('code'));
		$('#currency').submit();
	});
	
	$(document).on('click', '.search ul li', function () {
		$(this).closest('.search').find('button span').text($(this).text());
		$(this).closest('.search').find('input[name=\'filter_category_id\']').val($(this).data('id'));
	});

	$(document).on('click', '.search-btn', function() {
		url = $('base').attr('href') + 'index.php?route=product/search';
		
		var elem = $(this).closest('.search'), 
			value = elem.find('input[name="search"]').val(), 
			filter_category_id = elem.find('input[name=\'filter_category_id\']').val();
		
		if (value) url += '&search='+encodeURIComponent(value);
		if (filter_category_id > 0) url += '&category_id='+encodeURIComponent(filter_category_id)+'&sub_category=true';
		url += '&description=true';
		
		window.location = url;
	});

	$(document).on('keydown', 'input[name="search"]', function(e) {
		if (e.keyCode == 13) {
			$(this).parent().find('.search-btn').click();
		}
	});
	
	$(document).on('input', 'input[name="search"]', function(e) {
		$('input[name="search"]').not($(this)).val($(this).val());
	});
	
	$('#search_phrase a').on('click', function() {
		$('#search input[name="search"]').val($(this).text());
		$('#search .search-btn').click();
	});
	
	$('#phone .additional-phone span').on('click', function() {
		$('#phone .additional-phone span').addClass('selected').not($(this)).removeClass('selected');
		$('#phone .main-phone').text($(this).data('phone')).data('href', $(this).data('href'));
	});
	
	$('.add_to_cart.disabled').each(function(){
		$(this).attr('disabled', true);
	});
	
	if(!uni_touch_support) {
		$('[data-toggle=\'tooltip\']').tooltip({container:'body', trigger:'hover'});
	}
	
	if($(window).width() < 500) {
		$('header #cart .dropdown-menu').width($(window).width()-57);
	}
	
	$(document).ajaxStop(function() {	
		$('.modal.animated').on('hide.bs.modal', function() {
			$(this).removeClass(uniJsVars.popup_effect_in).addClass(uniJsVars.popup_effect_out);
		});
		
		$('.modal.animated').on('hidden.bs.modal', function() {
			$(this).remove();
		});
		
		if(!uni_touch_support) {
			$('[data-toggle=\'tooltip\']').tooltip({container:'body', trigger:'hover'});
		}
		
		if($(window).width() < 500) {
			$('header #cart .dropdown-menu').width($(window).width()-57);
		}
	});
	
	//quantity
	$('body').on('keyup', '.product-thumb .quantity input, .product-block .quantity input', function() {
		var $this = $(this), qty = parseFloat($this.val()), min = $this.data('minimum') ? $this.data('minimum') : 1, max = 100000, new_qty;

		new_qty = (qty > min) && (qty < max) ? qty : min;
			
		$this.val(new_qty).change();
	});
		
	$('body').on('click', '.product-thumb .quantity i, .product-block .quantity i', function() {
		var $this = $(this).parent().prev(), btn = $(this), qty = parseFloat($this.val()), min = $this.data('minimum') ? $this.data('minimum') : 1, max = 100000, new_qty;
				
		new_qty = btn.hasClass('fa-plus') ? ((qty < max) ? qty+1 : qty) : ((qty > min) ? qty-1 : qty);
			
		$this.val(new_qty).change();
	});
	
	if(uniJsVars.additional_image && !uni_touch_support) {
		$('main').on('mouseenter', '.product-thumb', function () {
			var img = $(this).find('.image a img');
		
			if (img.data('additional')) {
				img.addClass('main').after('<img src="'+img.data('additional')+'" class="additional img-responsive" />').data('additional', '');
			}
		});
	}
	
	$('body').on('mouseenter', '.option-image img', function() {
		var elem = $(this),
			block = $('<div class="option-image-popup '+elem.data('type')+'"><img src="'+elem.attr('src')+'" class="img-responsive" /><span>'+elem.attr('alt')+'</span></div>'),
			elemTop = elem.offset().top,
			elemLeft = elem.offset().left+(elem.outerWidth()/2);
		
		$('body').append(block);
			
		setTimeout(function() {
			block.css({top: elemTop-block.outerHeight()-10, left: elemLeft-(block.outerWidth()/2)}).addClass('hover');
		}, 100);
	}).on('mouseleave', '.option-image', function() {
		$('.option-image-popup').remove();
	});
	
	if(uniJsVars.change_opt_img) {
		$('main').on('click', '.product-thumb .option-image img', function() {
			$(this).closest('.product-thumb').find('a img:first').attr('src', $(this).data('thumb'));
		});
	}
	
	uniProductThumbHover();
	
	$('body').on('click', '.uni-href', function() {
		if($(this).data('href') != '') location = $(this).data('href');
	});
});

var uniSelectView = {
	init:function(viewtype){
		var base = this, storage_display = localStorage.getItem('display');
			
		if(!storage_display) storage_display = default_view;
	
		if ((storage_display || viewtype) == 'list') {
			base.list();
		} else if ((storage_display || viewtype) == 'compact')  {
			base.compact();
		} else {
			base.grid();
		}
		
		base.bind();
		base.mobile();
	},
	list:function() {
		$('.product-grid, .product-price').attr('class', 'product-layout product-list col-sm-12');
		
		$('#grid-view, #grid2-view, #compact-view').removeClass('selected');
		$('#list-view').addClass('selected');
		$('.product-list .caption > a, .product-list .description, .product-list .option').height('auto');
		
		localStorage.setItem('display', 'list');
	},
	grid:function() {
		var col_left = $('#column-left').length, col_right =  $('#column-right').length, menu = $('.breadcrumb.col-md-offset-3.col-lg-offset-3').length;

		if ((col_left && col_right) || (col_right && menu)) {
			block_class = 'product-layout product-grid col-sm-12 col-md-6 col-lg-6 col-xxl-6-1';
		} else if (col_left || col_right || menu) {
			block_class = 'product-layout product-grid col-sm-6 col-md-4 col-lg-4 col-xxl-5';
		} else {
			block_class = 'product-layout product-grid col-sm-6 col-md-3 col-lg-3 col-xxl-4';
		}
	
		$('.product-grid, .product-list, .product-price').attr('class', block_class);
		
		$('#list-view, #grid2-view, #compact-view').removeClass('selected');
		$('#grid-view').addClass('selected');
	
		if($(window).width() > 600) {
			$product = $('.product-grid .product-thumb');
	
			uniAutoHeight($product.find('.caption > a'));
			uniAutoHeight($product.find('.description'));
			uniAutoHeight($product.find('.option'));
		}
		
		localStorage.setItem('display', 'grid');
	},
	compact:function() {
		$('.product-list, .product-grid').attr('class', 'product-layout product-price col-sm-12');
	
		if($('.product-price .product-thumb .option > *').length == 0) {
			$('.product-price .product-thumb .option').remove();
			$('.product-price .product-thumb .attribute').addClass('visible-xxl');
		}
		
		$('#list-view, #grid-view, #grid2-view').removeClass('selected');
		$('#compact-view').addClass('selected');
		
		$('.product-price .caption > a, .product-price .description, .product-price .option').height('auto');
	
		localStorage.setItem('display', 'compact');
	},
	mobile:function() {
		var base = this, lastWindowWidth = $(window).width(), breakpoint = 768;
			
		if(lastWindowWidth <= breakpoint) {
			base.grid();
		}
			
		$(window).resize(function(){
			if($(this).width() != lastWindowWidth && $(this).width() <= breakpoint){
				base.grid();
			}
		});
	},
	bind:function() {
		var base = this;
			
		$('#list-view').on('click', function() {
			base.list();
		});
	
		$('#grid-view').on('click', function() {
			base.grid();
		});
	
		$('#compact-view').on('click', function() {
			base.compact();
		});
	}
};

function uniMenuBlur() {
	if(uni_touch_support || !uniJsVars.menu_blur) return
		
	var uni_blur_blocks = $('header > div:not(#main-menu), #menu2, main, footer'), blur_delay = uniJsVars.menu_blur == 1 ? 110 : 10, blur_timer;
		
	$('#menu.menu1, #menu.menu2, #menu.menu3').on('mouseenter', function() {
		blur_timer = setTimeout(function() { 
			uni_blur_blocks.addClass('blur');
		}, blur_delay);
	}).on('mouseleave', function() {
		clearTimeout(blur_timer);
		uni_blur_blocks.removeClass('blur');
	});
};

function uniMenuAim() {
	if(uni_touch_support) return;
	
	$('#menu.menu2 .has-children, #menu2 .has-children').on('mouseenter', function() {
		$('#menu.menu2, #menu2').addClass('open');
		$(this).addClass('open');
	}).on('mouseleave', function() {
		$('#menu.menu2, #menu2').removeClass('open');
		$(this).removeClass('open');
	});
		
	$('#menu.menu1 .nav, #menu.menu3 .nav').menuAim({
		rowSelector:'>li',
		submenuSelector:'*',
		activate:function(data) {
			$(data).addClass('open');
		},
		deactivate:function(data) {
			$(data).removeClass('open');
		},
		exitMenu:function() {
			return true;
		}
	});
};

function uniMenuUpd(block) {
	
	if(!$(block).length) return;
	
	var init = function() {
		var lastWindowWidth = $(window).width(),
			menu_block = $(block),
			new_items = '';
			
		if(lastWindowWidth > 980 && lastWindowWidth < 1600) {
			var menu_width = menu_block.outerWidth(), 
				menu_items = menu_block.find('> li').not('.additional');
				total_width = 0;
		} else {
			if(menu_block.find('.additional').length) {
				menu_block.find('> li').not('.additional').show();
				menu_block.find('.additional').remove();
			}
			
			return;
		}
		
		if(menu_items.length > 6) {
			menu_width = menu_width - 50;
		}
		
		menu_items.each(function() {
			total_width += $(this).outerWidth(true);
				
			if(total_width > menu_width) {
				
				var item = $(this).find('> a'), item_child = $(this).find('.second-level > ul > li > a'), new_child_items = '';
				
				new_items += '<ul class="list-unstyled col-sm-12">';
				
				if(item_child.length) {
					new_child_items = '<div class="third-level"><ul class="list-unstyled">';
				
					item_child.each(function() {
						new_child_items += '<li><a href="'+$(this).attr('href')+'">'+$(this).text()+'</a></li>';
					});
					
					new_child_items += '</ul></div>';
				}
				
				new_items += '<li><a href="'+item.attr('href')+'">'+item.text()+'</a>'+new_child_items+'</li>';
				
				new_items += '</ul>';

				$(this).hide();
			} else {
				$(this).show();
			}
		});
		
		if (total_width > menu_width) {
			if (!menu_block.find('.additional').length) {
				var html = '<li class="additional has-children">';
				    html += '<a><i class="fa fa-ellipsis-h"></i></a>';
				    html += '<div class="second-level column-1"></div>';
				    html += '</li>';
					
				menu_block.append(html);
				
				uniMenuAim();
			}
				
			menu_block.find('.additional .second-level').html(new_items);
		} else {
			menu_block.find('.additional').remove();
		}
	}
	
	init();
	
	$(window).resize(function() {
		setTimeout(function() { 
			init();
		}, 200);
	});
};

function uniMenuDropdownPos() {
	var menu_block = $('#menu.menu2 .nav, #menu2');
	
	var init = function() {
		if($(window).width() > 992) {
			setTimeout(function() {
				menu_block.find('.second-level').each(function() {
					var child_pos = ($(this).parent().offset().left + $(this).outerWidth()) - (menu_block.offset().left + menu_block.outerWidth());
			
					if (child_pos > 0) {
						$(this).css('margin-left', '-'+child_pos+'px');
					}
				});
			}, 300);
		}
	}
	
	init();
	
	$(window).resize(function() {
		init();
	});
};

function uniMenuMobile() {
	var menu1 = $('#menu.menu1 .nav'),
		menu2 = $('#menu2');
		
	if(!menu1.length) return;
	
	var init = function() {
		var windowWidth = $(window).width();
		
		if(windowWidth <= 992) {
			menu2.find('>li').addClass('menu2').appendTo(menu1);
		} else {
			menu1.find('.menu2').removeClass('menu2').appendTo(menu2);
		}
		
		$windowWidth = windowWidth;
	}
	
	init();
	
	$(window).resize(function() {
		if ($(window).width() != $windowWidth) {
			init();
		}
	});
}

function uniProductThumbHover() {
	if(uni_touch_support || (!uniJsVars.descr_hover && !uniJsVars.attr_hover && !uniJsVars.option_hover)) {
		return;
	}
	
	$('body').on('mouseenter', '.product-thumb', function() {
		var product = $(this),
			container = product.parent(),
			carousel = product.closest('.owl-carousel'),
			descr = uniJsVars.descr_hover ? product.find('.description') : '',
			attr = uniJsVars.attr_hover ? product.find('.attribute') : '',
			options = uniJsVars.option_hover ? product.find('.option') : '';
			
		if(container.hasClass('product-list') || container.hasClass('product-price')) {
			return;
		}
			
		if($(options).children().width() == null || $(options).children().width() == 0) container.height(product.outerHeight(true));
			
		if(carousel.length) {
			if(container.hasClass('owl-item')) container.addClass('select');
			if(container.hasClass('owl-carousel')) container = container.find('.owl-item.select');
			
			product.css({left: product.offset().left - carousel.offset().left, width: product.outerWidth()}).detach().addClass('hover').prependTo(carousel);
		} else {
			product.css({width: product.outerWidth()}).addClass('hover');
		}
			
		if(descr) descr.show();
		if(attr) attr.show();
		if(options && options.children().length) options.show();

		product.on('mouseleave', function(e) {
			product.css({left: '', width: ''}).removeClass('hover');
				
			if(carousel.length) product.detach().appendTo(container);
				
			container.css({height: ''});
				
			if(descr) descr.hide();
			if(attr) attr.hide();
			if(options && options.children().length) options.hide();
				
			product.unbind('mouseleave');
			container.removeClass('select');
		});
		
		product.on('mouseleave', 'select', function(e) {
			e.stopPropagation();
		});
	});
};

function uniBannerLink(url) {
	$.ajax({
		url: url,
		type: 'get',
		dataType: 'html',
		success: function(data) {
			var data = $(data);
			
			title = data.find('.heading-h1 h1').text();
			data.find('.heading-h1').remove();
			text = data.find('#content').html();
			
			uniModalWindow('modal-banner', '', title, text);
		}
	});
}

function form_error(form, input, text) {
	var element = $(form+' input[name=\''+input+'\'], '+form+' textarea[name=\''+input+'\'], '+form+' select[name=\''+input+'\']').addClass('input-warning');
	
	$(form+' .input-warning').click(function() {
		$(this).removeClass('input-warning');
	});
}

function scroll_to(target) {		
	$('html, body').animate({scrollTop: $(target).offset().top-100}, 400);
}

function uniChangeBtn(products_id) {
	for(i in products_id) {
		var $button = $('.'+products_id[i]);
		
		$button.addClass('in_cart');
		$button.find('i').attr('class', uniJsVars.cart_btn_icon_incart);
		$button.find('span').text(uniJsVars.cart_btn_text_incart);
	}
}
	
function uniReturnBtn(product_id) {
	var index = uni_incart_products.indexOf(product_id);
	
	if(index != -1) uni_incart_products.splice(index, 1);
	
	$('.'+product_id).removeClass('in_cart').find('i').attr('class', uniJsVars.cart_btn_icon).find('span').text(uniJsVars.cart_btn_text);
}

function uniModalWindow(id, type, title, data) {
	
	/* 	id = id modal form;	type = sm, lg, or empty; title = title modal form;	data = text or other data modal form; */
	
	$('#'+id).remove();
				
	html  = '<div id="'+id+'" class="modal '+uniJsVars.popup_effect_in+'">';
	html += '<div class="modal-dialog modal-'+type+'">';
	html += '<div class="modal-content">';
	html += '<div class="modal-header">';
	html += '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>';
	html += '<h4 class="modal-title">'+title+'</h4>';
	html += '</div>';
	html += '<div class="modal-body">'+data+'</div>';
	html += '</div>';
	html += '</div>';
	html += '</div>';
	
	$('html body').append(html);
	$('#'+id).modal('show');
}

function uniAutoHeight(div) {
	var block_height = function() {
		$(div).css({height: ''});
		
		var maxheight = 0;
		
		$(div).each(function(){
			if($(this).height() > maxheight) {
				maxheight = $(this).height();
			}
		});
		
		if(maxheight > 0) $(div).height(maxheight);
	};
	
	block_height();
	$(window).resize(block_height);
}

function uniFlyAlert(type, data) {
	var time = uniJsVars.alert_time,
		time1 = time*1000,
		time2 = time1+1000,
		time3 = 100,
		top_offset = 50,
		top_margin = 10,
		icon;
	
	if(type == 'success') icon = 'fa-check-circle';
	if(type == 'danger') icon = 'fa-times-circle';
	if(type == 'warning') icon = 'fa-exclamation-circle';
	
	var createAlert = function(data) {
		if($('.uni-alert').length) {
			top_offset = $('.uni-alert:last').position().top + $('.uni-alert:last').outerHeight() + top_margin;
		}
	
		var block = $('<div class="uni-alert alert-'+type+' '+uniJsVars.alert_effect_in+'" style="top:'+top_offset+'px"><i class="fa '+icon+'"></i>'+data+'</div>');
	
		$('html body').append(block);
	
		setTimeout(function() {
			block.removeClass(uniJsVars.alert_effect_in).addClass(uniJsVars.alert_effect_out);
		}, time1);
	
		setTimeout(function() { 
			block.remove();
		}, time2);
	}
	
	if(data.constructor == Object) {
		var arr = [];
	
		for (i in data) {
			arr.push(data[i]);
		}
	
		var index = -1,
			timer = setInterval(function () {
			if (++index == arr.length) {
				clearInterval(timer);
			} else {
				createAlert(arr[index]);
			}
		}, time3);
	} else {
		createAlert(data);
	}
}

//add css and js from script
var cssUrls = [], jsUrls = [];

function uniAddCss(url) {
	if(cssUrls.indexOf(url) == -1) {
		cssUrls.push(url);
		var style = '<link href="'+url+'" rel="preload" as="style" />';
		style += '<link href="'+url+'" type="text/css" rel="stylesheet" media="screen" />';
		$('html head').append(style)
	}
}

function uniAddJs(url) {
	if(jsUrls.indexOf(url) == -1) {
		jsUrls.push(url);		
		var script = $('<script async defer src="'+url+'"></script>');
		$('html head').append(script);
	}
}

(function($){
	var Modules = {
		init:function(options, el) {
            var base = this;
			
			base.$elem = $(el);
			base.$elem2 = $(el).children();
			base.options = $.extend({}, $.fn.uniModules.options, options);
			
			base.load();
        },
		load:function() {
			var base = this, wrapper = base.$elem;
			
			if(base.$elem.parent().parent().hasClass('tab-content')) {
				wrapper = base.$elem.parent().parent();
			}
			
			base.wrapper = wrapper;
			
			if((wrapper.width()+20) < 768) {
				base.options.type = 'carousel';
				base.$elem2.children().removeAttr('style');
			}
			
			if (base.options.type == 'grid') {					
				base.$elem.addClass('grid');
				base.$elem2.children().wrap('<div class="item"></div>');
				base.$elem2.children().css({width:base.items()});
			} else {
				base.$elem2.addClass('owl-carousel').owlCarousel({
					responsive:base.options.items,
					responsiveBaseElement:wrapper,
					dots:base.options.dots,
					mouseDrag:false,
					loop:base.options.loop,
					autoplay:base.options.autoplay,
					nav:true,
					navText:['<i class="fa fa-chevron-left"></i>', '<i class="fa fa-chevron-right"></i>'],
				});
				
				var $item = base.$elem2.find('.owl-item');
				
				if($item.width() <= 0)	{
					//var $stage = base.$elem2.find('.owl-stage');
					
					$item.css({width:base.items()});
					//$stage.css({width:$item.length * base.items()});
				}
			}
			
			base.update();
			base.reload();
			base.responsive();
		},
		items:function() {
			var base = this, match = -1, width = base.wrapper.width()+20;
			
			$.each(base.options.items, function(breakpoint) {
				if (breakpoint <= width && breakpoint > match) {
					match = Number(breakpoint);
				}
			});
			
			return Math.floor(width / base.options.items[match]['items']);
		},
		update:function() {
			var base = this, div_arr = base.options.autoheight, delItems = [];
			
			if($(window).width() < 768) {
				base.$elem.addClass('load-complete');
				return;
			}
			
			for (i in div_arr) {
				var maxheight = 0, $elem = base.$elem.find('.'+div_arr[i]);
				
				$elem.removeAttr('style');

				$.each($elem, function() {
					if($(this).height() > maxheight) {
						maxheight = $(this).height();
					}
				});
				
				if(maxheight > 0) $elem.height(maxheight);
			}
			
			base.$elem.addClass('load-complete');
		},
		responsive:function () {
            var base = this, lastWindowWidth = $(window).width();
			
			base.resizer = function () {
                if ($(window).width() !== lastWindowWidth) {
					if (base.options.type == 'grid') {	
						base.$elem2.children().css('width', base.items());
					}
					
					base.update();
                }
            };
			
			$(window).resize(function() {
				base.resizer();
			});
        },
		reload:function() {
			var base = this, div = base.$elem.parent(), modal = div.hasClass('modal-body') ? true : false, tab = div.hasClass('tab-pane') ? div.attr('id') : false;
			
			if(modal) {
				setTimeout(function() { 
					base.update();
				}, 750);
			}
			
			if(tab) {
				div.parent().prev().find('li a').on('shown.bs.tab', function(e) {
					if($(this).attr('href') == '#'+tab) {
						base.update();
					}
				});
			}
		}
	};
	
	$.fn.uniModules = function(options) {		
		return this.each(function () {
            if ($(this).data('uni-modules-init') === true) {
                return false;
            }
			
            $(this).data('uni-modules-init', true);
			
            var module = Object.create(Modules);
            module.init(options, this);
        });
	};
	$.fn.uniModules.options = {
		type 	   :'carousel',
		items	   :{0:{items:1},520:{items:2},700:{items:3},940:{items:4},1050:{items:4},1400:{items:5}},
		autoheight :[],
		dots	   :true,
		loop	   :false,
		autoplay   :false
	}
})(jQuery);

(function($){
	var Timer = {
		init:function(options, el) {
            var base = this;
			
			base.options = $.extend({}, $.fn.uniTimer.options, options);
			base.days = 24*60*60, base.hours = 60*60, base.minutes = 60;
			
			var date_arr = base.options.date.split('-'),
				year = parseFloat(date_arr[0]), 
				month = parseFloat(date_arr[1])-1, 
				day = parseFloat(date_arr[2]);
			
			base.$date = (new Date(year, month, day)).getTime();
			base.$elem = $(el);
			
			if(base.$date > (new Date()).getTime())	{
				base.load();
			}
        },
		load:function() {
			var base = this, i = 4;
			
			html = '<div class="uni-timer">';
			
			for(i in base.options.texts){
				
				if(i > 0) {
					html += '<div class="colon">:</div>';
				}
				
				html += '<div class="digit-group-'+i+'">';
				html += '<span class="digits"></span><span class="digits"></span>';
				
				if(!base.options.hideText) {
					html += '<div class="text">'+base.options.texts[i]+'</div>';
				}
				
				html += '</div>';
			}
			
			html += '</div>';
			
			base.$elem.append(html);
			base.$positions = base.$elem.find('.digits');
			base.count();
		},
		count:function() {
			var base = this, left, d, h, m, s;
			
			left = Math.floor((base.$date - (new Date()).getTime())/1000);
			
			left = left > 0 ? left : 0;
			
			d = Math.floor(left / base.days);
			left -= d*base.days;
			h = Math.floor(left / base.hours);
			left -= h*base.hours;
			m = Math.floor(left / base.minutes);
			left -= m*base.minutes;
			s = left;
			
			base.count2(0, 1, d);
			base.count2(2, 3, h);
			base.count2(4, 5, m);
			base.count2(6, 7, s);
			
			if (d == 0) base.hideGroup(0);
			if (h == 0) base.hideGroup(1);
			
			setTimeout(function() { 
				base.count();
			}, 1000);
		}, 
		count2:function(minor, major, value) {
			var base = this;
			
			base.switchDigit(base.$positions.eq(minor), Math.floor(value/10)%10);
			base.switchDigit(base.$positions.eq(major), value%10);
		},
		switchDigit:function(position, number) {
			var base = this;
			
			if(position.data('digit') == number){
				return false;
			}
	
			position.data('digit', number).text(number);
		},
		hideGroup:function(num) {
			var base = this;
			
			if(base.options.hideIsNull) {
				base.$elem.find('.digit-group-'+num+', .digit-group-'+num+' + .colon').hide();
			}
		}
	}
	
	$.fn.uniTimer = function(options) {		
		return this.each(function () {
            if ($(this).data("uni-timer-init") === true) {
                return false;
            }
			
            $(this).data("uni-timer-init", true);
			
            var timer = Object.create(Timer);
            timer.init(options, this);
        });
	};
	
	$.fn.uniTimer.options = {
		date		:'0000-00-00',
		texts		:['Дней','Часов','Минут','Секунд'],
		hideText	:false,
		hideIsNull	:false
	};
})(jQuery);

// Cart add remove functions
var cart = {
	'add': function(product_id, elem) {
		
		var $elem = $(elem).closest('.product-thumb'),
			product_qty = $elem.find('.quantity input').val(), 
			product_options = $elem.find('.option input[type=\'text\'], .option input[type=\'hidden\'], .option input:checked, .option select, .option textarea'),
			data = 'product_id='+product_id+'&quantity='+(typeof(product_qty) != 'undefined' ? product_qty : 1);
		
		if (product_options.length) {
			data += '&'+product_options.serialize();
		}
		
		$.ajax({
			url: 'index.php?route=checkout/cart/add',
			type: 'post',
			data: data,
			dataType: 'json',
			success: function(json) {
				$('.text-danger').remove();

				if (json['redirect'] && !$elem.find('.option').children().length) {
					window.location = json['redirect'];
				}
				
				$('.form-group').removeClass('has-error');

				if (json['error']) {
					if (json['error']['option']) {
						for (i in json['error']['option']) {
							var elem = $('.option .input-option' + i.replace('_', '-')), elem2 = (elem.parent().hasClass('input-group')) ? elem.parent() : elem;
							
							elem2.after('<div class="text-danger">'+json['error']['option'][i]+'</div>');
							$('.option .text-danger').delay(5000).fadeOut();
							
							uniFlyAlert('danger', json['error']['option'][i])
						}
					}
				}

				if (json['success']) {
					if(!$('#unicheckout').length) {
						
						if(!uniJsVars.cart_popup_disable) {
							uniModalWindow('modal-cart', '', '', json['success']);
						}
						
						if(uniJsVars.cart_popup_autohide) {
							setTimeout(function() { 
								$('#modal-cart').modal('hide');
							}, uniJsVars.cart_popup_autohide_time * 1000);
						}
					}
					
					uniChangeBtn([product_id]);
					
					$('header #cart').load('index.php?route=common/cart/info #cart > *');
				
					dataLayer.push({
						'ecommerce':{
							'currencyCode':uniJsVars.currency,
							'add':{
								'products':[json['products']]
							}
						}
					});
				}
			},
	        error: function(xhr, ajaxOptions, thrownError) {
	            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
	        }
		});
	},
	'update': function(key, quantity, product_id) {
		var cart = $('header #cart');
		
		cart.attr('class', 'open2');
		
		$.ajax({
			url: 'index.php?route=checkout/cart/edit',
			type: 'post',
			data: 'quantity['+key+']='+quantity,
			dataType: 'html',
			success: function(data) {
				cart.load('index.php?route=common/cart/info #cart > *');
				cart.attr('class', 'open');
				
				if (getURLVar('route') == 'checkout/cart' || getURLVar('route') == 'checkout/checkout') {
					$('#content').load('index.php?route=checkout/cart #content > *');
				}
				
				if(typeof(product_id) != 'undefined' && quantity <= 0) {
					uniReturnBtn(product_id);
				}
			},
	        error: function(xhr, ajaxOptions, thrownError) {
	            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
	        }
		});
	},
	'remove': function(key, product_id) {
		var cart = $('header #cart');
		
		cart.attr('class', 'open2');
		
		$.ajax({
			url: 'index.php?route=checkout/cart/remove',
			type: 'post',
			data: 'key='+key,
			dataType: 'json',
			success: function(json) {
				cart.load('index.php?route=common/cart/info #cart > *');
				cart.attr('class', 'open');

				if (getURLVar('route') == 'checkout/cart' || getURLVar('route') == 'checkout/checkout') {
					$('#content').load('index.php?route=checkout/cart #content > *');
				}
				
				uniReturnBtn(product_id);
			},
	        error: function(xhr, ajaxOptions, thrownError) {
	            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
	        }
		});
	}
}

var voucher = {
	'add': function() {

	},
	'remove': function(key) {
		$.ajax({
			url: 'index.php?route=checkout/cart/remove',
			type: 'post',
			data: 'key=' + key,
			dataType: 'json',
			beforeSend: function() {
				$('#cart > button').button('loading');
			},
			complete: function() {
				$('#cart > button').button('reset');
			},
			success: function(json) {
				$('#cart #cart-total').html(json['total']);

				if (getURLVar('route') == 'checkout/cart' || getURLVar('route') == 'checkout/checkout') {
					window.location = 'index.php?route=checkout/cart';
				} else {
					$('#cart > ul').load('index.php?route=common/cart/info ul li');
				}
				
				if (getURLVar('route') == 'checkout/unicheckout') {
					update_checkout();
				}
			},
	        error: function(xhr, ajaxOptions, thrownError) {
	            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
	        }
		});
	}
}

var wishlist = {
	'add': function(product_id) {
		$.ajax({
			url: 'index.php?route=account/wishlist/add',
			type: 'post',
			data: 'product_id=' + product_id,
			dataType: 'json',
			success: function(json) {
				if (json['redirect']) {
					window.location = json['redirect'];
				}

				if (json['success']) {
					
					uniFlyAlert('warning', json['success']);

					$('#wishlist-total span').html(json['total']);
					$('#wishlist-total').attr('title', json['total']);
					
					var wishlist_total = json['total'].replace(/\s+/g, '').match(/(\d+)/g);
					
					$('.fly-wishlist .total').text(wishlist_total);
					$('.fly-wishlist').addClass('visible');
				}
			},
	        error: function(xhr, ajaxOptions, thrownError) {
	            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
	        }
		});
	},
	'remove': function() {

	}
}

var compare = {
	'add': function(product_id) {
		$.ajax({
			url: 'index.php?route=product/compare/add',
			type: 'post',
			data: 'product_id=' + product_id,
			dataType: 'json',
			success: function(json) {
				if (json['success']) {
					
					uniFlyAlert('success', json['success']);
					
					$('#compare-total').html('<i class="fas fa-align-right"></i>'+json['total']);
					
					var compare_total = json['total'].replace(/\s+/g, '').match(/(\d+)/g);
					
					$('.fly-compare .total').text(compare_total);
					$('.fly-compare').addClass('visible');
				}
			},
	        error: function(xhr, ajaxOptions, thrownError) {
	            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
	        }
		});
	},
	'remove': function() {

	}
}

$(document).on('click', '.agree', function(e) {
	e.preventDefault();
	
	var element = this;

	$.ajax({
		url: $(element).attr('href'),
		type: 'get',
		dataType: 'html',
		success: function(data) {
			var text = $(data).find('.article_description').length ? $(data).find('.article_description').html() : data;
			
			uniModalWindow('modal-agree', '', $(element).text(), text);
		}
	});
});

function getURLVar(key) {
	var value = [];

	var query = String(document.location).split('?');

	if (query[1]) {
		var part = query[1].split('&');

		for (i = 0; i < part.length; i++) {
			var data = part[i].split('=');

			if (data[0] && data[1]) {
				value[data[0]] = data[1];
			}
		}

		if (value[key]) {
			return value[key];
		} else {
			return '';
		}
	}
}

(function($) {
	$.fn.autocomplete = function(option) {
		return this.each(function() {
			this.timer = null;
			this.items = new Array();

			$.extend(this, option);

			$(this).attr('autocomplete', 'off');

			$(this).on('focus', function() {
				this.request();
			});

			$(this).on('blur', function() {
				setTimeout(function(object) {
					object.hide();
				}, 200, this);
			});

			$(this).on('keydown', function(event) {
				switch(event.keyCode) {
					case 27: // escape
						this.hide();
						break;
					default:
						this.request();
						break;
				}
			});

			this.click = function(event) {
				event.preventDefault();

				value = $(event.target).parent().attr('data-value');

				if (value && this.items[value]) {
					this.select(this.items[value]);
				}
			}

			this.show = function() {
				var pos = $(this).position();

				$(this).siblings('ul.dropdown-menu').css({
					top: pos.top + $(this).outerHeight(),
					left: pos.left
				});

				$(this).siblings('ul.dropdown-menu').show();
			}

			this.hide = function() {
				$(this).siblings('ul.dropdown-menu').hide();
			}

			this.request = function() {
				clearTimeout(this.timer);

				this.timer = setTimeout(function(object) {
					object.source($(object).val(), $.proxy(object.response, object));
				}, 200, this);
			}

			this.response = function(json) {
				html = '';

				if (json.length) {
					for (i = 0; i < json.length; i++) {
						this.items[json[i]['value']] = json[i];
					}

					for (i = 0; i < json.length; i++) {
						if (!json[i]['category']) {
							html += '<li data-value="' + json[i]['value'] + '"><a href="#">' + json[i]['label'] + '</a></li>';
						}
					}

					var category = new Array();

					for (i = 0; i < json.length; i++) {
						if (json[i]['category']) {
							if (!category[json[i]['category']]) {
								category[json[i]['category']] = new Array();
								category[json[i]['category']]['name'] = json[i]['category'];
								category[json[i]['category']]['item'] = new Array();
							}

							category[json[i]['category']]['item'].push(json[i]);
						}
					}

					for (i in category) {
						html += '<li class="dropdown-header">' + category[i]['name'] + '</li>';

						for (j = 0; j < category[i]['item'].length; j++) {
							html += '<li data-value="' + category[i]['item'][j]['value'] + '"><a href="#">&nbsp;&nbsp;&nbsp;' + category[i]['item'][j]['label'] + '</a></li>';
						}
					}
				}

				if (html) {
					this.show();
				} else {
					this.hide();
				}

				$(this).siblings('ul.dropdown-menu').html(html);
			}

			$(this).after('<ul class="dropdown-menu"></ul>');
			$(this).siblings('ul.dropdown-menu').delegate('a', 'click', $.proxy(this.click, this));

		});
	}
})(window.jQuery);