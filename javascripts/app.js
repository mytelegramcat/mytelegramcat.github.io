(function(/*! Brunch !*/) {
  'use strict';

  var globals = typeof window !== 'undefined' ? window : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};

  var has = function(object, name) {
    return ({}).hasOwnProperty.call(object, name);
  };

  var expand = function(root, name) {
    var results = [], parts, part;
    if (/^\.\.?(\/|$)/.test(name)) {
      parts = [root, name].join('/').split('/');
    } else {
      parts = name.split('/');
    }
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var dir = dirname(path);
      var absolute = expand(dir, name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var require = function(name, loaderPath) {
    var path = expand(name, '.');
    if (loaderPath == null) loaderPath = '/';

    if (has(cache, path)) return cache[path].exports;
    if (has(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has(cache, dirIndex)) return cache[dirIndex].exports;
    if (has(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '" from '+ '"' + loaderPath + '"');
  };

  var define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    } else {
      modules[bundle] = fn;
    }
  };

  var list = function() {
    var result = [];
    for (var item in modules) {
      if (has(modules, item)) {
        result.push(item);
      }
    }
    return result;
  };

  globals.require = require;
  globals.require.define = define;
  globals.require.register = define;
  globals.require.list = list;
  globals.require.brunch = true;
})();
require.register("initialize", function(exports, require, module) {
var MutationObserver, Util, WeakMap, getComputedStyle, getComputedStyleRX,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

Util = (function() {
  function Util() {}

  Util.prototype.extend = function(custom, defaults) {
    var key, value;
    for (key in defaults) {
      value = defaults[key];
      if (custom[key] == null) {
        custom[key] = value;
      }
    }
    return custom;
  };

  Util.prototype.isMobile = function(agent) {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(agent);
  };

  Util.prototype.addEvent = function(elem, event, fn) {
    if (elem.addEventListener != null) {
      return elem.addEventListener(event, fn, false);
    } else if (elem.attachEvent != null) {
      return elem.attachEvent("on" + event, fn);
    } else {
      return elem[event] = fn;
    }
  };

  Util.prototype.removeEvent = function(elem, event, fn) {
    if (elem.removeEventListener != null) {
      return elem.removeEventListener(event, fn, false);
    } else if (elem.detachEvent != null) {
      return elem.detachEvent("on" + event, fn);
    } else {
      return delete elem[event];
    }
  };

  Util.prototype.innerHeight = function() {
    if ('innerHeight' in window) {
      return window.innerHeight;
    } else {
      return document.documentElement.clientHeight;
    }
  };

  return Util;

})();

WeakMap = this.WeakMap || this.MozWeakMap || (WeakMap = (function() {
  function WeakMap() {
    this.keys = [];
    this.values = [];
  }

  WeakMap.prototype.get = function(key) {
    var i, item, _i, _len, _ref;
    _ref = this.keys;
    for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
      item = _ref[i];
      if (item === key) {
        return this.values[i];
      }
    }
  };

  WeakMap.prototype.set = function(key, value) {
    var i, item, _i, _len, _ref;
    _ref = this.keys;
    for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
      item = _ref[i];
      if (item === key) {
        this.values[i] = value;
        return;
      }
    }
    this.keys.push(key);
    return this.values.push(value);
  };

  return WeakMap;

})());

MutationObserver = this.MutationObserver || this.WebkitMutationObserver || this.MozMutationObserver || (MutationObserver = (function() {
  function MutationObserver() {
    if (typeof console !== "undefined" && console !== null) {
      console.warn('MutationObserver is not supported by your browser.');
    }
    if (typeof console !== "undefined" && console !== null) {
      console.warn('WOW.js cannot detect dom mutations, please call .sync() after loading new content.');
    }
  }

  MutationObserver.notSupported = true;

  MutationObserver.prototype.observe = function() {};

  return MutationObserver;

})());

getComputedStyle = this.getComputedStyle || function(el, pseudo) {
  this.getPropertyValue = function(prop) {
    var _ref;
    if (prop === 'float') {
      prop = 'styleFloat';
    }
    if (getComputedStyleRX.test(prop)) {
      prop.replace(getComputedStyleRX, function(_, _char) {
        return _char.toUpperCase();
      });
    }
    return ((_ref = el.currentStyle) != null ? _ref[prop] : void 0) || null;
  };
  return this;
};

getComputedStyleRX = /(\-([a-z]){1})/g;

this.WOW = (function() {
  WOW.prototype.defaults = {
    boxClass: 'wow',
    animateClass: 'animated',
    offset: 0,
    mobile: true,
    live: true,
    callback: null
  };

  function WOW(options) {
    if (options == null) {
      options = {};
    }
    this.scrollCallback = __bind(this.scrollCallback, this);
    this.scrollHandler = __bind(this.scrollHandler, this);
    this.start = __bind(this.start, this);
    this.scrolled = true;
    this.config = this.util().extend(options, this.defaults);
    this.animationNameCache = new WeakMap();
  }

  WOW.prototype.init = function() {
    var _ref;
    this.element = window.document.documentElement;
    if ((_ref = document.readyState) === "interactive" || _ref === "complete") {
      this.start();
    } else {
      this.util().addEvent(document, 'DOMContentLoaded', this.start);
    }
    return this.finished = [];
  };

  WOW.prototype.start = function() {
    var box, _i, _len, _ref;
    this.stopped = false;
    this.boxes = (function() {
      var _i, _len, _ref, _results;
      _ref = this.element.querySelectorAll("." + this.config.boxClass);
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        box = _ref[_i];
        _results.push(box);
      }
      return _results;
    }).call(this);
    this.all = (function() {
      var _i, _len, _ref, _results;
      _ref = this.boxes;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        box = _ref[_i];
        _results.push(box);
      }
      return _results;
    }).call(this);
    if (this.boxes.length) {
      if (this.disabled()) {
        this.resetStyle();
      } else {
        _ref = this.boxes;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          box = _ref[_i];
          this.applyStyle(box, true);
        }
      }
    }
    if (!this.disabled()) {
      this.util().addEvent(window, 'scroll', this.scrollHandler);
      this.util().addEvent(window, 'resize', this.scrollHandler);
      this.interval = setInterval(this.scrollCallback, 50);
    }
    if (this.config.live) {
      return new MutationObserver((function(_this) {
        return function(records) {
          var node, record, _j, _len1, _results;
          _results = [];
          for (_j = 0, _len1 = records.length; _j < _len1; _j++) {
            record = records[_j];
            _results.push((function() {
              var _k, _len2, _ref1, _results1;
              _ref1 = record.addedNodes || [];
              _results1 = [];
              for (_k = 0, _len2 = _ref1.length; _k < _len2; _k++) {
                node = _ref1[_k];
                _results1.push(this.doSync(node));
              }
              return _results1;
            }).call(_this));
          }
          return _results;
        };
      })(this)).observe(document.body, {
        childList: true,
        subtree: true
      });
    }
  };

  WOW.prototype.stop = function() {
    this.stopped = true;
    this.util().removeEvent(window, 'scroll', this.scrollHandler);
    this.util().removeEvent(window, 'resize', this.scrollHandler);
    if (this.interval != null) {
      return clearInterval(this.interval);
    }
  };

  WOW.prototype.sync = function(element) {
    if (MutationObserver.notSupported) {
      return this.doSync(this.element);
    }
  };

  WOW.prototype.doSync = function(element) {
    var box, _i, _len, _ref, _results;
    if (element == null) {
      element = this.element;
    }
    if (element.nodeType !== 1) {
      return;
    }
    element = element.parentNode || element;
    _ref = element.querySelectorAll("." + this.config.boxClass);
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      box = _ref[_i];
      if (__indexOf.call(this.all, box) < 0) {
        this.boxes.push(box);
        this.all.push(box);
        if (this.stopped || this.disabled()) {
          this.resetStyle();
        } else {
          this.applyStyle(box, true);
        }
        _results.push(this.scrolled = true);
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  WOW.prototype.show = function(box) {
    this.applyStyle(box);
    box.className = "" + box.className + " " + this.config.animateClass;
    if (this.config.callback != null) {
      return this.config.callback(box);
    }
  };

  WOW.prototype.applyStyle = function(box, hidden) {
    var delay, duration, iteration;
    duration = box.getAttribute('data-wow-duration');
    delay = box.getAttribute('data-wow-delay');
    iteration = box.getAttribute('data-wow-iteration');
    return this.animate((function(_this) {
      return function() {
        return _this.customStyle(box, hidden, duration, delay, iteration);
      };
    })(this));
  };

  WOW.prototype.animate = (function() {
    if ('requestAnimationFrame' in window) {
      return function(callback) {
        return window.requestAnimationFrame(callback);
      };
    } else {
      return function(callback) {
        return callback();
      };
    }
  })();

  WOW.prototype.resetStyle = function() {
    var box, _i, _len, _ref, _results;
    _ref = this.boxes;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      box = _ref[_i];
      _results.push(box.style.visibility = 'visible');
    }
    return _results;
  };

  WOW.prototype.customStyle = function(box, hidden, duration, delay, iteration) {
    if (hidden) {
      this.cacheAnimationName(box);
    }
    box.style.visibility = hidden ? 'hidden' : 'visible';
    if (duration) {
      this.vendorSet(box.style, {
        animationDuration: duration
      });
    }
    if (delay) {
      this.vendorSet(box.style, {
        animationDelay: delay
      });
    }
    if (iteration) {
      this.vendorSet(box.style, {
        animationIterationCount: iteration
      });
    }
    this.vendorSet(box.style, {
      animationName: hidden ? 'none' : this.cachedAnimationName(box)
    });
    return box;
  };

  WOW.prototype.vendors = ["moz", "webkit"];

  WOW.prototype.vendorSet = function(elem, properties) {
    var name, value, vendor, _results;
    _results = [];
    for (name in properties) {
      value = properties[name];
      elem["" + name] = value;
      _results.push((function() {
        var _i, _len, _ref, _results1;
        _ref = this.vendors;
        _results1 = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          vendor = _ref[_i];
          _results1.push(elem["" + vendor + (name.charAt(0).toUpperCase()) + (name.substr(1))] = value);
        }
        return _results1;
      }).call(this));
    }
    return _results;
  };

  WOW.prototype.vendorCSS = function(elem, property) {
    var result, style, vendor, _i, _len, _ref;
    style = getComputedStyle(elem);
    result = style.getPropertyCSSValue(property);
    _ref = this.vendors;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      vendor = _ref[_i];
      result = result || style.getPropertyCSSValue("-" + vendor + "-" + property);
    }
    return result;
  };

  WOW.prototype.animationName = function(box) {
    var animationName;
    try {
      animationName = this.vendorCSS(box, 'animation-name').cssText;
    } catch (_error) {
      animationName = getComputedStyle(box).getPropertyValue('animation-name');
    }
    if (animationName === 'none') {
      return '';
    } else {
      return animationName;
    }
  };

  WOW.prototype.cacheAnimationName = function(box) {
    return this.animationNameCache.set(box, this.animationName(box));
  };

  WOW.prototype.cachedAnimationName = function(box) {
    return this.animationNameCache.get(box);
  };

  WOW.prototype.scrollHandler = function() {
    return this.scrolled = true;
  };

  WOW.prototype.scrollCallback = function() {
    var box;
    if (this.scrolled) {
      this.scrolled = false;
      this.boxes = (function() {
        var _i, _len, _ref, _results;
        _ref = this.boxes;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          box = _ref[_i];
          if (!(box)) {
            continue;
          }
          if (this.isVisible(box)) {
            this.show(box);
            continue;
          }
          _results.push(box);
        }
        return _results;
      }).call(this);
      if (!(this.boxes.length || this.config.live)) {
        return this.stop();
      }
    }
  };

  WOW.prototype.offsetTop = function(element) {
    var top;
    while (element.offsetTop === void 0) {
      element = element.parentNode;
    }
    top = element.offsetTop;
    while (element = element.offsetParent) {
      top += element.offsetTop;
    }
    return top;
  };

  WOW.prototype.isVisible = function(box) {
    var bottom, offset, top, viewBottom, viewTop;
    offset = box.getAttribute('data-wow-offset') || this.config.offset;
    viewTop = window.pageYOffset;
    viewBottom = viewTop + Math.min(this.element.clientHeight, this.util().innerHeight()) - offset;
    top = this.offsetTop(box);
    bottom = top + box.clientHeight;
    return top <= viewBottom && bottom >= viewTop;
  };

  WOW.prototype.util = function() {
    return this._util != null ? this._util : this._util = new Util();
  };

  WOW.prototype.disabled = function() {
    return !this.config.mobile && this.util().isMobile(navigator.userAgent);
  };

  if ($("form").length) {
    $(".send").click(function(e) {
      var text;
      e.preventDefault();
      if ($(".contact_form textarea").val() === "" || $(".contact_form input[name=name]").val() === "" || $(".contact_form input[name=contact]").val() === "") {

      } else {
        $(".send_text").hide();
        $(".loader").show();
        $(".form .button").css("padding", "6px 0");
        text = "Текст сообщения: \n " + ($('.contact_form textarea').val()) + " \n\n Отправитель: " + ($('.contact_form input[name=name]').val()) + "\n\n Обратная связь: " + ($('.contact_form input[name=contact]').val()) + "\n";
        return $.post("http://mesto-mailer.herokuapp.com/send_mail", {
          text: text
        }, function(data) {
          $(".send_text").show();
          $(".loader").hide();
          $(".form .button").css("padding", "18px 0");
          if (JSON.parse("" + data).status === "ok") {
            sweetAlert("Спасибо!", " Скоро ответим.", "success");
            $(".contact_form textarea").val("");
            $(".contact_form input[name=name]").val("");
            $(".contact_form input[name=contact]").val("");
            return yaCounter27512697.reachGoal("FEEDBACK");
          } else {
            return sweetAlert("Что-то пошло не так", "", "error");
          }
        });
      }
    });
  }

  return WOW;

})();
});

