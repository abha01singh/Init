! function(window, document, $) {
    "use strict";
    $.site.menu = {
        speed: 250,
        accordion: !0,
        //Initialize menubar by creating instance 
        init: function() {
            this.$instance = $(".site-menu"),
                0 !== this.$instance.length && this.bind()
        },
        bind: function() {
            var self = this;
            //show sidemenu on hover/mouseenter
            this.$instance.on("mouseenter.site.menu", ".site-menu-item", function() {
                    if ($.site.menubar.folded === !0 && $(this).is(".has-sub") && $(this).parent(".site-menu").length > 0) {
                        var $sub = $(this).children(".site-menu-sub");
                        self.position($(this), $sub)
                    }
                    $(this).addClass("hover")
                })
                //hide sidemenu on hover/mouseleave
                .on("mouseleave.site.menu", ".site-menu-item", function() {
                    $.site.menubar.folded === !0 && $(this).is(".has-sub") && $(this).parent(".site-menu").length > 0 && $(this).children(".site-menu-sub").css("max-height", ""),
                        $(this).removeClass("hover")
                }).on("deactive.site.menu", ".site-menu-item.active", function(e) {
                    var $item = $(this);
                    $item.removeClass("active"),
                        e.stopPropagation()
                }).on("active.site.menu", ".site-menu-item", function(e) {
                    var $item = $(this);
                    $item.addClass("active"),
                        e.stopPropagation()
                }).on("open.site.menu", ".site-menu-item", function(e) {
                    var $item = $(this);
                    self.expand($item, function() {
                            $item.addClass("open")
                        }),
                        self.accordion && $item.siblings(".open").trigger("close.site.menu"),
                        e.stopPropagation()
                }).on("close.site.menu", ".site-menu-item.open", function(e) {
                    var $item = $(this);
                    self.collapse($item, function() {
                            $item.removeClass("open")
                        }),
                        e.stopPropagation()
                }).on("click.site.menu", ".site-menu-item", function(e) {
                    $(this).is(".has-sub") && $(e.target).closest(".site-menu-item").is(this) ? $(this).is(".open") ? $(this).trigger("close.site.menu") : $(this).trigger("open.site.menu") : $(this).is(".active") || ($(this).siblings(".active").trigger("deactive.site.menu"),
                            $(this).trigger("active.site.menu")),
                        e.stopPropagation()
                }).on("scroll.site.menu", ".site-menu-sub", function(e) {
                    e.stopPropagation()
                })
        },
        collapse: function($item, callback) {
            var self = this,
                $sub = $item.children(".site-menu-sub");
            $sub.show().slideUp(this.speed, function() {
                $(this).css("display", ""),
                    $(this).find("> .site-menu-item").removeClass("is-shown"),
                    callback && callback(),
                    self.$instance.trigger("collapsed.site.menu")
            })
        },
        expand: function($item, callback) {
            var self = this,
                $sub = $item.children(".site-menu-sub"),
                $children = $sub.children(".site-menu-item").addClass("is-hidden");
            $sub.hide().slideDown(this.speed, function() {
                    $(this).css("display", ""),
                        callback && callback(),
                        self.$instance.trigger("expanded.site.menu")
                }),
                setTimeout(function() {
                    $children.addClass("is-shown"),
                        $children.removeClass("is-hidden")
                }, 0)
        },
        refresh: function() {
            this.$instance.find(".open").filter(":not(.active)").removeClass("open")
        },
        position: function($item, $dropdown) {
            var offsetTop = $item.position().top,
                menubarHeight = ($dropdown.outerHeight(), $.site.menubar.$instance.outerHeight()),
                itemHeight = $item.find("> a").outerHeight();
            $dropdown.removeClass("site-menu-sub-up").css("max-height", ""),
                offsetTop > menubarHeight / 2 ? ($dropdown.addClass("site-menu-sub-up"),
                    $.site.menubar.foldAlt && (offsetTop -= itemHeight),
                    $dropdown.css("max-height", offsetTop + itemHeight)) : (
                    $.site.menubar.foldAlt && (offsetTop += itemHeight),
                    $dropdown.removeClass("site-menu-sub-up"),
                    $dropdown.css("max-height", menubarHeight - offsetTop)
                )
        }
    }
}
(window, document, jQuery);
