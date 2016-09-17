!function(window, document, $) {
   "use strict";

   var $body = $("body");
   var $html = $("html");

   $.site.menubar = {
      opened: null,
      folded: null,
      disableHover: null,
      $instance: null,

      /**
       * Initialize the sidebar
       */
      init: function() {
         if ($html.removeClass("css-menubar").addClass("js-menubar"),
            this.$instance = $(".site-menubar"),
            0 !== this.$instance.length) {
            var self = this;
            $body.hasClass("site-menubar-open") ? this.opened = !0 : this.opened = !1,
            $body.hasClass("site-menubar-fold") ? this.folded = !0 : (
               this.folded = !1,
               this.scrollable.enable()
            ),
            $body.hasClass("site-menubar-disable-hover") || this.folded ? this.disableHover = !0 : (
               this.disableHover = !1,
               this.hover()
            ),
            this.$instance.on("changed.site.menubar", function() {
               self.update()
            })
         }
      },

      animate: function(doing, callback) {
         var self = this;
         $body.addClass("site-menubar-changing"),
         setTimeout(function() {
         	doing.call(self),
         	self.$instance.trigger("changing.site.menubar")
         }, 10),
         setTimeout(function() {
         	callback.call(self),
         	$body.removeClass("site-menubar-changing"),
         	self.$instance.trigger("changed.site.menubar")
         }, 250)
      },

      reset: function() {
      	this.opened = null,
      	$body.removeClass("site-menubar-open")
      },

      open: function() {
      	this.opened !== !0 && this.animate(function() {
      		$body.addClass("site-menubar-open"),
      		this.disableHover && $body.addClass("site-menubar-fixed"),
      		this.opened = !0 
      	},
      	function() { 
      		this.scrollable.enable(), 
      		null !== this.opened && $.site.resize() 
      	}) 
      },

      hide: function() { 
      	this.folded && this.scrollable.disable(), 
      	this.opened !== !1 && this.animate(function() { 
      		$body.removeClass("site-menubar-open site-menubar-fixed"), 
      		this.opened = !1 
      	}, 
      	function() { 
      		null !== this.opened && $.site.resize() 
      	}) 
      },

      hover: function() {
         var self = this;
         this.$instance.on("mouseenter", function() { 
         	$body.hasClass("site-menubar-fixed") || $body.hasClass("site-menubar-changing") || self.open() 
         }).on("mouseleave", function() { 
         	$body.hasClass("site-menubar-fixed") || self.hide() 
         })
      },

      toggle: function() {
         var opened = (
         	Breakpoints.current(), 
         	this.opened
         );
         null === opened || opened === !1 ? (
         	this.disableHover = !0, 
         	this.open()
         ) : (
         	this.disableHover = !1, 
         	this.hide()
         )
      },

      update: function() { 
      	this.scrollable.update() 
      },

      scrollable: {
         api: null,
         "native": !1,
         init: function() {
            return $body.is(".site-menubar-native") ? void(this["native"] = !0) : void(
            	this.api = $.site.menubar.$instance.children(".site-menubar-body").asScrollable({ 
            		namespace: "scrollable", 
            		skin: "scrollable-inverse", 
            		direction: "vertical", 
            		contentSelector: ">", 
            		containerSelector: ">" 
            	}).data("asScrollable")
            )
         },

         update: function() { 
         	this.api && this.api.update() 
         },

         enable: function() { 
         	this["native"] || (
         		this.api || this.init(), 
         		this.api && this.api.enable()
         	) 
         },
         
         disable: function() { 
         	this.api && this.api.disable() 
         }
      }
   }
}
(window, document, jQuery);
