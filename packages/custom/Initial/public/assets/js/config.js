! function(window, document, $) {
    "use strict";
    var $doc = $(document);
    $.site = $.site || {},
    $.extend($.site, {
        _queue: { 
            prepare: [],
            run: [],
            complete: [] 
        },
        run: function() {
            var self = this;
            this.dequeue("prepare", function() { 
                self.trigger("before.run", self) 
            }), 
            this.dequeue("run", function() { 
                self.dequeue("complete", function() { 
                    self.trigger("after.run", self) 
                }) 
            })
        },
        dequeue: function(name, done) {
            var self = this,
                queue = this.getQueue(name),
                fn = queue.shift(),
                next = function() { 
                    self.dequeue(name, done) 
                };
            fn ? fn.call(this, next) : $.isFunction(done) && done.call(this)
        },
        getQueue: function(name) {
            return $.isArray(this._queue[name]) || (this._queue[name] = []), 
            this._queue[name]
        },
        extend: function(obj) {
            return $.each(this._queue, function(name, queue) { 
                $.isFunction(obj[name]) && (queue.push(obj[name]), 
                delete obj[name]) 
            }), 
            $.extend(this, obj), this
        },
        trigger: function(name, data, $el) { 
            "undefined" != typeof name && ("undefined" == typeof $el && ($el = $doc), 
            $el.trigger(name + ".site", data)) 
        },
        throttle: function(func, wait) {
            var context, 
                args, 
                result, 
                _now = Date.now || function() {
                    return (new Date).getTime()
                },
                timeout = null,
                previous = 0,
                later = function() { 
                    previous = _now(), 
                    timeout = null, 
                    result = func.apply(context, args), 
                    context = args = null 
                };
            return function() {
                var now = _now(),
                    remaining = wait - (now - previous);
                return context = this, 
                args = arguments, 
                0 >= remaining ? (
                    clearTimeout(timeout), 
                    timeout = null, 
                    previous = now, 
                    result = func.apply(context, args), 
                    context = args = null
                ) : timeout || (timeout = setTimeout(later, remaining)), result
            }
        },
        resize: function() {
            if (document.createEvent) {
                var ev = document.createEvent("Event");
                ev.initEvent("resize", !0, !0), 
                window.dispatchEvent(ev)
            } else {
                element = document.documentElement;
                var event = document.createEventObject();
                element.fireEvent("onresize", event)
            }
        }
    }), 
    $.configs = $.configs || {}, 
    $.extend($.configs, {
        data: {},
        get: function(name) {
            for (var callback = function(data, name) {
                    return data[name]
                }, 
                data = this.data, i = 0; i < arguments.length; i++
            ) 
            name = arguments[i], data = callback(data, name);
            return data
        },
        set: function(name, value) { 
            this.data[name] = value 
        },
        extend: function(name, options) {
            var value = this.get(name);
            return $.extend(!0, value, options)
        }
    }), 
    $.colors = function(name, level) {
        if ("primary" === name && (name = $.configs.get("site", "primaryColor"), name || (name = "red")), "undefined" == typeof $.configs.colors) 
            return null;
        if ("undefined" != typeof $.configs.colors[name]) {
            if (level && "undefined" != typeof $.configs.colors[name][level]) 
                return $.configs.colors[name][level];
            if ("undefined" == typeof level) 
                return $.configs.colors[name]
        }
        return null
    }, 
    $.components = $.components || {}, 
    $.extend($.components, {
        _components: {},
        register: function(name, obj) { 
            this._components[name] = obj 
        },
        init: function(name, context, args) {
            var self = this;
            if ("undefined" == typeof name) 
                $.each(this._components, function(name) { 
                    self.init(name) 
                });
            else {
                context = context || document, args = args || [];
                var obj = this.get(name);
                if (obj) switch (obj.mode) {
                    case "default":
                        return this._initDefault(name, context);
                    case "init":
                        return this._initComponent(name, obj, context, args);
                    case "api":
                        return this._initApi(name, obj, args);
                    default:
                        return this._initApi(name, obj, context, args), 
                        void this._initComponent(name, obj, context, args)
                }
            }
        },
        call: function(name, context) {
            var args = Array.prototype.slice.call(arguments, 2),
                obj = this.get(name);
            return context = context || document, this._initComponent(name, obj, context, args)
        },
        _initDefault: function(name, context) {
            if ($.fn[name]) {
                var defaults = this.getDefaults(name);
                $("[data-plugin=" + name + "]", context).each(function() {
                    var $this = $(this),
                        options = $.extend(!0, {}, defaults, $this.data());
                    $this[name](options)
                })
            }
        },
        _initComponent: function(name, obj, context, args) { 
            $.isFunction(obj.init) && obj.init.apply(obj, [context].concat(args)) 
        },
        _initApi: function(name, obj, args) { 
            "undefined" == typeof obj.apiCalled && $.isFunction(obj.api) && (obj.api.apply(obj, args), obj.apiCalled = !0) 
        },
        getDefaults: function(name) {
            var component = this.get(name);
            return component && "undefined" != typeof component.defaults ? component.defaults : {}
        },
        get: function(name, property) {
            return "undefined" != typeof this._components[name] ? "undefined" != typeof property ? this._components[name][property] : this._components[name] : void 0
        }
    })
}(window, document, jQuery);
