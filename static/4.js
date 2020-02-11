/**
 * @license
 * Copyright 2013-2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
'use strict';

/**
 * Code for Tutorial 4.
 * @author fraser@google.com (Neil Fraser)
 */

/*
   Provide the XMLHttpRequest constructor for Internet Explorer 5.x-6.x:
   Other browsers (including Internet Explorer 7.x-9.x) do not redefine
   XMLHttpRequest if it already exists.

   This example is based on findings at:
   http://blogs.msdn.com/xmlteam/archive/2006/10/23/using-the-right-version-of-msxml-in-internet-explorer.aspx
*/
if (typeof XMLHttpRequest === 'undefined') {
  XMLHttpRequest = function () {
    try { return new ActiveXObject('Msxml2.XMLHTTP.6.0'); }
    catch (e) {}
    try { return new ActiveXObject('Msxml2.XMLHTTP.3.0'); }
    catch (e) {}
    try { return new ActiveXObject('Microsoft.XMLHTTP'); }
    catch (e) {}
    // Microsoft.XMLHTTP points to Msxml2.XMLHTTP and is redundant
    throw new Error('This browser does not support XMLHttpRequest.');
  };
}

Tutorial.pageInit = function() {
  var sendAjax = function(file) {
    return function() {
      var req = new XMLHttpRequest();
      req.open('GET', file);
      req.onreadystatechange = myResponseHandler;
      req.send();
    };
  };
  Tutorial.listen('execute1', 'click', sendAjax('data.txt'));
  Tutorial.listen('execute2', 'click', sendAjax('data.txt'));
  Tutorial.listen('execute3', 'click', sendAjax('data.xml'));
  Tutorial.listen('execute4', 'click', sendAjax('data.json'));

  document.getElementById('code1').getValue =
      function() {return Tutorial.getNormalizedCode(1);};
  document.getElementById('code2').getValue =
      function() {return Tutorial.getNormalizedCode(2);};
  document.getElementById('code3').getValue =
      function() {return Tutorial.getNormalizedCode(3);};
  document.getElementById('code4').getValue =
      function() {return Tutorial.getNormalizedCode(4);};

  Tutorial.resetSection6();
};
var myResponseHandler = null;


Tutorial.check = [];
Tutorial.check[1] = function() {
};
Tutorial.check[2] = function() {
};
Tutorial.check[3] = function() {
};
Tutorial.check[4] = function() {
};
Tutorial.check[5] = function() {
  var a = document.getElementById('number1').value;
  var b = document.getElementById('number2').value;
  a = parseFloat(a) || 0;
  b = parseFloat(b) || 0;
  Tutorial.alertCount = 0;
  Tutorial.setCorrect(5, false);
  Tutorial.alertCallback = function(msg) {
    var ok = Tutorial.alertCount == 1 &&
        typeof msg == 'string' &&
        Tutorial.trim(msg) == a + b;
    Tutorial.setCorrect(5, ok);
    if (ok) {
      Tutorial.showDiv('solution5', document.getElementById('giveup5'));
    }
  };
};

Tutorial.alertCount = 0;
window.backupAlert_ = window.alert;
Tutorial.alertCallback = null;
window.alert = function(msg) {
  Tutorial.alertCount++;
  Tutorial.alertCallback && Tutorial.alertCallback(msg);
  window.backupAlert_(msg);
};

Tutorial.resetSection1 = function() {
  myResponseHandler = null;
  Tutorial.setCorrect(1, false);
  Tutorial.alertCallback = function() {
    Tutorial.setCorrect(1, true);
    Tutorial.showDiv('solution1', document.getElementById('giveup1'));
  };
};

Tutorial.resetSection2 = function() {
  myResponseHandler = null;
  Tutorial.alertCount = 0;
  Tutorial.setCorrect(2, false);
  Tutorial.alertCallback = function(msg) {
    var ok = Tutorial.alertCount == 1 &&
        typeof msg == 'string' &&
        Tutorial.trim(msg) == 'Hello from the server!';
    Tutorial.setCorrect(2, ok);
    if (ok) {
      Tutorial.showDiv('solution2', document.getElementById('giveup2'));
    }
  };
};

Tutorial.resetSection3 = function() {
  myResponseHandler = null;
  Tutorial.alertCount = 0;
  Tutorial.setCorrect(3, false);
  var code = document.getElementById('code3').getValue();
  if (code.indexOf('document.getElementById') != -1) {
    alert('The response is a separate document from the web page.\n' +
          'Use this.response.getDocumentById instead.');
    return;
  }
  if (code.indexOf('.name') != -1) {
    alert('Unlike for HTML nodes, XML attributes don\'t appear as properties.\n' +
          'Use .getAttribute(\'name\') instead of .name');
    return;
  }
  if (code.match(/\[["']name["']\]/)) {
    alert('Unlike for HTML nodes, XML attributes don\'t appear as properties.\n' +
          'Use .getAttribute(\'name\') instead of [\'name\']');
    return;
  }
  Tutorial.alertCallback = function(msg) {
    var ok = Tutorial.alertCount == 1 &&
        typeof msg == 'string' &&
        Tutorial.trim(msg) == 'Mr Snuggles';
    Tutorial.setCorrect(3, ok);
    if (ok) {
      Tutorial.showDiv('solution3', document.getElementById('giveup3'));
    }
  };
};

Tutorial.resetSection4 = function() {
  myResponseHandler = null;
  Tutorial.alertCount = 0;
  Tutorial.setCorrect(4, false);
  Tutorial.alertCallback = function(msg) {
    var ok = Tutorial.alertCount == 1 &&
        typeof msg == 'string' &&
        Tutorial.trim(msg) == 'Neil Armstrong';
    Tutorial.setCorrect(4, ok);
    if (ok) {
      Tutorial.showDiv('solution4', document.getElementById('giveup4'));
    }
  };
};

Tutorial.resetSection6 = function() {
  // Destroy the star grid and rebuild it to get rid of any handlers.
  var container = document.getElementById('playground6');
  container.innerHTML = '';
  //  <table id="star_table"></table>
  var table = document.createElement('table');
  table.id = 'star_table';
  container.appendChild(table);
  for (var y = 0; y < 10; y++) {
    var row = document.createElement('tr');
    table.appendChild(row);
    for (var x = 0; x < 10; x++) {
      var cell = document.createElement('td');
      var img = document.createElement('img');
      img.src = 'star_off.gif';
      img.id = 'star_' + (y * 10 + x);
      row.appendChild(cell);
      cell.appendChild(img);
    }
  }
};


Tutorial.getNormalizedCode = function(n) {
  // Normalize function declaration to "myResponseHandler = function() {...}".
  var code = document.getElementById('code' + n).codeMirror.getValue();
  code = code.replace(/\bvar\s+myResponseHandler\b/i, 'myResponseHandler');
  code = code.replace(/\bfunction\s+myResponseHandler\b/i, 'myResponseHandler = function');
  return code;
};

Tutorial.exercise = function() {
  var code = document.getElementById('code6').getValue();
  Tutorial.eval(code);
};
