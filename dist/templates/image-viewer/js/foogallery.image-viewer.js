(function($, _, _utils){

	_.ImageViewer = _utils.Class.extend(/** @lends FooGallery.ImageViewer */{
		/**
		 * @summary The 
		 * @param element
		 * @param options
		 */
		construct: function(element, options){
			this.options = $.extend(true, {}, _.ImageViewer.defaults, options);
			this.$el = $(element);
			this.$items = this.$el.find('.fiv-inner-container > .foogallery-item');
			this.$current = this.$el.find('.fiv-count-current');
			this.$prev = this.$el.find('.fiv-prev');
			this.$next = this.$el.find('.fiv-next');
		},
		init: function(){
			this.$el.on('foobox.previous', {self: this}, this.onfooboxprev)
				.on('foobox.next', {self: this}, this.onfooboxnext);
			this.$prev.on('click', {self: this}, this.onprevclick);
			this.$next.on('click', {self: this}, this.onnextclick);
			this.$items.removeClass('fiv-active').first().addClass('fiv-active');
		},
		destroy: function(){
			this.$el.off('foobox.previous', this.onfooboxprev).off('foobox.next', this.onfooboxnext);
			this.$prev.off('click', this.onprevclick);
			this.$next.off('click', this.onnextclick);
		},
		prev: function(){
			var $current = this.$items.filter('.fiv-active').removeClass('fiv-active'),
				$prev = $current.prev();

			if ($prev.length == 0) $prev = this.$items.last();
			$prev.addClass('fiv-active');
			this.$current.text($prev.index() + 1);
		},
		next: function(){
			var $current = this.$items.filter('.fiv-active').removeClass('fiv-active'),
				$next = $current.next();

			if ($next.length == 0) $next = this.$items.first();
			$next.addClass('fiv-active');
			this.$current.text($next.index() + 1);
		},
		onfooboxprev: function(e){
			e.data.self.prev();
		},
		onfooboxnext: function(e){
			e.data.self.next();
		},
		onprevclick: function(e){
			e.preventDefault();
			e.stopPropagation();
			e.data.self.prev();
		},
		onnextclick: function(e){
			e.preventDefault();
			e.stopPropagation();
			e.data.self.next();
		}
	});

	_.ImageViewer.defaults = {

	};

	$.fn.fgImageViewer = function(options){
		return this.each(function(){
			var fiv = $.data(this, "__FooGalleryImageViewer__");
			if (fiv){
				fiv.destroy();
			}
			fiv = new _.ImageViewer(this, options);
			fiv.init();
			$.data(this, "__FooGalleryImageViewer__", fiv);
		});
	};

})(
	FooGallery.$,
	FooGallery,
	FooGallery.utils
);
(function(_){

	_.ready(function($){

		/* Image Viewer Gallery */
		$(".foogallery-image-viewer").each(function(){
			var $gallery = $(this),
				// get the options for the loader
				loader = $gallery.data("loader-options");

			// Find all images that have a width and height attribute set and calculate the size to set as a temporary inline style.
			// This calculated size is used to prevent layout jumps.
			$gallery.fgAddSize(true);

			// Now that all images have a respectable size initialize the loading.
			$gallery.fgImageViewer().fgLoader( $.extend(true, loader, {
				oninit: function(){
					// the first time the gallery is initialized it triggers a window resize event
					$(window).trigger("resize");
				},
				onload: function(image){
					// once the actual image is loaded we no longer need the inline css used to prevent layout jumps so remove it
					$(image).fgRemoveSize();
				}
			}) );

		});

	});

})(
	FooGallery
);