;require.register("main", function(exports, require, module) {
$.ripple("button", {
    debug: false, // Turn Ripple.js logging on/off
    on: 'mousedown', // The event to trigger a ripple effect

    opacity: 0.4, // The opacity of the ripple
    color: "auto", // Set the background color. If set to "auto", it will use the text color
    multi: true, // Allow multiple ripples per element

    duration: 0.5, // The duration of the ripple

    // Filter function for modifying the speed of the ripple
    rate: function(pxPerSecond) {
        return pxPerSecond;
    },

    easing: 'linear' // The CSS3 easing function of the ripple
})

$(document).ready(function() {
    var s = $(".header");

    var pos = s.position();                   
    $(window).scroll(function() {
        var windowpos = $(window).scrollTop();
        
        if (windowpos >= pos.top) {
            s.addClass("stick");
            $(".hiden").fadeIn("100");
            $(".spec").fadeIn("100");
                

         
        } else {
            s.removeClass("stick");

            $(".hiden").fadeOut("100");     
            $(".spec").fadeOut("100");

        }
    });
});

$(document).ready(function(){
  $('a[href*=#]').click(function() {
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'')
    && location.hostname == this.hostname) {
      var $target = $(this.hash);
      $target = $target.length && $target
      || $('[name=' + this.hash.slice(1) +']');
      if ($target.length) {
        var targetOffset = $target.offset().top;
        $('html,body')
        .animate({scrollTop: targetOffset}, 1000);
       return false;
      }
    }
  });
});



