/*
 Carousel3D v1.1.1
 (c) 2015 Clearwave Designs, LLC. http://clearwavedesigns.com
 License: Apache 2.0
*/

function Carousel3D(o) {
  
    // Helpers
    var $=function(s){return document.querySelector(s)};
    var $$=function(s){var nl=document.querySelectorAll(s),a=[];for(var i=0,l=nl.length;i<l;i++){a[i]=nl[i]}return a};
    
    // General
    var carouselStr = o.carousel;
    var carousel = $(carouselStr);
    var itemsStr = o.items;
    var items = $$(itemsStr);
    var itemsPercentOf = o.itemsPercentOf || 0.25;
    var perspective = o.perspective || o.perspective === 0 ? o.perspective : 0.25;
    var depth = o.depth || o.depth === 0 ? 1 / o.depth : 2;
    var float = o.float || 'left';
    
    // Filters
    var filterOpacity = o.opacity ? o.opacity : 1;
    var filterGrayscale = o.grayscale ? o.grayscale : 0;
    var filterSepia = o.sepia ? o.sepia : 0;
    var filterBlur = o.blur ? o.blur : 0;
    
    // Math Dependencies
    var itemWidthAndHeight = '';
    var itemMargin = '';

    var widthRadius = 0;
    var heightRadius = 0;

    var degrees = [];
    var degree = 0;
    
    var len = items.length;
    var half = Math.ceil(len / 2);
    var incBy = 360 / len;

    
    
    // Animation
    var animate = o.animate || o.animate === 0 ? o.animate : 0;
    var fps = o.fps || o.fps === 0 ? o.fps : 62.5;
    var speed = animate ? animate / fps : 0;
    var divisions = animate ? animate / speed : 1;
    
    var fromDegree = 0;
    var toDegreeHigher = null;
    var degreesToAnimateBy = 0;
    var turning = function() {
      fromDegree += degreesToAnimateBy;
      var goToDegree = fromDegree < 0 ? 360 - ((-1 * fromDegree) % 360) : fromDegree;
      turn(goToDegree);
    };
    var animating = function() {
      setTimeout(function() {
        toDegreeHigher ? fromDegree >= degree ? clearTimeout(this) : (turning(), animating()) : fromDegree <= degree ? clearTimeout(this) : (turning(), animating());
      }, speed);
    };
    
    // Run
    var run = function(extDegree) {
      if (animate) {
        var turnTo = extDegree;
        toDegreeHigher = turnTo > degree;
        fromDegree = degree;
        degree = turnTo;
        degreesToAnimateBy = (degree - fromDegree) / divisions;
        animating();
      } else {
        turn(extDegree);
      }
    };

    // Turn
    var turn = function(deg) {
      var i = 0;
      var d = []; // new degrees array
      for (;i<len;i++) {
        d[i] = degrees[i] + deg + 90;
      }
      i = 0;
      for (;i<len;i++) {
        var r = d[i] * Math.PI / 180;
        var rr = ((degrees[i] + deg) % 360) * Math.PI / 180;
        var percentAsDecimal = rr < Math.PI ? rr / Math.PI : ((Math.PI * 2) - rr) / Math.PI;
        var s = rr > Math.PI ? 1 - ((Math.PI - (rr - Math.PI)) / (Math.PI * depth)) : 1 - (rr / (Math.PI * depth));
        var x = widthRadius * Math.cos(r) + widthRadius;
        var y = heightRadius * Math.sin(r) + heightRadius;
        var z = (function() {
          var degreeMod360 = (degrees[i] + deg + 180) % 360;
          return Math.round(degreeMod360 > 180 ? (180 - (degreeMod360 - 180)) / incBy : degreeMod360 / incBy);
        }());
        
        var p = 'position:absolute;z-index:' + z + ';left:' + x + 'px;top:' + y + 'px;' + itemMargin + itemWidthAndHeight +
            '-webkit-transform:scale(' + s + ',' + s + ');' +
            '-moz-transform:scale(' + s + ',' + s + ');' +
            '-ms-transform:scale(' + s + ',' + s + ');' +
            '-o-transform:scale(' + s + ',' + s + ');' +
            'transform:scale(' + s + ',' + s + ');';

        var fOpacity = 'opacity:' + (filterOpacity < 1 ? 1 - ((1 - (1 * filterOpacity)) * percentAsDecimal) : 1) + ';';
        var fGrayscale = 'grayscale(' + (filterGrayscale ? (1 * filterGrayscale) * percentAsDecimal : 0) + ')';
        var fSepia = 'sepia('+ (filterSepia ? (1 * filterSepia) * percentAsDecimal : 0) + ')';
        var fBlur = 'blur('+ (filterBlur ? (filterBlur * percentAsDecimal) : 0) + 'px)';
        var f = fOpacity +
            '-webkit-filter:' + fGrayscale + ' ' + fSepia + ' ' + fBlur + ';' +
            '-moz-filter:' + fGrayscale + ' ' + fSepia + ' ' + fBlur + ';' +
            '-ms-filter:' + fGrayscale + ' ' + fSepia + ' ' + fBlur + ';' +
            '-o-filter:' + fGrayscale + ' ' + fSepia + ' ' + fBlur + ';' +
            'filter:' + fGrayscale + ' ' + fSepia + ' ' + fBlur + ';';
        
        items[i].style.cssText = p + f;
      }  
    }; // turn

    // Reset
    var reset = function() {
      // Carousel size
      var carouselWidth = carousel.offsetWidth;
      var carouselHeight = carouselWidth * perspective;
      carousel.style.height = carouselHeight + 'px';
      // Items size
      var aspectPointWidth = items[0].offsetWidth;
      var aspectPointHeight = items[0].offsetHeight;
      var itemAspectRatio = aspectPointHeight / aspectPointWidth;
      var itemWidthNum = carouselWidth * itemsPercentOf;
      itemWidthAndHeight = 'width:' + itemWidthNum + 'px;height:auto;';
      itemMargin = 'margin:-' + ((itemWidthNum * itemAspectRatio) / 2) + 'px auto auto -' + (itemWidthNum / 2) + 'px;';
      // Math
      widthRadius = carouselWidth / 2;
      heightRadius = carouselHeight / 2;
      degrees = [float === 'left' ? 360 : 0]; // Reset degrees and first elem
      for (var i=1;i<len;i++) {
        degrees.push(float === 'left' ? 360 - Math.floor(i * incBy) : Math.floor(i * incBy));
      }
      // Position the items
      turn(0);
    };
    
    // Hard reset
    var hardReset = function() {
      carousel = $(carouselStr);
      items = $$(itemsStr);
      len = items.length;
      half = Math.ceil(len / 2);
      incBy = 360 / len;
      reset();
    };

    // Init
    (function() {
      carousel.style.position = 'relative';
      reset.bind(this)();
      window.addEventListener('load', reset.bind(this));
      window.addEventListener('resize',reset.bind(this));
    }.bind(this))()

    // Dev API
    return {
      turn: run,
      reset: hardReset
    }
  
} // Carousel3D
