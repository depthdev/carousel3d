/*
 Carousel3D v1.0.0
 (c) 2015 Clearwave Designs, LLC. http://clearwavedesigns.com
 License: Apache 2.0
*/

class Carousel3D {
  
  constructor(o) {
    // Helpers
    const $=function(s){return document.querySelector(s)};
    const $$=function(s){let nl=document.querySelectorAll(s),a=[];for(let i=0,l=nl.length;i<l;i++){a[i]=nl[i]}return a};
    
    // General
    let box = $(o.box);
    let points = $$(o.points);
    let pointsPercentOf = o.pointsPercentOf || 0.25;
    let perspective = o.perspective || o.perspective === 0 ? o.perspective : 0.25;
    let depth = o.depth || o.depth === 0 ? 1 / o.depth : 2;
    let float = o.float || 'left';
    
    // Filters
    let filterOpacity = o.opacity ? o.opacity : 1;
    let filterGrayscale = o.grayscale ? o.grayscale : 0;
    let filterSepia = o.sepia ? o.sepia : 0;
    let filterBlur = o.blur ? o.blur : 0;
    
    // Math Dependencies
    let pointWidthAndHeight = '';
    let pointMargin = '';

    let widthRadius = 0;
    let heightRadius = 0;

    let degrees = [];
    let degree = 0;
    
    let len = points.length;
    let half = Math.ceil(len / 2);
    let incBy = 360 / len;

    
    
    // Animation
    let animate = o.animate || o.animate === 0 ? o.animate : 0;
    let fps = o.fps || o.fps === 0 ? o.fps : 62.5;
    let speed = animate ? animate / fps : 0;
    let divisions = animate ? animate / speed : 1;
    
    let fromDegree = 0;
    let toDegreeHigher = null;
    let degreesToAnimateBy = 0;
    let turning = function() {
      fromDegree += degreesToAnimateBy;
      let goToDegree = fromDegree < 0 ? 360 - ((-1 * fromDegree) % 360) : fromDegree;
      turn(goToDegree);
    };
    let animating = function() {
      setTimeout(function() {
        toDegreeHigher ? fromDegree >= degree ? clearTimeout(this) : (turning(), animating()) : fromDegree <= degree ? clearTimeout(this) : (turning(), animating());
      }, speed);
    };
    
    // Run
    let run = function(extDegree) {
      if (animate) {
        let turnTo = extDegree;
        toDegreeHigher = turnTo > degree;
        fromDegree = degree;
        degree = turnTo;
        degreesToAnimateBy = (degree - fromDegree) / divisions;
        animating();
      } else {
        turn(extDegree);
        console.log('here');
      }
    };

    // Turn
    let turn = function(deg) {
      let i = 0;
      var d = []; // new degrees array
      for (;i<len;i++) {
        d[i] = degrees[i] + deg + 90;
      }
      i = 0;
      for (;i<len;i++) {
        let r = d[i] * Math.PI / 180;
        let rr = ((degrees[i] + deg) % 360) * Math.PI / 180;
        let percentAsDecimal = rr < Math.PI ? rr / Math.PI : ((Math.PI * 2) - rr) / Math.PI;
        let s = rr > Math.PI ? 1 - ((Math.PI - (rr - Math.PI)) / (Math.PI * depth)) : 1 - (rr / (Math.PI * depth));
        let x = widthRadius * Math.cos(r) + widthRadius;
        let y = heightRadius * Math.sin(r) + heightRadius;
        let z = (function() {
          var degreeMod360 = (degrees[i] + deg + 180) % 360;
          return Math.round(degreeMod360 > 180 ? (180 - (degreeMod360 - 180)) / incBy : degreeMod360 / incBy);
        }());
        
        let p = 'position:absolute;z-index:' + z + ';left:' + x + 'px;top:' + y + 'px;' + pointMargin + pointWidthAndHeight +
            '-webkit-transform:scale(' + s + ',' + s + ');' +
            '-moz-transform:scale(' + s + ',' + s + ');' +
            '-ms-transform:scale(' + s + ',' + s + ');' +
            '-o-transform:scale(' + s + ',' + s + ');' +
            'transform:scale(' + s + ',' + s + ');';

        let fOpacity = 'opacity:' + (filterOpacity < 1 ? 1 - ((1 - (1 * filterOpacity)) * percentAsDecimal) : 1) + ';';
        let fGrayscale = 'grayscale(' + (filterGrayscale ? (1 * filterGrayscale) * percentAsDecimal : 0) + ')';
        let fSepia = 'sepia('+ (filterSepia ? (1 * filterSepia) * percentAsDecimal : 0) + ')';
        let fBlur = 'blur('+ (filterBlur ? (filterBlur * percentAsDecimal) : 0) + 'px)';
        let f = fOpacity +
            '-webkit-filter:' + fGrayscale + ' ' + fSepia + ' ' + fBlur + ';' +
            '-moz-filter:' + fGrayscale + ' ' + fSepia + ' ' + fBlur + ';' +
            '-ms-filter:' + fGrayscale + ' ' + fSepia + ' ' + fBlur + ';' +
            '-o-filter:' + fGrayscale + ' ' + fSepia + ' ' + fBlur + ';' +
            'filter:' + fGrayscale + ' ' + fSepia + ' ' + fBlur + ';';
        
        points[i].style.cssText = p + f;
      }  
    }; // turn

    // Reset
    let reset = function() {
      // Box size
      let boxWidth = box.offsetWidth;
      let boxHeight = boxWidth * perspective;
      box.style.height = boxHeight + 'px';
      // Points size
      let aspectPointWidth = points[0].offsetWidth;
      let aspectPointHeight = points[0].offsetHeight;
      let pointAspectRatio = aspectPointHeight / aspectPointWidth;
      let pointWidthNum = boxWidth * pointsPercentOf;
      pointWidthAndHeight = 'width:' + pointWidthNum + 'px;height:auto;';
      pointMargin = 'margin:-' + ((pointWidthNum * pointAspectRatio) / 2) + 'px auto auto -' + (pointWidthNum / 2) + 'px;';
      // Math
      widthRadius = boxWidth / 2;
      heightRadius = boxHeight / 2;
      degrees = [float === 'left' ? 360 : 0]; // Reset degrees and first elem
      for (let i=1;i<len;i++) {
        degrees.push(float === 'left' ? 360 - Math.floor(i * incBy) : Math.floor(i * incBy));
      }
      // Position the points
      turn(0);
    };

    // Init
    (function() {
      box.style.position = 'relative';
      reset.bind(this)();
      window.addEventListener('load', reset.bind(this));
      window.addEventListener('resize',reset.bind(this));
    }.bind(this))()

    // Dev API
    return {
      turn: run
    }
  
  } // constructor
  
  
} // Carousel3D