jQuery(document).ready(function($) {
  $("#form").submit(function() {
    var str = $(this).serialize();
    console.log(str);
      $.ajax({
      type: "POST",
      url: "contact.php",
      data: str,
      success: function(msg) {
      if(msg == 'OK') {
      result = 'Ваше сообщение было отправлено';
      } else {
      result = msg;
      }
      alert(result);
      }
      });
      return false;
    });
});


$(document).ready(function(){
  var navOffset = $("nav").offset().top;

  $("nav").wrap('<div class="nav-placeholder"></div>');
  $(".nav-placeholder").height($("nav").outerHeight());

  $(window).scroll(function(){
    var scrollPos = $(window).scrollTop();

    if (scrollPos >= navOffset) {
      $("nav").addClass("fixed");
    } else {
      $("nav").removeClass("fixed");
    }
  });
});


var didScroll;
var lastScrollTop = 0;
var delta = 5;
var navbarHeight = $('nav').outerHeight();

$(window).scroll(function(event){
    didScroll = true;
});

setInterval(function() {
    if (didScroll) {
        hasScrolled();
        didScroll = false;
    }
}, 250);

// Hide Header on on scroll down
var didScroll;
var lastScrollTop = 0;
var delta = 5;
var navbarHeight = $('nav').outerHeight();

$(window).scroll(function(event){
    didScroll = true;
});

setInterval(function() {
    if (didScroll) {
        hasScrolled();
        didScroll = false;
    }
}, 250);

function hasScrolled() {
    var st = $(this).scrollTop();
    
    // Make sure they scroll more than delta
    if(Math.abs(lastScrollTop - st) <= delta)
        return;
    
    // If they scrolled down and are past the navbar, add class .nav-up.
    // This is necessary so you never see what is "behind" the navbar.
    if (st > lastScrollTop && st > navbarHeight){
        // Scroll Down
        $('nav').addClass('nav-up');
    } else {
        // Scroll Up
        if(st + $(window).height() < $(document).height()) {
            $('nav').removeClass('nav-up');
        }
    }
    
    lastScrollTop = st;
}


});

;
//# sourceMappingURL=app.js.map