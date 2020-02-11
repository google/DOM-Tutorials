/**
 * @license
 * Copyright 2012-2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
'use strict';

/**
 * Common code for the JavaScript DOM tutorials.
 * @author fraser@google.com (Neil Fraser)
 */

var Tutorial = {};

Tutorial.started = false;

if (console && console.log) {
  console.log('This is your JavaScript console.  You are ready to start.')
}

window.onbeforeunload = function() {
  if (Tutorial.started) {
    return 'Leaving this page will result in the loss of your work.';
  }
  return null;
};

Tutorial.showDiv = function(name, button) {
  var div = document.getElementById(name);
  div.style.display = 'block';
  button.disabled = true;
  Tutorial.started = true;

  var live = div.getElementsByTagName('textarea');
  var dead = [];
  for (var i = 0, ta; ta = live[i]; i++) {
    dead[i] = ta;
  }
  for (var i = 0, ta; ta = dead[i]; i++) {
    var codeMirror = CodeMirror.fromTextArea(ta,
        {lineNumbers: true,
         matchBrackets: true,
         viewportMargin: Infinity
        });
    ta.codeMirror = codeMirror;
    ta.getValue = ta.getValue || function() {return codeMirror.getValue();};
  }

  Tutorial.scrollToDiv(div);
};

Tutorial.scrollToDiv = function(div) {
  // Compute top/bottom of div.
  var el = div;
  var top = 0;
  var height = el.offsetHeight;
  while(el) {
    top += el.offsetTop;
    el = el.offsetParent;
  }
  var bottom = top + height;

  // Compute top/bottom of screen.
  var screenTop = window.pageYOffset;
  var screenBottom = window.pageYOffset + window.innerHeight;

  var STEP = 10;
  if (screenTop + STEP >= top) {
    // Don't scroll past the top of the element.
    return;
  }
  if (screenBottom >= bottom) {
    // Don't scroll past the bottom of the element.
    var tas = div.getElementsByTagName('textarea');
    if (tas[0]) {
      tas[0].codeMirror.focus();
    }
    return;
  }
  window.scrollBy(0, STEP);
  window.setTimeout(function() {Tutorial.scrollToDiv(div);}, 20);
};


Tutorial.execute = function(n) {
  Tutorial.setCorrect(n, false);
  var code = document.getElementById('code' + n).getValue();
  Tutorial.eval(code);
  var success = Tutorial.check[n]();
  if (success) {
    Tutorial.showDiv('solution' + n, document.getElementById('giveup' + n));
    Tutorial.setCorrect(n, true);
  }
};

Tutorial.setCorrect = function(n, correct) {
  var img = document.getElementById('yes_no' + n);
  if (!img) {
    img = document.createElement('IMG');
    img.id = 'yes_no' + n;
    var button = document.getElementById('execute' + n)
    button.insertBefore(img, button.firstChild);
  }
  if (correct === true) {
    img.src = 'yes.gif';
  } else if (correct === false) {
    img.src = 'no.gif';
  } else {
    img.src = '1x1.gif';
  }
};

Tutorial.onload = function() {
  // Firefox keeps the buttons disabled on reload.  Enable them all.
  var buttons = document.getElementsByTagName('BUTTON');
  for (var x = 0, button; button = buttons[x]; x++) {
    button.disabled = false;
  }
  // Firefox sometimes destroys the defalt code on reload.
  var textareas = document.getElementsByTagName('TEXTAREA');
  for (var x = 0, textarea; textarea = textareas[x]; x++) {
    textarea.value = textarea.defaultValue;
  }

  // Any custom load script for the page.
  Tutorial.pageInit && Tutorial.pageInit();

  // Syntax highlight all code.
  prettyPrint();

  // Google Analytics.
  var _gaq = [];
  _gaq.push(['_setAccount', 'UA-2152939-4']);
  _gaq.push(['_trackPageview']);
  var ga = document.createElement('script');
  ga.type = 'text/javascript';
  ga.async = true;
  ga.src = ('https:' == document.location.protocol ? 'https://ssl' :
            'http://www') + '.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0];
  s.parentNode.insertBefore(ga, s);
};

Tutorial.eval = function(nZR9_code) {
  // Prefix code variable so that it doesn't collide with the evaled code.
  if (nZR9_code.indexOf('getElementByID') != -1) {
    alert('Note the spelling of "getElementById".\n' +
          'It should have a lowercase "d".');
  }
  if (nZR9_code.indexOf('innerHtml') != -1) {
    alert('Note the spelling of "innerHTML".\n' +
          'It should have an uppercase "HTML".');
  }
  eval(nZR9_code);
};

Tutorial.trim = function(text) {
  return text.replace(/^\s+/, '').replace(/\s+$/, '');
};

Tutorial.listen = function(el, action, handler) {
  if (typeof el == 'string') {
    el = document.getElementById(el);
  }
  if (el.addEventListener) {
    // W3C Level2 event model is supported.
    el.addEventListener(action, handler, false);
  } else if (el.attachEvent) {
    // Microsoft event model is supported.
    el.attachEvent('on' + action, handler);
  }
};

Tutorial.listen(window, 'load', Tutorial.onload);
