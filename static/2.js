/**
 * @license
 * Copyright 2012-2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
'use strict';

/**
 * Code for Tutorial 2.
 * @author fraser@google.com (Neil Fraser)
 */

Tutorial.pageInit = function() {
  Tutorial.resetSection3();
};

Tutorial.check = [];
Tutorial.check[1] = function() {
  var field = document.getElementById('field');
  var imgs = field.getElementsByTagName('IMG');
  var text = field.innerHTML.indexOf('Wish upon a');
  var success =  text == -1 && imgs[0] && imgs[0].src.match(/star_on\.gif$/);
  return success;
};
Tutorial.check[2] = function() {
  return !document.getElementById('fallenstar');
};
Tutorial.check[3] = function() {
  var node = document.getElementById('target').lastChild;
  var success = node.tagName == 'IMG';
  return success;
};
Tutorial.check[4] = function() {
  var text = document.getElementById('math').lastChild;
  var success = Number(text.nodeValue) == 42;
  return success;
};
Tutorial.check[5] = function() {
  var img = document.getElementById('sky').lastChild;
  var success = img && img.src && !!img.src.match(/star_\w+\.gif$/);
  return success;
};

Tutorial.resetSection3 = function() {
  var span = document.getElementById('source');
  span && span.parentNode.removeChild(span);
  var span = document.getElementById('target');
  span && span.parentNode.removeChild(span);
  var span = document.getElementById('section3span');
  span.innerHTML = '<span id="source">Here\'s a star: <img src="star_on.gif"></span> <span id="target">Move it here: </span>';
  return true;
};

Tutorial.checkInnerHTML = function(n) {
  var code = document.getElementById('code' + n).getValue();
  if (code.indexOf('innerHTML') != -1) {
    alert('Bad programmer!\nYou are not suposed to be using "innerHTML"!');
    return false;
  }
  return true;
};

Tutorial.checkRemoveChild = function(n) {
  var code = document.getElementById('code' + n).getValue();
  if (code.indexOf('removeChild') != -1) {
    alert('There is no need to use "removeChild".\n' +
          'The node will be removed automatically\n' +
          'when it is appended to its new location.');
    return false;
  }
  return true;
};

Tutorial.testReset = function() {
  document.getElementById('rollercoaster').innerHTML = '&nbsp;';
  document.getElementById('testReset').disabled = true;
};

Tutorial.testRun = function() {
  document.getElementById('testReset').disabled = false;
  var code = document.getElementById('code6').getValue();
  Tutorial.eval(code);
};
