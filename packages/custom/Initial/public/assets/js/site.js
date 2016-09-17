!function(window,document,$){
	"use strict";

	var $body=$(document.body);
	$.configs.set("site",{
		fontFamily:"Noto Sans, sans-serif",
		primaryColor:"indigo",
		assets:"../"
	}),
	window.Site=$.site.extend({
		run:function(next) {
			this.polyfillIEWidth(),
			"undefined"!=typeof $.site.menu && $.site.menu.init(),
			"undefined"!=typeof $.site.menubar && (
				$(".site-menubar").on("changing.site.menubar",function(){
					$('[data-toggle="menubar"]').each(function(){
						function toggle($el){
							$el.toggleClass(
								"hided",
								!$.site.menubar.opened
							),
							$el.toggleClass(
								"unfolded",
								!$.site.menubar.folded
							)
						}
						var $this=$(this),
						$hamburger=$(this).find(".hamburger");
						toggle($hamburger.length>0 ? $hamburger:$this)
					}),
					$.site.menu.refresh()
				}),
				$(document).on("click",'[data-toggle="collapse"]',function(e){
					var $trigger=$(e.target);
					$trigger.is('[data-toggle="collapse"]')||($trigger=$trigger.parents('[data-toggle="collapse"]'));
					var href,
					target=$trigger.attr("data-target")||(href=$trigger.attr("href"))&&href.replace(/.*(?=#[^\s]+$)/,""),
					$target=$(target);
					if($target.hasClass("navbar-search-overlap"))
						$target.find("input").focus(),
						e.preventDefault();
					else if("site-navbar-collapse"===$target.attr("id")) {
						var isOpen=!$trigger.hasClass("collapsed");
						$body.addClass("site-navbar-collapsing"),
						$body.toggleClass("site-navbar-collapse-show",isOpen),
						setTimeout(function(){
							$body.removeClass("site-navbar-collapsing")
						},350),
						isOpen&&$.site.menubar.scrollable.update()
					}
				}),
				$(document).on("click",'[data-toggle="menubar"]',function(){
					return $.site.menubar.toggle(),
					!1
				}),
				$.site.menubar.init()
			),
			"undefined"!=typeof $.site.gridmenu&&$.site.gridmenu.init(),
			"undefined"!=typeof $.site.sidebar&&$.site.sidebar.init(),
			$(document).tooltip({
				selector:"[data-tooltip=true]",
				container:"body"
			}),
			$('[data-toggle="tooltip"]').tooltip(),
			$('[data-toggle="popover"]').popover(),
			"undefined"!=typeof screenfull&&(
				$(document).on("click",'[data-toggle="fullscreen"]',
					function(){
						return screenfull.enabled&&screenfull.toggle(),
						!1
					}
				),
				screenfull.enabled&&document.addEventListener(
					screenfull.raw.fullscreenchange,
					function(){
						$('[data-toggle="fullscreen"]').toggleClass("active",screenfull.isFullscreen)
					}
				)
			),
			$body.on("click",".dropdown-menu-media",function(e){
				e.stopPropagation()
			}),
			"undefined"!=typeof $.animsition ? this.loadAnimate(function(){
				$(".animsition").css({
					"animation-duration":"0s"
				}),
				next()
			}):next(),
			$(document).on("click",".navbar-mega .dropdown-menu",function(e){
				e.stopPropagation()
			}),
			$(document).on("show.bs.dropdown",function(e){
				var $target=$(e.target),
				$trigger=e.relatedTarget ? $(e.relatedTarget):$target.children('[data-toggle="dropdown"]'),
				animation=$trigger.data("animation");
				if(animation) {
					var $menu=$target.children(".dropdown-menu");
					$menu.addClass("animation-"+animation),
					$menu.one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend",function(){
						$menu.removeClass("animation-"+animation)
					})
				}
			}),
			$(document).on("shown.bs.dropdown",function(e){
				var $target=$(e.target),
				$menu=$target.find(".dropdown-menu-media > .list-group");
				if($menu.length>0) {
					var api=$menu.data("asScrollable");
					if(api)
						api.update();
					else {
						var defaults=$.components.getDefaults("scrollable");
						$menu.asScrollable(defaults)
					}
				}
			});
			var pageAsideScroll=$('[data-plugin="pageAsideScroll"]');
			if(pageAsideScroll.length>0) {
				pageAsideScroll.asScrollable({
					namespace:"scrollable",
					contentSelector:"> [data-role='content']",
					containerSelector:"> [data-role='container']"
				});
				var pageAside=$(".page-aside"),
				scrollable=pageAsideScroll.data("asScrollable");
				scrollable&&((
					$body.is(".page-aside-fixed")||$body.is(".page-aside-scroll"))&&$(".page-aside").on("transitionend",function(){
						scrollable.update()
					}),
					Breakpoints.on("change",function() {
						var current=Breakpoints.current().name;
						$body.is(".page-aside-fixed")||$body.is(".page-aside-scroll")||(
							"xs"===current ? (
								scrollable.enable(),
								pageAside.on("transitionend",function(){
									scrollable.update()
								})
							):(
								pageAside.off("transitionend"),
								scrollable.disable()
							)
						)
					}),
					$(document).on("click.pageAsideScroll",".page-aside-switch",function() { 
						var isOpen=pageAside.hasClass("open");
						isOpen ? pageAside.removeClass("open") : (
							scrollable.update(),
							pageAside.addClass("open")
							)
					}),
					$(document).on("click.pageAsideScroll",'[data-toggle="collapse"]',function(e){ 
						var $trigger=$(e.target);
						$trigger.is('[data-toggle="collapse"]')||($trigger=$trigger.parents('[data-toggle="collapse"]'));
						var href,
						target=$trigger.attr("data-target")||(href=$trigger.attr("href"))&&href.replace(/.*(?=#[^\s]+$)/,""),
						$target=$(target);
						"site-navbar-collapse"===$target.attr("id")&&scrollable.update()
					})
				)}
				"undefined"!=typeof Waves && (
					Waves.init(),
					Waves.attach(".site-menu-item > a",["waves-classic"]),
					Waves.attach(".site-navbar .navbar-toolbar [data-toggle='menubar']",["waves-light","waves-round"]),
					Waves.attach(".page-header-actions .btn:not(.btn-inverse)",["waves-light","waves-round"]),
					Waves.attach(".page-header-actions .btn-inverse",["waves-classic","waves-round"]),
					Waves.attach(".page > div:not(.page-header) .btn:not(.ladda-button):not(.btn-round):not(.btn-pure):not(.btn-floating):not(.btn-flat)",["waves-light"]),
					Waves.attach(".page > div:not(.page-header) .btn-pure:not(.ladda-button):not(.btn-round):not(.btn-floating):not(.btn-flat):not(.icon)",["waves-classic"])
				),
				$.components.init(),
				this.startTour()
			},
			polyfillIEWidth:function(){
				if(navigator.userAgent.match(/IEMobile\/10\.0/)) {
					var msViewportStyle=document.createElement("style");
					msViewportStyle.appendChild(
						document.createTextNode("@-ms-viewport{width:auto!important}")
					),
					document.querySelector("head").appendChild(msViewportStyle)
				}
			},
			loadAnimate:function(callback) {
				return $.components.call("animsition",document,callback)
			},
			startTour:function(flag) {
				if("undefined"==typeof this.tour) {
					if("undefined"==typeof introJs)
						return;
					var tourOptions=$.configs.get("tour"),
					self=this;
					flag=$("body").css("overflow"),
					this.tour=introJs(),
					this.tour.onbeforechange(function() {
						$("body").css("overflow","hidden")
					}),
					this.tour.oncomplete(function() {
						$("body").css("overflow",flag)
					}),
					this.tour.onexit(function() {
						$("body").css("overflow",flag)
					}),
					this.tour.setOptions(tourOptions),
					$(".site-tour-trigger").on("click",function(){
						self.tour.start()
					})
				}
			}
		}
	)
}(window,document,jQuery);