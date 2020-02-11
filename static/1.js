/**
 * @license
 * Copyright 2012-2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
'use strict';

/**
 * Code for Tutorial 1.
 * @author fraser@google.com (Neil Fraser)
 */

Tutorial.pageInit = function() {
  Tutorial.testReset();
};

Tutorial.check = [];
Tutorial.check[1] = function() {
  var src = document.getElementById('star').src;
  var success = !!src.match(/star_on\.gif$/);
  return success;
};
Tutorial.check[2] = function() {
  var span = document.getElementById('stars');
  var src0 = span.childNodes[0].src;
  var src1 = span.childNodes[1].src;
  var src2 = span.childNodes[2].src;
  var success0 = !!src0.match(/star_off\.gif$/);
  var success1 = !!src1.match(/star_on\.gif$/);
  var success2 = !!src2.match(/star_off\.gif$/);
  return success0 && success1 && success2;
};
Tutorial.check[3] = function() {
  var src = document.getElementById('phrase').lastChild.firstChild.src;
  var success = !!src.match(/star_on\.gif$/);
  return success;
};
Tutorial.check[4] = function() {
  var star = document.getElementById('laststar');
  var src0 = star.previousSibling.previousSibling.src;
  var src1 = star.previousSibling.src;
  var src2 = star.src;
  var success0 = !!src0.match(/star_on\.gif$/);
  var success1 = !!src1.match(/star_off\.gif$/);
  var success2 = !!src2.match(/star_off\.gif$/);
  return success0 && success1 && success2;
};
Tutorial.check[5] = function() {
  var src =
      document.getElementById('start_here').parentNode.nextSibling.lastChild.src;
  var success = !!src.match(/star_on\.gif$/);
  return success;
};

Tutorial.checkStarOn = function(n) {
  var code = document.getElementById('code' + n).getValue();
  if (code.indexOf('star_on.gif') == -1) {
    var m = code.match(/star.?o[nf]+\.?\w*/i);
    if (m) {
      alert('Did you mean to type \'star_on.gif\'\n' +
            'instead of \'' + m[0] + '\'?');
      return false;
    }
  }
  return true;
};

Tutorial.resetSection2 = function() {
  // Students often flip the wrong star, then get all confused when they flip
  // the right star and don't realize they have to unflip the wrong star.
  // Flip all stars off to reset the question.
  var stars = document.getElementById('stars').getElementsByTagName('img');
  for (var x = 0, img; img = stars[x]; x++) {
    img.src = 'star_off.gif';
  }
};

Tutorial.resetSection4 = function() {
  // Students often flip the wrong star, then get all confused when they flip
  // the right star and don't realize they have to unflip the wrong star.
  // Flip all stars off to reset the question.
  var stars = document.getElementById('laststar').parentNode
      .getElementsByTagName('img');
  for (var x = 0, img; img = stars[x]; x++) {
    img.src = 'star_off.gif';
  }
};

Tutorial.testNode = null;
Tutorial.testTempSpan = null;

Tutorial.testReset = function() {
  Tutorial.removeTestTempSpan();
  if (Tutorial.testNode && Tutorial.testNode.style) {
    Tutorial.testNode.style.border = '';
  }
  Tutorial.testNode = document.getElementById('section6');
  document.getElementById('testStep').disabled = false;
  document.getElementById('testReset').disabled = true;
};

// Create nextNode placeholder.
var nextNode;

Tutorial.testStep = function() {
  nextNode = null;
  document.getElementById('testReset').disabled = false;
  Tutorial.removeTestTempSpan();
  var code = document.getElementById('code6').getValue();
  Tutorial.eval(code);
  if (Tutorial.testNode.style) {
    Tutorial.testNode.style.border = '';
  }
  if (nextNode) {
    var newNode = nextNode(Tutorial.testNode);
    if (newNode == Tutorial.testNode) {
      throw 'nextNode returned the same node it was given.'
    }
    Tutorial.testNode = newNode;
  } else {
    Tutorial.testNode = null;
    alert('Error: nextNode function not found.');
  }
  if (!Tutorial.testNode) {
    document.getElementById('testStep').disabled = true;
    return;
  }
  if (Tutorial.testNode.nodeName == 'BR') {
    // Can't highlight a linebreak.
    Tutorial.testStep();
  } else if (Tutorial.testNode.style) {
    // Give a border to this node.
    Tutorial.testNode.style.border = 'solid #0d0 1px';
  } else if (Tutorial.testNode.nodeType == 3 &&
             Tutorial.trim(Tutorial.testNode.nodeValue) != '' &&
             Tutorial.testNode.parentNode.nodeName != 'TEXTAREA') {
    // Give a background to this text node.
    Tutorial.testTempSpan = document.createElement('SPAN');
    Tutorial.testTempSpan.style.background = '#6f6';
    Tutorial.testNode.parentNode.insertBefore(Tutorial.testTempSpan,
                                              Tutorial.testNode);
    Tutorial.testTempSpan.appendChild(Tutorial.testNode);
  } else {
    // Skip this empty whitespace node.
    Tutorial.testStep();
  }
};

Tutorial.removeTestTempSpan = function() {
  if (Tutorial.testTempSpan) {
    Tutorial.testTempSpan.parentNode.insertBefore(
        Tutorial.testTempSpan.firstChild, Tutorial.testTempSpan);
    Tutorial.testTempSpan.parentNode.removeChild(Tutorial.testTempSpan);
    Tutorial.testTempSpan = null;
  }
};
