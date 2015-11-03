# Carousel 3D
Responsive 3D carousel plugin.  Loaded with options! ES6 supported.  Strict mode supported. No dependencies. 2.32KB Minified.

<small>
Carousel3D v1.1.1
<br/>
(c) 2015 Clearwave Designs, LLC. http://clearwavedesigns.com
<br/>
License: Apache 2.0
</small>

<h2>API:</h2>
<ul>
  <li><strong>turn(</strong>degreeToTurnTo<strong>)</strong> // Accepts one parameter, the degree to turn to as an Int or Float</li>
  <li><strong>reset()</strong> // Use after new items are injected (post instantiation) to reset the carousel</li>
</ul>

<p>NOTE: It's up to the developer to use the turn method in association with any features he/she wants; such as: click navigating, slider navigation, keyboard navigating, swiping, spinning with an ease, etc. This is done for a smaller footprint of the core engine.</p>

<h2>Use:</h2>
<p><a href="http://codepen.io/clearwavedesigns/pen/QjxmxO" target="_blank"><strong>Live demo</strong></a></p>
<p>Create as many instances as you need for each of your carousels</p>
<pre>
var c = new Carousel3D({
  <strong>carousel:</strong> '.js-carousel1 div', // Required. Container for elements; as selector string
  <strong>items:</strong> '.js-carousel1 li', // Required. Elements to move around; as selector string
  <strong>itemsPercentOf:</strong> 0.25, // Optional. Percent of items width, relative to the carousel's width
  <strong>perspective:</strong> 0.25, // Optional. Percent relative to the width; as a decimal
  <strong>depth:</strong> 0.5, // Optional. Viewing depth percent; as a decimal
  <strong>float:</strong> 'left', // Optional internationalization ordering. "Float" items to the 'left' or 'right'
  <strong>animate:</strong> 250, // Optional. Animation duration in milleconds; as an int
  <strong>fps:</strong> 60, // Optional. Frames Per Second; as an int
  <strong>opacity:</strong> 0.125, // Optional. Opacity percent; as a decimal
  <strong>grayscale:</strong> 1, // Optional. Grayscale percent; as a decimal
  <strong>sepia:</strong> 1, // Optional. Sepia percent; as a decimal
  <strong>blur:</strong> 10 // Optional. Blur in pixels; as a number
});
</pre>

<br/>
<hr/>
<br/>

<h3>Additional Dev Snippets:</h3>
<pre>
var dev = {};
dev.degree = 0;
dev.incrementBy = 360 / document.querySelectorAll('.js-carousel1 li').length;

document.querySelector('.js-carousel1 .js-left').addEventListener('click', function() {
  dev.degree -= dev.incrementBy;
  dev.c1.turn(dev.degree);
});
document.querySelector('.js-carousel1 .js-right').addEventListener('click', function() {
  dev.degree += dev.incrementBy;
  dev.c1.turn(dev.degree);
});
document.querySelector('.js-carousel1 input[type="range"]').addEventListener('input', function() {
  dev.c1.turn(parseInt(this.value,10));
});
// You'll want to use the tabindex="-1" hack if you have more than one carousel
window.addEventListener('keydown', function(e) {
  if (e.keyCode === 37) {
    dev.degree -= dev.incrementBy;
    dev.c1.turn(dev.degree);
  } else if (e.keyCode === 39) {
    dev.degree += dev.incrementBy;
    dev.c1.turn(dev.degree);
  }
});
</pre>
